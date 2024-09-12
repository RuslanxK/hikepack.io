import { gql } from '@apollo/client';


export const GET_ITEMS = gql`
  query GetItems($categoryId: ID!) {
    items(categoryId: $categoryId) {
      id
      tripId
      bagId
      categoryId
      name
      qty
      description
      weight
      priority
      link
      imageUrl
      worn
      order
      weightOption
    }
  }
`;


