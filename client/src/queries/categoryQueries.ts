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


