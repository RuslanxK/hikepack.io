const jwt = require('jsonwebtoken');

const authMiddleware = async (resolve, parent, args, context, info) => {
  const { req } = context;

  if (!req) {
    throw new Error('Request object not found in context.');
  }

  const authHeader = req.headers['authorization'];


  if (!authHeader) {
    throw new Error('Authorization header is missing.');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Token is missing.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    context.user = decoded; 
    return resolve(parent, args, context, info); 
  } catch (error) {
    throw new Error('Invalid token.');
  }
};

module.exports = authMiddleware;
