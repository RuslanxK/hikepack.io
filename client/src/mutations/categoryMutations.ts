
import { gql } from "@apollo/client";


export const ADD_CATEGORY = gql`
  mutation AddCategory($tripId: String! $bagId: String! $name: String! $color: String) {
    addCategory(tripId: $tripId, bagId: $bagId, name: $name, color: $color) {
      tripId
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

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $order: Int, $name: String) {
    updateCategory(id: $id, order: $order, name: $name ) {
      id
      name
      order
      color
    }
  }
`;