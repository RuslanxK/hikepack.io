const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/user');
const router = express.Router();

const generateJwtToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: 86400000, 
  });
};

const findOrCreateUser = async (profile) => {
  let user = await User.findOne({ email: profile.email });
  
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
  
  if (!user) {
    user = new User({
      email: profile.email,
      username: profile.name,
      googleId: profile.id,
      imageUrl: profile.picture,
      isAdmin: adminEmails.includes(profile.email) ? true : false, 
    });
    await user.save();
  } else {
    
    if (adminEmails.includes(profile.email) && !user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }
  }

  return user;
};


router.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const profile = response.data;
    const user = await findOrCreateUser(profile);
    const jwtToken = generateJwtToken(user._id);

    setTokenCookie(res, jwtToken);
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
