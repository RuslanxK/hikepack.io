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

