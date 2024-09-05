
import { gql } from "@apollo/client";


export const ADD_CATEGORY = gql`
  mutation AddCategory(
    $tripId: String!
    $bagId: String!
    $name: String!
    $color: String
  ) {
    addCategory(tripId: $tripId, bagId: $bagId, name: $name, color: $color) {
      tripId
      bagId
      name
      color
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const UPDATE_CATEGORY_ORDER = gql`
  mutation UpdateCategoryOrder($id: ID!, $order: Int!) {
    updateCategoryOrder(id: $id, order: $order) {
      id
      order
    }
  }
`;

export const UPDATE_CATEGORY_NAME = gql`
  mutation UpdateCategoryName($id: ID!, $name: String!) {
    updateCategoryName(id: $id, name: $name) {
      id
      name
    }
  }
`;
