const Trip = require("../models/trip");
const Bag = require("../models/bag");
const Category = require("../models/category");
const Item = require("../models/item");
const ChangeLog = require("../models/changelog");
const User = require("../models/user");
const Article = require("../models/article");
const {
  generateRegisterHTML,
  sendEmail,
  generateForgotPasswordHTML,
  reportEmail,
  sendReportEmail,
} = require("../emails/email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const s3 = require("../config/s3Config");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const ensureOwner = (user, query = {}) => {
  if (!user) throw new Error("Not authenticated");
  return { ...query, owner: user.userId };
};

const getCurrentTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[-:.]/g, "");
};

const weightConversionRates = {
  lb: { lb: 1, kg: 0.453592, g: 453.592, oz: 16 },
  kg: { lb: 2.20462, kg: 1, g: 1000, oz: 35.274 },
  g: { lb: 0.00220462, kg: 0.001, g: 1, oz: 0.035274 },
  oz: { lb: 0.0625, kg: 0.0283495, g: 28.3495, oz: 1 },
};

async function deleteFile(imageUrl) {
  const key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
  console.log("Deleting file with key:", key);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: decodeURIComponent(key),
  };

  try {
    const data = await s3.deleteObject(params).promise();
    console.log("File deleted successfully from S3:", data);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
}

async function calculateWeight(items, isWorn = false) {
  return await items.reduce(async (sumPromise, item) => {
    const sum = await sumPromise;
    const user = await User.findById(item.owner);
    const userWeightOption = user?.weightOption;
    const itemWeightOption = item.weightOption || userWeightOption;
    const conversionRate =
      weightConversionRates[itemWeightOption][userWeightOption];
    const weight = item.weight * item.qty * conversionRate;

    return sum + (isWorn && !item.worn ? 0 : weight);
  }, Promise.resolve(0));
}

