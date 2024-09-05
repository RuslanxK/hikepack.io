import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories($bagId: ID!) {
    categories(bagId: $bagId) {
      id
      tripId
      bagId
      name
      order
      color
      totalWeight
      totalWornWeight
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      tripId
      bagId
      name
      order
      color
    }
  }
`;

