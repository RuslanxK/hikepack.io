const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { createServer } = require('http'); 
const { Server } = require('socket.io'); 
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const cors = require('cors');
const uploadImage = require('./routers/uploadImage');
const uploadArticle = require('./routers/uploadArticle');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
const cookieParser = require('cookie-parser');
const googleAuthRoute = require('./routers/googleLogin');
const User = require("./models/user")
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 4000;

// Configure middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Define excluded resolvers
const excludedResolvers = ['LoginUser', 'AddUser', 'GetSharedBag', 'GetCategories', 'GetItems', 'GetItem', 'UpdateLikesBag', 'CheckEmailExistence', 'UpdateVerifiedCredentials', 'SendResetPasswordLink', 'ResetPassword', 'GetSharedUser', 'GetSharedTrip', 'GetUserBags'];

const dynamicAuthMiddleware = async (resolve, parent, args, context, info) => {
  if (excludedResolvers.includes(info.operation.name.value)) {
    return resolve(parent, args, context, info);
  }
  return authMiddleware(resolve, parent, args, context, info);
};

// Create GraphQL schema with middleware
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const schemaWithMiddleware = applyMiddleware(
  schema,
  dynamicAuthMiddleware
);

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req, res }) => {
    if (!req || !res) {
      throw new Error('Request object not found in context.');
    }
    return { req, res };
  },
});

app.use(uploadImage);
app.use(uploadArticle);
app.use(googleAuthRoute);


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('Token is missing. Connection rejected.');
    return next(new Error('Authorization header is missing.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); 
    if (!user) {
      console.log('User not found. Connection rejected.');
      return next(new Error('User does not exist.'));
    }
    socket.user = user;
    console.log(`User authenticated: ${user.id}`);
    next();
  } catch (error) {
    console.log('Invalid token. Connection rejected.', error);
    return next(new Error('Invalid token.'));
  }
});

const connectedUsers = new Set();

io.on('connection', (socket) => {
  if (!socket.user) {
    console.log('Unauthorized connection. Skipping live user count.');
    return;
  }
  const userId = socket.user.id;
  if (!connectedUsers.has(userId)) {
    connectedUsers.add(userId);
    io.emit('liveUsers', connectedUsers.size); 
    console.log(`User connected: ${userId}. Total live users: ${connectedUsers.size}`);
  }
  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    io.emit('liveUsers', connectedUsers.size);
    console.log(`User disconnected: ${userId}. Total live users: ${connectedUsers.size}`);
  });
});


const startServer = async () => {
  await mongoose.connect(process.env.DATA_BASE_URL);
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}${server.graphqlPath}`);
    console.log(`Socket.IO running at http://localhost:${port}`);
  });
};

startServer();
