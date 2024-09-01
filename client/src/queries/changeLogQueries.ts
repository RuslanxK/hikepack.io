import { gql } from '@apollo/client';


export const GET_CHANGELOGS = gql`
  query GetChangeLogs {
    changeLogs {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;


export const ADD_CHANGELOG = gql`
  mutation AddChangeLog($title: String!, $description: String!) {
    addChangeLog(title: $title, description: $description) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;