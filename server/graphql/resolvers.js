const Trip = require("../models/trip");
const Bag = require("../models/bag");
const Category = require("../models/category");
const Item = require("../models/item");
const ChangeLog = require("../models/changelog")
const User = require("../models/user");
const Article = require("../models/article")
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { generateRegisterHTML, sendEmail, generateForgotPasswordHTML, reportEmail, sendReportEmail } = require('../emails/email');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { ObjectId } = require('mongodb'); 
const s3 = require("../config/s3Config")

const ensureOwner = (user, query = {}) => {
  if (!user) throw new Error('Not authenticated');
  return { ...query, owner: user.userId };
};

const weightConversionRates = {
  lb: { lb: 1, kg: 0.453592, g: 453.592, oz: 16 },
  kg: { lb: 2.20462, kg: 1, g: 1000, oz: 35.274 },
  g: { lb: 0.00220462, kg: 0.001, g: 1, oz: 0.035274 },
  oz: { lb: 0.0625, kg: 0.0283495, g: 28.3495, oz: 1 },
};


const resolvers = {
  Query: {

    changeLogs: async () => {
      try {
        const logs = await ChangeLog.find();
    
        const formattedLogs = logs.map(log => ({
          id: log._id.toString(),
          ...log.toObject(),
          createdAt: log.createdAt.toISOString(), 
          updatedAt: log.updatedAt.toISOString(),  
        }));
    
        const sortedLogs = formattedLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
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
        console.error('Error checking email existence:', error);
        throw new Error('Failed to check email existence');
      }
    },

    users: async (_, ) => {
      try {
        return await User.find();
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
    },

    user: async (_, __, { user }) => {
      try {
        return await User.findOne({ _id: user.userId });
      } catch (error) {
        console.error(`Error fetching user with id ${user.userId}:`, error);
        throw new Error('Failed to fetch user');
      }
    },

    trips: async (_, __, { user }) => {
      return await Trip.find(ensureOwner(user));
    },

    trip: async (_, { id }, { user }) => {
      try {
        return await Trip.findOne(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error(`Error fetching trip with id ${id}:`, error);
        throw new Error('Failed to fetch trip');
      }
    },

    bags: async (_, { tripId }, { user }) => {
      try {
        return await Bag.find(ensureOwner(user, { tripId }));
      } catch (error) {
        console.error(`Error fetching bags for tripId ${tripId}:`, error);
        throw new Error('Failed to fetch bags');
      }
    },
    

    bag: async (_, { id }, { user }) => {
      try {
        return await Bag.findOne(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error(`Error fetching bag with id ${id}:`, error);
        throw new Error('Failed to fetch bag');
      }
    },


    sharedBag: async (_, { id }) => {
      try {
        return await Bag.findOne({ _id: id });
      } catch (error) {
        console.error(`Error fetching shared bag with id ${id}:`, error);
        throw new Error('Failed to fetch shared bag');
      }
    },


    exploreBags: async () => {
      try {
        const bags = await Bag.find({ exploreBags: true });
    
        const bagData = await Promise.all(
          bags.map(async (bag) => {
            const totalCategories = await Category.countDocuments({ bagId: bag._id });
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
    
    
    categories: async (_, { bagId }) => {
      try {
        const categories = await Category.find({ bagId });
        const categoriesWithDetails = await Promise.all(
          categories.map(async (category) => {
            const items = await Item.find({ categoryId: category._id });
    
            const totalWeight = await items.reduce(async (sumPromise, item) => {
              const sum = await sumPromise;
    
              const user = await User.findById(item.owner);
              const userWeightOption = user?.weightOption;
    
              const itemWeightOption = item.weightOption || userWeightOption;
              const conversionRate = weightConversionRates[itemWeightOption][userWeightOption];
              return sum + (item.weight * item.qty * conversionRate);
            }, Promise.resolve(0));
    
            const totalWornWeight = await items.reduce(async (sumPromise, item) => {
              const sum = await sumPromise;
    
              const user = await User.findById(item.owner);
              const userWeightOption = user?.weightOption; 
    
              const itemWeightOption = item.weightOption || userWeightOption;
              const conversionRate = weightConversionRates[itemWeightOption][userWeightOption];
              return sum + (item.worn ? item.weight * item.qty * conversionRate : 0);
            }, Promise.resolve(0));
    
            return {
              ...category.toObject(),
              id: category._id.toString(),
              totalWeight,
              totalWornWeight,
            };
          })
        );
        return categoriesWithDetails;
      } catch (error) {
        console.error(`Error fetching categories for bagId ${bagId}:`, error);
        throw new Error('Failed to fetch categories');
      }
    },

    
    category: async (_, { id }) => {
      try {
        return await Category.findOne({ _id: id });
      } catch (error) {
        console.error(`Error fetching category with id ${id}:`, error);
        throw new Error('Failed to fetch category');
      }
    },

    items: async (_, { categoryId }) => {
      try {
        return await Item.find({ categoryId });
      } catch (error) {
        console.error(`Error fetching items for categoryId ${categoryId}:`, error);
        throw new Error('Failed to fetch items');
      }
    },

    item: async (_, { id }) => {
      try {
        return await Item.findOne({ _id: id });
      } catch (error) {
        console.error(`Error fetching item with id ${id}:`, error);
        throw new Error('Failed to fetch item');
      }
    },

    latestBags: async (_, __, { user }) => {
      try {
        return await Bag.find(ensureOwner(user)).sort({ updatedAt: -1 }).limit(3);
      } catch (error) {
        console.error('Error fetching latest bags:', error);
        throw new Error('Failed to fetch latest bags');
      }
    },

    latestBagWithDetails: async (_, __, { user }) => {
      try {
        const bag = await Bag.findOne(ensureOwner(user)).sort({ updatedAt: -1 });
        if (!bag) return null;
        const categories = await Category.find({ bagId: bag.id });
        const totalCategories = categories.length;
        const items = await Item.find({ bagId: bag.id });
        const totalItems = items.length;
        const totalWeight = items.reduce((sum, item) => sum + item.weight * item.qty, 0);
        return {
          id: bag.id,
          name: bag.name,
          goal: bag.goal,
          totalCategories,
          totalItems,
          totalWeight,
        };
      } catch (error) {
        console.error('Error fetching latest bag with details:', error);
        throw new Error('Failed to fetch latest bag with details');
      }
    },

    allItems: async (_, __, { user }) => {
      try {
        const items = await Item.find(
          {
            ...ensureOwner(user),
            name: { $ne: "", $exists: true }
          }
        )
        .sort({ createdAt: -1 })
        .exec();

        const uniqueItems = items.filter(
          (item, index, self) => index === self.findIndex((t) => t.name === item.name)
        );
    
        return uniqueItems.slice(0, 50);
    
      } catch (error) {
        console.error('Error fetching all items:', error);
        throw new Error('Failed to fetch all items');
      }
    },


    getArticles: async () => {
      try {
        const articles = await Article.find();
        return articles;
      } catch (error) {
        throw new Error('Failed to fetch articles');
      }
    },

    getArticle: async (_, { id }) => {
      try {
        const article = await Article.findById(id);
        if (!article) {
          throw new Error('Article not found');
        }
        return article;
      } catch (error) {
        throw new Error('Failed to fetch article');
      }
    },
    
  },

  
  Mutation: {
    
    loginUser: async (_, { email, password }, { res }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password.');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error('Invalid email or password.');
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production' ? true : false,
          sameSite: 'Strict',
          maxAge: 86400000,   
        });

        return { token, user };
      } catch (error) {
        throw new Error("Something went wrong please try again later.");
      }
    },



    addBugReport: async (_, { title, description }, {user}) => {
      try {
     
        const foundUser = await User.findOne({ _id: new ObjectId(user.userId) });
  
        const emailContent = reportEmail(title, description, foundUser);
        await sendReportEmail(foundUser.email, `${foundUser.username} sent a new bug message` ,emailContent);

        return { success: true, message: 'Bug report submitted successfully.' };

      } catch (error) {
        console.error('Error sending bug report email:', error);
        throw new Error('Failed to send bug report email.');
      }
    },



    updateVerifiedCredentials: async (_, { token }) => {
      try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
        const user = await User.findOne({
          emailVerificationToken: hashedToken,
        });
    
        if (!user) {
          throw new Error('Token is invalid.');
        }
  
        user.verifiedCredentials = true;
       
        
        await user.save();
        return user;
    
      } catch (error) {
        throw new Error(error.message || 'Email verification failed');
      }
    },
    



    sendResetPasswordLink: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email does not exist.');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000; 
      await user.save();
      const emailContent = generateForgotPasswordHTML(resetToken);

      await sendEmail(email,"Action Required: Reset Your Hikepack.io Password", emailContent)
      return 'A password reset link has been sent to your email address.';
    },



    resetPassword: async (_, { token, newPassword }) => {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });
    
      if (!user) {
        throw new Error('Token is invalid or has expired.');
      }
    
      user.password = newPassword; 
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.verifiedCredentials = true
      await user.save();
    
      return 'Your password has been successfully reset.';
    },



    addChangeLog: async (_, { title, description }) => {
      try {
        const changeLog = new ChangeLog({ title, description });
        await changeLog.save();
        return changeLog;
      } catch (error) {
        console.error('Error adding changelog:', error);
        throw new Error('Failed to add changelog');
      }
    },
  
  

    
    createUser: async (_, args) => {
      try {
        const user = new User(args);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        user.emailVerificationToken = hashedToken;
    
        await user.save();
    
        const emailContent = generateRegisterHTML(verificationToken);
        await sendEmail(args.email, "Welcome to hikepack.io", emailContent);
        
        return user;
      } catch (error) {
        console.error('Error creating user:', error);
        return error;
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
        throw new Error('Failed to update user');
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
        throw new Error('Failed to update trip');
      }
    },

    addTrip: async (_, args, { user }) => {
      try {
        const trip = new Trip({ ...args, owner: user.userId });
        await trip.save();
        return trip;
      } catch (error) {
        console.error('Error adding trip:', error);
        throw new Error('Failed to add trip');
      }
    },

    deleteTrip: async (_, { id }, { user }) => {
      try {
        await Item.deleteMany({ tripId: id, owner: user.userId });
        await Category.deleteMany({ tripId: id, owner: user.userId });
        await Bag.deleteMany({ tripId: id, owner: user.userId });
        return await Trip.findByIdAndDelete(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error('Error deleting trip:', error);
        throw new Error('Failed to delete trip');
      }
    },

    addBag: async (_, args, { user }) => {
      try {
        const bag = new Bag({ ...args, owner: user.userId });
        await bag.save();
        return bag;
      } catch (error) {
        console.error('Error adding bag:', error);
        throw new Error('Failed to add bag');
      }
    },

    deleteBag: async (_, { id }, { user }) => {
      try {
        await Item.deleteMany({ bagId: id, owner: user.userId });
        await Category.deleteMany({ bagId: id, owner: user.userId });
        return await Bag.findByIdAndDelete(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error(`Error deleting bag with id ${id}:`, error);
        throw new Error('Failed to delete bag');
      }
    },

    updateBag: async (_, args, { user }) => {
      try {
        return await Bag.findByIdAndUpdate(args.bagId, { ...args, owner: user.userId }, { new: true });
      } catch (error) {
        console.error(`Error updating bag with id ${args.bagId}:`, error);
        throw new Error('Failed to update bag');
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
        console.error(`Error updating likes for bag with id ${bagId}:`, error.message);
        throw new Error('Failed to update bag likes');
      }
    },

    updateExploreBags: async (_, args, { user }) => {
      try {
        return await Bag.findByIdAndUpdate(args.bagId, { exploreBags: args.exploreBags, owner: user.userId }, { new: true });
      } catch (error) {
        console.error(`Error updating exploreBags for bag with id ${args.bagId}:`, error);
        throw new Error('Failed to update exploreBags');
      }
    },

    addCategory: async (_, args, { user }) => {
      try {
        const categoriesCount = await Category.countDocuments({ bagId: args.bagId, owner: user.userId });
        const category = new Category({ ...args, order: categoriesCount + 1, owner: user.userId });
        await category.save();
        return category;
      } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Failed to add category');
      }
    },

    deleteCategory: async (_, { id }, { user }) => {
      try {
        await Item.deleteMany({ categoryId: id, owner: user.userId });
        return await Category.findByIdAndDelete(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        throw new Error('Failed to delete category');
      }
    },

    updateCategoryOrder: async (_, args) => {
      try {
        return await Category.findByIdAndUpdate(args.id, { order: args.order }, { new: true });
      } catch (error) {
        console.error(`Error updating category order with id ${args.id}:`, error);
        throw new Error('Failed to update category order');
      }
    },

    updateCategoryName: async (_, args, { user }) => {
      try {
        return await Category.findByIdAndUpdate(args.id, { name: args.name, owner: user.userId }, { new: true });
      } catch (error) {
        console.error(`Error updating category name with id ${args.id}:`, error);
        throw new Error('Failed to update category name');
      }
    },

    addItem: async (_, args, { user }) => {
      try {
        const itemsCount = await Item.countDocuments({ categoryId: args.categoryId, owner: user.userId });
        const item = new Item({ ...args, order: itemsCount + 1, owner: user.userId });
        await item.save();
        return item;
      } catch (error) {
        console.error('Error adding item:', error);
        throw new Error('Failed to add item');
      }
    },

    deleteItem: async (_, { id }, { user }) => {
      try {
        return await Item.findByIdAndDelete(ensureOwner(user, { _id: id }));
      } catch (error) {
        console.error(`Error deleting item with id ${id}:`, error);
        throw new Error('Failed to delete item');
      }
    },

    updateItemOrder: async (_, args) => {
      try {
        return await Item.findByIdAndUpdate(args.id, { order: args.order }, { new: true });
      } catch (error) {
        console.error(`Error updating item order with id ${args.id}:`, error);
        throw new Error('Failed to update item order');
      }
    },

    updateItemLink: async (_, args, { user }) => {
      try {
        return await Item.findByIdAndUpdate(args.id, { link: args.link, owner: user.userId }, { new: true });
      } catch (error) {
        console.error(`Error updating item link with id ${args.id}:`, error);
        throw new Error('Failed to update item link');
      }
    },

    updateItem: async (_, args, { user }) => {
      try {
        return await Item.findByIdAndUpdate(args.id, { ...args, owner: user.userId }, { new: true });
      } catch (error) {
        console.error(`Error updating item with id ${args.id}:`, error);
        throw new Error('Failed to update item');
      }
    },
  },
};

module.exports = resolvers;
