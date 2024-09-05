import { gql } from '@apollo/client';


export const GET_ALL_ITEMS = gql`

  query GetAllItems {
    allItems {
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
      worn
      order
    }
  }
`;

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

export const GET_ITEM = gql`
  query GetItem($id: ID!) {
    item(id: $id) {
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