const resolvers = {
  Query: {
    changeLogs: async () => {
      try {
        const logs = await ChangeLog.find();

        const formattedLogs = logs.map((log) => ({
          id: log._id.toString(),
          ...log.toObject(),
          createdAt: log.createdAt.toISOString(),
          updatedAt: log.updatedAt.toISOString(),
        }));

        const sortedLogs = formattedLogs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return sortedLogs;
      } catch (error) {
        console.error("Failed to fetch changelogs:", error);
        throw new Error("Failed to fetch changelogs");
      }
    },

    checkEmailExistence: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        return user ? true : false;
      } catch (error) {
        console.error("Error checking email existence:", error);
        throw new Error("Failed to check email existence");
      }
    },

    users: async (_) => {
      try {
        return await User.find();
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },

    user: async (_, __, { user }) => {
      try {
        return await User.findOne({ _id: user.userId });
      } catch (error) {
        console.error(`Error fetching user with id ${user.userId}:`, error);
        throw new Error("Failed to fetch user");
      }
    },

    userShared: async (_, { bagId }) => {
      try {
        const bag = await Bag.findOne({ _id: new ObjectId(bagId) });

        if (!bag) {
          throw new Error("Bag not found");
        }

        const ownerId = bag.owner;
        const owner = await User.findOne({ _id: new ObjectId(ownerId) });

        if (!owner) {
          throw new Error("Owner not found");
        }
        return owner;
      } catch (error) {
        console.error(`Error fetching owner with bag id ${bagId}:`, error);
        throw new Error("Failed to fetch owner");
      }
    },

    trips: async (_, __, { user }) => {
      try {
        return await Trip.find(ensureOwner(user));
      } catch (error) {
        console.log(error);
      }
    },

    trip: async (_, { id }, { user }) => {
      try {
        return await Trip.findOne(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error(`Error fetching trip with id ${id}:`, error);
        throw new Error("Failed to fetch trip");
      }
    },

    sharedTrip: async (_, { id }) => {
      try {
        return await Trip.findOne({ _id: id });
      } catch (error) {
        console.error(`Error fetching trip with id ${id}:`, error);
        throw new Error("Failed to fetch trip");
      }
    },

    bag: async (_, { id }, { user }) => {
      try {
        return await Bag.findOne(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error(`Error fetching bag with id ${id}:`, error);
        throw new Error("Failed to fetch bag");
      }
    },

    sharedBag: async (_, { id }) => {
      try {
        const bag = await Bag.findOne({ _id: id });

        if (!bag) {
          throw new Error(`Bag with id ${id} not found`);
        }

        const categories = await Category.find({ bagId: bag._id });
        const categoriesWithDetails = await Promise.all(
          categories.map(async (category) => {
            const items = await Item.find({ categoryId: category._id });

            const totalWeight = await calculateWeight(items);
            const totalWornWeight = await calculateWeight(items, true);

            return {
              ...category.toObject(),
              id: category._id.toString(),
              totalWeight,
              totalWornWeight,
              items,
            };
          })
        );

        return {
          ...bag.toObject(),
          id: bag._id.toString(),
          categories: categoriesWithDetails,
        };
      } catch (error) {
        console.error(`Error fetching shared bag with id ${id}:`, error);
        throw new Error("Failed to fetch shared bag");
      }
    },

    exploreBags: async () => {
      try {
        const bags = await Bag.find({ exploreBags: true });

        const bagData = await Promise.all(
          bags.map(async (bag) => {
            const totalCategories = await Category.countDocuments({
              bagId: bag._id,
            });
            const totalItems = await Item.countDocuments({ bagId: bag._id });

            return {
              id: bag._id.toString(),
              ...bag._doc,
              totalCategories,
              totalItems,
            };
          })
        );

        return bagData;
      } catch (error) {
        console.error("Error fetching explore bags:", error);
        throw new Error("Failed to fetch explore bags.");
      }
    },

    latestBags: async (_, __, { user }) => {
      try {
        return await Bag.find(ensureOwner(user))
          .sort({ updatedAt: -1 })
          .limit(8);
      } catch (error) {
        console.error("Error fetching latest bags:", error);
        throw new Error("Failed to fetch latest bags");
      }
    },

    allUserBags: async (_, { userId }) => {
      try {
        if (!userId) throw new Error("User ID is required");
        return await Bag.find({ owner: userId });
      } catch (error) {
        console.error("Error fetching bags:", error);
        throw new Error("Failed to fetch bags");
      }
    },

    latestBagWithDetails: async (_, __, { user }) => {
      try {
        const bag = await Bag.findOne(ensureOwner(user)).sort({
          updatedAt: -1,
        });
        if (!bag) return null;
        const categories = await Category.find({ bagId: bag.id });
        const totalCategories = categories.length;
        const items = await Item.find({ bagId: bag.id });
        const totalItems = items.length;
        const totalWeight = items.reduce(
          (sum, item) => sum + item.weight * item.qty,
          0
        );
        return {
          id: bag.id,
          name: bag.name,
          goal: bag.goal,
          passed: bag.passed,
          totalCategories,
          totalItems,
          totalWeight,
        };
      } catch (error) {
        console.error("Error fetching latest bag with details:", error);
        throw new Error("Failed to fetch latest bag with details");
      }
    },

    getArticles: async () => {
      try {
        const articles = await Article.find();
        return articles;
      } catch (error) {
        throw new Error("Failed to fetch articles");
      }
    },

    getArticle: async (_, { id }) => {
      try {
        const article = await Article.findById(id);
        if (!article) {
          throw new Error("Article not found");
        }
        return article;
      } catch (error) {
        throw new Error("Failed to fetch article");
      }
    },
  },

  Trip: {
    bags: async (parent) => {
      try {
        return await Bag.find({ tripId: parent.id });
      } catch (error) {
        console.error(`Error fetching bags for trip ${parent.id}:`, error);
        throw new Error("Failed to fetch bags");
      }
    },
  },

  Bag: {
    categories: async (parent) => {
      try {
        const categories = await Category.find({ bagId: parent.id });
        return await Promise.all(
          categories.map(async (category) => {
            const items = await Item.find({ categoryId: category._id });
            const totalWeight = await calculateWeight(items);
            const totalWornWeight = await calculateWeight(items, true);

            return {
              ...category.toObject(),
              id: category._id.toString(),
              totalWeight,
              totalWornWeight,
            };
          })
        );
      } catch (error) {
        console.error(`Error fetching categories for bag ${parent.id}:`, error);
        throw new Error("Failed to fetch categories");
      }
    },

    allItems: async (_, __, { user }) => {
      try {
        if (!user) throw new Error("Not authenticated");
        const items = await Item.find({
          owner: user.userId,
          name: { $ne: "", $exists: true },
        })
          .sort({ createdAt: -1 })
          .exec();

        const uniqueItems = [
          ...new Map(items.map((item) => [item.name, item])).values(),
        ];

        return uniqueItems.slice(0, 50);
      } catch (error) {
        console.error("Error fetching all items:", error);
        throw new Error("Failed to fetch all items");
      }
    },
  },

  Category: {
    items: async (parent) => {
      try {
        return await Item.find({ categoryId: parent.id });
      } catch (error) {
        console.error(
          `Error fetching items for categoryId ${parent.categoryId}:`,
          error
        );
        throw new Error("Failed to fetch items");
      }
    },
  },

  Mutation: {
    loginUser: async (_, { email, password }, { res }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid email or password.");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid email or password.");
        }

        user.lastLoggedIn = new Date();
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 86400000,
        });
        return { token, user };
      } catch (error) {
        console.log(error.message);

        if (error.message === "Invalid email or password.") {
          throw new Error(error.message);
        } else {
          throw new Error("Something went wrong. Please try again later.");
        }
      }
    },

    addBugReport: async (_, { title, description }, { user }) => {
      try {
        const foundUser = await User.findOne({
          _id: new ObjectId(user.userId),
        });

        const emailContent = reportEmail(title, description, foundUser);
        await sendReportEmail(
          foundUser.email,
          `${foundUser.username} sent a new bug message`,
          emailContent
        );

        return { success: true, message: "Bug report submitted successfully." };
      } catch (error) {
        console.error("Error sending bug report email:", error);
        throw new Error("Failed to send bug report email.");
      }
    },

    updateVerifiedCredentials: async (_, { token }) => {
      try {
        const hashedToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        const user = await User.findOne({
          emailVerificationToken: hashedToken,
        });

        if (!user) {
          throw new Error("Token is invalid.");
        }

        user.verifiedCredentials = true;

        await user.save();
        return user;
      } catch (error) {
        throw new Error(error.message || "Email verification failed");
      }
    },

    updateBagPassedStatus: async (_, { id, passed }, { user }) => {
      try {
        if (!user) throw new Error("Not authenticated");

        // Find the bag by ID and ensure the user is the owner
        const bag = await Bag.findOne({ _id: id, owner: user.userId });
        if (!bag) {
          throw new Error("Bag not found or not authorized");
        }

        bag.passed = passed;
        await bag.save();

        return bag;
      } catch (error) {
        console.error(`Error updating bag passed status:`, error);
        throw new Error("Failed to update bag passed status");
      }
    },

    sendResetPasswordLink: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Email does not exist.");
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
      const emailContent = generateForgotPasswordHTML(resetToken);

      await sendEmail(
        email,
        "Action Required: Reset Your Hikepack.io Password",
        emailContent
      );
      return "A password reset link has been sent to your email address.";
    },

    resetPassword: async (_, { token, newPassword }) => {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error("Token is invalid or has expired.");
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.verifiedCredentials = true;
      await user.save();

      return "Your password has been successfully reset.";
    },

    addChangeLog: async (_, { title, description }) => {
      try {
        const changeLog = new ChangeLog({ title, description });
        await changeLog.save();
        return changeLog;
      } catch (error) {
        console.error("Error adding changelog:", error);
        throw new Error("Failed to add changelog");
      }
    },

    createUser: async (_, args) => {
      try {
        const existingUser = await User.findOne({ email: args.email });
        if (existingUser) {
          throw new Error("Email already exists!");
        }
        const user = new User(args);
        const adminEmails = process.env.ADMIN_EMAILS
          ? process.env.ADMIN_EMAILS.split(",")
          : [];
        if (adminEmails.includes(args.email)) {
          user.isAdmin = true;
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
          .createHash("sha256")
          .update(verificationToken)
          .digest("hex");
        user.emailVerificationToken = hashedToken;

        await user.save();

        const emailContent = generateRegisterHTML(verificationToken);
        await sendEmail(args.email, "Welcome to hikepack.io", emailContent);

        return user;
      } catch (error) {
        if (error.code === 11000) {
          throw new Error("Email already exists!");
        }
        console.error("Error creating user:", error);
        throw new Error(error);
      }
    },

    updateUser: async (_, args, { user }) => {
      try {
        return await User.findByIdAndUpdate(
          args.id,
          { ...args, id: user.userId },
          { new: true }
        );
      } catch (error) {
        console.error(`Error updating user with id ${args.id}:`, error);
        throw new Error("Failed to update user");
      }
    },


    updateTrip: async (_, args, { user }) => {
      try {
        return await Trip.findByIdAndUpdate(
          args.id,
          { ...args, owner: user.userId },
          { new: true }
        );
      } catch (error) {
        console.error(`Error updating trip with id ${args.id}:`, error);
        throw new Error("Failed to update trip");
      }
    },

    addTrip: async (_, args, { user }) => {
      try {
        const trip = new Trip({ ...args, owner: user.userId });
        await trip.save();
        return trip;
      } catch (error) {
        console.error("Error adding trip:", error);
        throw new Error("Failed to add trip");
      }
    },

    duplicateTrip: async (_, { id, ...tripData }, { user }) => {
      try {
        if (!user) throw new Error("Not authenticated");

        const duplicateImage = async (imageUrl) => {
          if (!imageUrl?.includes("amazon")) return imageUrl;
          const originalKey = imageUrl.split("/").pop();
          const newKey = `${uuidv4()}-${getCurrentTimestamp()}${originalKey.slice(originalKey.lastIndexOf("."))}`;
          await s3
            .copyObject({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              CopySource: `/${process.env.AWS_S3_BUCKET_NAME}/${decodeURIComponent(originalKey)}`,
              Key: newKey,
            })
            .promise();
          return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${newKey}`;
        };

        const originalTrip = await Trip.findOne({
          _id: id,
          owner: user.userId,
        });
        if (!originalTrip) throw new Error("Trip not found");

        const newTrip = await Trip.create({
          ...tripData,
          owner: user.userId,
          imageUrl: await duplicateImage(originalTrip.imageUrl),
        });

        const bags = await Bag.find({
          tripId: originalTrip._id,
          owner: user.userId,
        });

        await Promise.all(
          bags.map(async (bag) => {
            const { _id, exploreBags, ...bagData } = bag.toObject(); // Exclude `_id`
            const newBag = await Bag.create({
              ...bagData,
              tripId: newTrip._id,
              owner: user.userId,
              imageUrl: await duplicateImage(bag.imageUrl),
            });

            const categories = await Category.find({ bagId: bag._id });
            const categoryMap = {};
            await Promise.all(
              categories.map(async (category) => {
                const { _id, ...categoryData } = category.toObject(); // Exclude `_id`
                const newCategory = await Category.create({
                  ...categoryData,
                  bagId: newBag._id,
                  tripId: newTrip._id,
                  owner: user.userId,
                });
                categoryMap[category._id] = newCategory._id;
              })
            );

            const items = await Item.find({ bagId: bag._id });
            await Promise.all(
              items.map(async (item) => {
                const { _id, ...itemData } = item.toObject(); // Exclude `_id`
                await Item.create({
                  ...itemData,
                  bagId: newBag._id,
                  tripId: newTrip._id,
                  categoryId: categoryMap[item.categoryId],
                  owner: user.userId,
                  imageUrl: await duplicateImage(item.imageUrl),
                });
              })
            );
          })
        );

        return newTrip;
      } catch (error) {
        console.error("Error duplicating trip:", error);
        throw new Error("Failed to duplicate trip");
      }
    },

    deleteTrip: async (_, { id }, { user }) => {
      try {
        const trip = await Trip.findById(id);
        if (!trip) {
          throw new Error("Trip not found");
        }

        const items = await Item.find({ tripId: id, owner: user.userId });
        for (const item of items) {
          if (item.imageUrl) {
            await deleteFile(item.imageUrl);
          }
        }

        const bags = await Bag.find({ tripId: id, owner: user.userId });
        for (const bag of bags) {
          if (bag.imageUrl.includes("amazon")) {
            await deleteFile(bag.imageUrl);
          }
        }
        if (trip.imageUrl.includes("amazon")) {
          await deleteFile(trip.imageUrl);
        }

        await Item.deleteMany({ tripId: id, owner: user.userId });
        await Category.deleteMany({ tripId: id, owner: user.userId });
        await Bag.deleteMany({ tripId: id, owner: user.userId });

        return await Trip.findByIdAndDelete(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error("Error deleting trip:", error);
        throw new Error("Failed to delete trip");
      }
    },

    addBag: async (_, args, { user }) => {
      try {
        const bag = new Bag({ ...args, owner: user.userId });
        await bag.save();
        return bag;
      } catch (error) {
        console.error("Error adding bag:", error);
        throw new Error("Failed to add bag");
      }
    },

    duplicateBag: async (_, args, { user }) => {
      try {
        if (!user) throw new Error("Not authenticated");

        const { id, tripId, ...bagData } = args;

        const originalBag = await Bag.findOne({ _id: id, owner: user.userId });
        if (!originalBag) throw new Error("Bag not found");

        const duplicateImage = async (imageUrl) => {
          if (!imageUrl || !imageUrl.includes("amazon")) return imageUrl;

          const originalKey = imageUrl.split("/").pop();
          const newKey = `${uuidv4()}-${getCurrentTimestamp()}${originalKey.slice(originalKey.lastIndexOf("."))}`;
          await s3
            .copyObject({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              CopySource: `/${process.env.AWS_S3_BUCKET_NAME}/${decodeURIComponent(originalKey)}`,
              Key: newKey,
            })
            .promise();
          return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${newKey}`;
        };

        const newBag = await Bag.create({
          ...bagData,
          tripId,
          owner: user.userId,
          imageUrl: await duplicateImage(originalBag.imageUrl),
        });

        const categories = await Category.find({ bagId: originalBag._id });
        const categoryMap = {};

        await Promise.all(
          categories.map(async (category) => {
            const { _id, ...categoryData } = category.toObject(); // Exclude `_id`
            const newCategory = await Category.create({
              ...categoryData,
              bagId: newBag._id,
              tripId,
              owner: user.userId,
            });
            categoryMap[category._id] = newCategory._id;
          })
        );

        await Promise.all(
          categories.map(async (category) => {
            const items = await Item.find({ categoryId: category._id });
            await Promise.all(
              items.map(async (item) => {
                const { _id, ...itemData } = item.toObject(); // Exclude `_id`
                await Item.create({
                  ...itemData,
                  categoryId: categoryMap[category._id],
                  bagId: newBag._id,
                  tripId,
                  owner: user.userId,
                  imageUrl: await duplicateImage(item.imageUrl),
                });
              })
            );
          })
        );

        return newBag;
      } catch (error) {
        console.error("Error duplicating bag:", error);
        throw new Error("Failed to duplicate bag");
      }
    },

    deleteBag: async (_, { id }, { user }) => {
      try {
        const bag = await Bag.findOne({ _id: id, owner: user.userId });
        if (!bag) {
          throw new Error("Bag not found");
        }

        const items = await Item.find({ bagId: id, owner: user.userId });
        for (const item of items) {
          if (item.imageUrl) {
            await deleteFile(item.imageUrl);
          }
        }

        if (bag.imageUrl.includes("amazon")) {
          await deleteFile(bag.imageUrl);
        }

        await Item.deleteMany({ bagId: id, owner: user.userId });
        await Category.deleteMany({ bagId: id, owner: user.userId });

        return await Bag.findByIdAndDelete(ensureOwner(user, { _id: id }));
      } catch (error) {
        throw new Error("Failed to delete bag");
      }
    },

    updateBag: async (_, args, { user }) => {
      try {
        return await Bag.findByIdAndUpdate(
          args.bagId,
          { ...args, owner: user.userId },
          { new: true }
        );
      } catch (error) {
        console.error(`Error updating bag with id ${args.bagId}:`, error);
        throw new Error("Failed to update bag");
      }
    },

    updateLikesBag: async (_, { bagId, increment }) => {
      try {
        const updatedBag = await Bag.findByIdAndUpdate(
          bagId,
          { $inc: { likes: increment } },
          { new: true }
        );
        if (!updatedBag) {
          throw new Error(`Bag with id ${bagId} not found`);
        }
        return updatedBag;
      } catch (error) {
        console.error(
          `Error updating likes for bag with id ${bagId}:`,
          error.message
        );
        throw new Error("Failed to update bag likes");
      }
    },

    updateCategoryName: async (_, args, { user }) => {
      try {
        return await Category.findByIdAndUpdate(
          args.id,
          { name: args.name, owner: user.userId },
          { new: true }
        );
      } catch (error) {
        console.error(
          `Error updating category name with id ${args.id}:`,
          error
        );
        throw new Error("Failed to update category name");
      }
    },

    updateCategoryOrder: async (_, args) => {
      try {
        return await Category.findByIdAndUpdate(
          args.id,
          { order: args.order },
          { new: true }
        );
      } catch (error) {
        console.error(
          `Error updating category order with id ${args.id}:`,
          error
        );
        throw new Error("Failed to update category order");
      }
    },

    addCategory: async (_, args, { user }) => {
      try {
        const categoriesCount = await Category.countDocuments({
          bagId: args.bagId,
          owner: user.userId,
        });
        const category = new Category({
          ...args,
          order: categoriesCount + 1,
          owner: user.userId,
        });
        await category.save();
        return category;
      } catch (error) {
        console.error("Error adding category:", error);
        throw new Error("Failed to add category");
      }
    },

    deleteCategory: async (_, { id }, { user }) => {
      try {
        const categoryToDelete = await Category.findOne({
          _id: id,
          owner: user.userId,
        });
        if (!categoryToDelete) {
          throw new Error("Category not found or not authorized to delete");
        }

        const allCategories = await Category.find({
          bagId: categoryToDelete.bagId,
          owner: user.userId,
        }).sort("order");

        const reorderedCategories = allCategories
          .filter((category) => category._id.toString() !== id)
          .map((category, index) => {
            category.order = index;
            return category.save();
          });

        await Promise.all(reorderedCategories);

        const items = await Item.find({ categoryId: id, owner: user.userId });
        for (const item of items) {
          if (item.imageUrl) {
            await deleteFile(item.imageUrl);
          }
        }
        await Item.deleteMany({ categoryId: id, owner: user.userId });

        const deletedCategory = await Category.findByIdAndDelete(id);

        return {
          id: deletedCategory._id,
          name: deletedCategory.name,
          bagId: deletedCategory.bagId,
        };
      } catch (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        throw new Error("Failed to delete category");
      }
    },

    addItem: async (_, args, { user }) => {
      try {
        const itemsCount = await Item.countDocuments({
          categoryId: args.categoryId,
          owner: user.userId,
        });
        const item = new Item({
          ...args,
          order: itemsCount + 1,
          owner: user.userId,
        });
        await item.save();
        return item;
      } catch (error) {
        console.error("Error adding item:", error);
        throw new Error("Failed to add item");
      }
    },

    duplicateItem: async (_, args, { user }) => {
      try {
        if (!user) throw new Error("Not authenticated");

        const newImageUrl = args.imageUrl
          ? await (async () => {
              const originalKey = args.imageUrl.split("/").pop();
              const newKey = `${uuidv4()}-${getCurrentTimestamp()}${originalKey.slice(originalKey.lastIndexOf("."))}`;
              await s3
                .copyObject({
                  Bucket: process.env.AWS_S3_BUCKET_NAME,
                  CopySource: `/${process.env.AWS_S3_BUCKET_NAME}/${decodeURIComponent(originalKey)}`,
                  Key: newKey,
                })
                .promise();
              return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${newKey}`;
            })()
          : args.imageUrl;

        const itemsCount = await Item.countDocuments({
          categoryId: args.categoryId,
          owner: user.userId,
        });

        return await Item.create({
          ...args,
          owner: user.userId,
          order: itemsCount + 1,
          imageUrl: newImageUrl,
        });
      } catch (error) {
        console.error("Error duplicating item:", error);
        throw new Error("Failed to duplicate item");
      }
    },

    deleteItem: async (_, { id }, { user }) => {
      try {
        const item = await Item.findById(ensureOwner(user, { _id: id }));
        if (item && item.imageUrl && item.imageUrl.length > 0) {
          await deleteFile(item.imageUrl);
        }

        await Item.findByIdAndDelete(id);
        return item;
      } catch (error) {
        console.error(`Error deleting item with id ${id}:`, error);
        throw new Error("Failed to delete item");
      }
    },

    updateItem: async (_, args, { user }) => {
      try {
        return await Item.findByIdAndUpdate(
          args.id,
          { ...args, owner: user.userId },
          { new: true }
        );
      } catch (error) {
        console.error(`Error updating item with id ${args.id}:`, error);
        throw new Error("Failed to update item");
      }
    },
  },
};

module.exports = resolvers;
