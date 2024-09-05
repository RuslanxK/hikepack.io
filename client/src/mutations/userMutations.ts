import { gql } from '@apollo/client';


export const ADD_USER = gql`
  mutation AddUser($email: String!, $username: String, $birthdate: String, $password: String!, $weightOption: String, $verifiedCredentials: Boolean, $isActive: Boolean, $distance: String, $gender: String, $activityLevel: String, $country: String, $isAdmin: Boolean, $imageUrl: String) {
    createUser(email: $email, username: $username, birthdate: $birthdate, password: $password, weightOption: $weightOption, verifiedCredentials: $verifiedCredentials, isActive: $isActive, distance: $distance, gender: $gender, activityLevel: $activityLevel, country: $country, isAdmin: $isAdmin, imageUrl: $imageUrl) {
      id
      email
      username
      birthdate
      isActive
      isAdmin
      imageUrl
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $email: String, $username: String, $birthdate: String, $password: String, $weightOption: String, $imageUrl: String, $verifiedCredentials: Boolean, $isActive: Boolean, $distance: String, $gender: String, $activityLevel: String, $country: String, $isAdmin: Boolean) {
    updateUser(id: $id, email: $email, username: $username, birthdate: $birthdate, password: $password, weightOption: $weightOption, imageUrl: $imageUrl, verifiedCredentials: $verifiedCredentials, isActive: $isActive, distance: $distance, gender: $gender, activityLevel: $activityLevel, country: $country, isAdmin: $isAdmin) {
      id, email, username, birthdate, weightOption, distance, gender, activityLevel, country, imageUrl, isActive, isAdmin
    }
  }
`;




export const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    token
    user {
      id
      email
      username
      isAdmin
      verifiedCredentials
    }
  }
}
`;


export const UPDATE_VERIFIED_CREDENTIALS = gql`
  mutation UpdateVerifiedCredentials($token: String!) {
    updateVerifiedCredentials(token: $token) {
      id
      verifiedCredentials
    }
  }
`;


export const SEND_RESET_PASSWORD_LINK = gql`
  mutation SendResetPasswordLink($email: String!) {
    sendResetPasswordLink(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

