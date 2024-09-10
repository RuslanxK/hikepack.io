import { gql } from '@apollo/client';


export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      birthdate
      imageUrl
      isAdmin
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    user {
      id
      username
      isAdmin
      weightOption
      distance
      imageUrl
      googleId
    }
  }
`;


export const GET_USER_SETTINGS = gql`
  query GetUser {
    user {
      id
      email
      username
      birthdate
      weightOption
      distance
      gender
      imageUrl
      activityLevel
      country
      
    }
  }
`;



export const GET_USER_SHARED = gql`
query GetSharedUser($bagId: ID!) {
  userShared(bagId: $bagId) {
    username
    weightOption
    imageUrl
  }
}
`;

export const CHECK_EMAIL_EXISTENCE = gql`
  query CheckEmailExistence($email: String!) {
    checkEmailExistence(email: $email)
  }
`;


