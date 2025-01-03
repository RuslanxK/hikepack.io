const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type User {
    id: ID!
    googleId: String
    email: String!
    username: String!
    birthdate: String
    password: String!
    weightOption: String!
    verifiedCredentials: Boolean
    resetPasswordExpires: String
    resetPasswordToken: String
    emailVerificationToken: String
    distance: String
    gender: String
    activityLevel: String
    country: String
    imageUrl: String
    isAdmin: Boolean!
    createdAt: String!
    updatedAt: String!
    guide: Boolean
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Trip {
    id: ID!
    owner: ID! 
    name: String!
    about: String!
    distance: String!
    startDate: String!
    endDate: String!
    createdAt: String!
    updatedAt: String!
    imageUrl: String
    bags: [Bag!]!
  }

  type Bag {
    id: ID!
    tripId: ID!
    owner: ID!
    name: String
    description: String
    goal: String
    passed: Boolean
    likes: Int
    exploreBags: Boolean
    imageUrl: String
    createdAt: String
    updatedAt: String
    totalCategories: Int
    totalItems: Int
    categories: [Category!]!
    allItems: [Item!]!
  }

  type Category {
    id: ID!
    tripId: String!
    bagId: String!
    owner: ID!  
    name: String!
    order: Int
    color: String
    totalWeight: Float 
    totalWornWeight: Float
    createdAt: String!
    updatedAt: String!
    items: [Item!]!
  }

  type Item {
    id: ID!
    tripId: String!
    bagId: String!
    categoryId: String!
    owner: ID!  
    name: String!
    qty: Int!
    description: String
    weight: Float!
    priority: String!
    link: String
    worn: Boolean!
    imageUrl: String
    order: Int
    createdAt: String!
    updatedAt: String!
    weightOption: String
  }

  type BagWithDetails {
    id: ID!
    name: String!
    totalCategories: Int!
    totalItems: Int!
    totalWeight: Float!
    goal: String!
    passed: Boolean
  }


   type ChangeLog {
    id: ID!
    title: String!
    description: String!
    createdAt: String!
    updatedAt: String!
  }


   type Article {
    id: ID!
    title: String!
    description: String!
    imageUrl: String!
    createdAt: String
  }


   type ResponseMessage {
    success: Boolean!
    message: String!
  }


  type Query {
    users: [User!]!
    user : User
    userShared(bagId: ID!): User 
    trips: [Trip!]!
    trip(id: ID!): Trip
    sharedTrip(id: ID!): Trip
    bags(tripId: ID!): [Bag!]!
    sharedBag(id: ID!): Bag
    bag(id: ID!): Bag
    categories(bagId: ID!): [Category!]!
    items(categoryId: ID!): [Item!]!
    item(id: ID!): Item
    latestBags: [Bag!]!
    allUserBags(userId: ID!): [Bag!]
    latestBagWithDetails: BagWithDetails
    allItems: [Item!]!
    checkEmailExistence(email: String!): Boolean
    exploreBags: [Bag!]!
    changeLogs: [ChangeLog!]!
    getArticles: [Article]
    getArticle(id: ID!): Article
  }

  type Mutation {

    addTrip(name: String!, about: String!, distance: String!, startDate: String!, endDate: String!, imageUrl: String): Trip
    duplicateTrip(id: ID, name: String!, about: String!, distance: String!, startDate: String!, endDate: String!, imageUrl: String): Trip
    deleteTrip(id: ID!): Trip
    updateTrip(id: ID!, name: String, about: String, distance: String, startDate: String, endDate: String, imageUrl: String): Trip
    addBag(tripId: String!, name: String!, description: String!, goal: String!, exploreBags: Boolean!, imageUrl: String): Bag
    duplicateBag(id: ID, tripId: String!, name: String!, description: String!, goal: String!, exploreBags: Boolean!, imageUrl: String): Bag
    deleteBag(id: ID!): Bag
    updateBag(bagId: ID!, name: String, description: String, goal: String, exploreBags: Boolean, imageUrl: String): Bag
    updateLikesBag(bagId: ID!, increment: Int!): Bag
    addCategory(tripId: String!, bagId: String!, name: String!, order: Int, color: String): Category
    deleteCategory(id: ID!): Category
    updateCategoryName(id: ID!, name: String!): Category
    updateCategoryOrder(id: ID!, order: Int!): Category
    updateBagPassedStatus(id: ID!, passed: Boolean!): Bag

    updateItem(id: ID!, name: String, qty: Int, description: String, weight: Float, priority: String, link: String, worn: Boolean, imageUrl: String, weightOption: String, order: Int): Item
    addItem(tripId: String!, bagId: String!, categoryId: String!, name: String!, qty: Int!, description: String, weight: Float!, priority: String, worn: Boolean, order: Int, weightOption: String, link: String): Item
    duplicateItem(tripId: String!, bagId: String!, categoryId: String!, name: String!, qty: Int!, description: String, weight: Float!, priority: String, worn: Boolean, order: Int, weightOption: String, link: String imageUrl: String): Item
    deleteItem(id: ID!): Item

    createUser(email: String!, username: String, birthdate: String, password: String!, weightOption: String, verifiedCredentials: Boolean, distance: String, gender: String, activityLevel: String, country: String, isAdmin: Boolean, imageUrl: String): User
    updateUser(id: ID!, email: String, username: String, birthdate: String, password: String, weightOption: String, imageUrl: String, verifiedCredentials: Boolean, isActive: Boolean, distance: String, gender: String, activityLevel: String, country: String, isAdmin: Boolean): User

    addChangeLog(title: String!, description: String!): ChangeLog

    loginUser(email: String!, password: String!): AuthPayload!

    updateVerifiedCredentials(token: String!): User
    sendResetPasswordLink(email: String!): String!
    resetPassword(token: String!, newPassword: String!): String
    
    addBugReport(title: String!, description: String!): ResponseMessage!
  
  }
`;

module.exports = typeDefs;
