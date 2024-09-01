const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    
  email: {
    type: String,
    unique: [true, "Email is already exists!"],
    require: [true, "Email is required!"],

    },

    username: {
    type: String,
  },

  birthdate: {

     type: String,
     default: "2024-01-01T00:00:00.000Z"
  },

  password: {
      type: String,
  },

  weightOption: {

      type: String,
      default: "lb"
  },


  imageUrl: {
      type: String
  },

  verifiedCredentials: {
     type: Boolean,
     default: false
  },



  resetPasswordToken: { 
    type: String, 
    default: null 
  },

  resetPasswordExpires: { 
    type: String, 
    default: null 
  },


  isActive: { 
    type: Boolean, 
    required: true, 
    default: false 
  },


  distance: {
     type: String,
     default: "miles"
  },


  emailVerificationToken: {
    type: String,
    default: null
  },

  emailVerificationExpires: {
    type: String,
    default: null
  },


  googleId: String,

  gender: {type: String, default: "Please choose an option"},
  activityLevel: {type: String, default: "Please choose an option"},
  country: {type: String, default: "United States"},

  isAdmin: { 
    type: Boolean,
    required: true, 
    default: false
  
  },



},  { timestamps: true });



userSchema.virtual("trips", {
  ref: "trips",
  localField: "_id",
  foreignField: "owner",
});


userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});



const User = mongoose.model('User', userSchema);

module.exports = User;