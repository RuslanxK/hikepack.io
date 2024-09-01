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

app.use(cors({ origin: process.env.CLIENT_URL })); 
app.use(cookieParser()); 
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

const excludedResolvers = ['LoginUser', 'AddUser', 'GetSharedBag', 'GetCategories', 'GetItems', 'UpdateLikesBag', 'CheckEmailExistence', 'UpdateVerifiedCredentials', 'SendResetPasswordLink', 'ResetPassword']; 

const dynamicAuthMiddleware = async (resolve, parent, args, context, info) => {
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
  await mongoose.connect('mongodb://localhost:27017/BagsApplication');
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
  });
};

startServer();
