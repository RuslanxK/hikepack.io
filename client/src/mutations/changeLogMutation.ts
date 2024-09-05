import { gql } from '@apollo/client';


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