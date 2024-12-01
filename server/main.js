const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const cors = require('cors');
const uploadImage = require('./routers/uploadImage'); 
const uploadArticle = require("./routers/uploadArticle")
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
const cookieParser = require('cookie-parser');
const googleAuthRoute = require("./routers/googleLogin")


const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl requests)
    if (!origin) return callback(null, true);
    // Allow any origin
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allows cookies and credentials
}));

app.use(cookieParser()); 
app.use(express.json());


const excludedResolvers = ['LoginUser', 'AddUser', 'GetSharedBag', 'GetCategories', 'GetItems', 'GetItem', 'UpdateLikesBag', 'CheckEmailExistence', 'UpdateVerifiedCredentials', 'SendResetPasswordLink', 'ResetPassword', 'GetSharedUser, GetSharedTrip, GetUserBags']; 

const dynamicAuthMiddleware = async (resolve, parent, args, context, info) => {

  console.log(info.operation.name.value)

  if (excludedResolvers.includes(info.operation.name.value)) {
    return resolve(parent, args, context, info); 
  }
  return authMiddleware(resolve, parent, args, context, info);
};

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
    if (!req|| !res) {
      throw new Error('Request object not found in context.');
    }
    return { req, res };
  },
});
app.use(uploadImage);
app.use(uploadArticle);
app.use(googleAuthRoute);

const startServer = async () => {
  await mongoose.connect(process.env.DATA_BASE_URL);
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer();
