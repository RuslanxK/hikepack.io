const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { createServer } = require('http'); // For creating an HTTP server
const { Server } = require('socket.io'); // Socket.IO Server
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

// Add routes
app.use(uploadImage);
app.use(uploadArticle);
app.use(googleAuthRoute);

// Create HTTP and WebSocket servers
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Track live users
let liveUsers = 0;

io.on('connection', (socket) => {
  liveUsers++;
  io.emit('liveUsers', liveUsers); 

  console.log(`New connection. Total live users: ${liveUsers}`);

  socket.on('disconnect', () => {
    liveUsers--;
    io.emit('liveUsers', liveUsers); 
    console.log(`User disconnected. Total live users: ${liveUsers}`);
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
