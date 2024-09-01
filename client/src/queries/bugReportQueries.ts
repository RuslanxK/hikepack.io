import { gql } from '@apollo/client';

export const ADD_BUG_REPORT = gql`
  mutation AddBugReport($title: String!, $description: String!) {
    addBugReport(title: $title, description: $description) {
      success
      message
    }
  }
`;