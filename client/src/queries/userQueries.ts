import { gql } from '@apollo/client';

// Queries


export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      birthdate
      imageUrl
      isActive
      isAdmin
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    user {
      id
      email
      username
      birthdate
      isActive
      isAdmin
      weightOption
      distance
      gender
      verifiedCredentials
      imageUrl
      activityLevel
      country
      googleId
    }
  }
`;

export const GET_USER_SHARED = gql`
query GetSharedUser($bagId: ID!) {
  userShared(bagId: $bagId) {
    id
    email
    username
    birthdate
    isActive
    isAdmin
    weightOption
    distance
    gender
    verifiedCredentials
    imageUrl
    activityLevel
    country
    googleId
  }
}
`;

export const CHECK_EMAIL_EXISTENCE = gql`
  query CheckEmailExistence($email: String!) {
    checkEmailExistence(email: $email)
  }
`;


