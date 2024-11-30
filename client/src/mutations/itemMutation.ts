import { gql } from '@apollo/client';


export const ADD_ITEM = gql`
  mutation AddItem($tripId: String!, $bagId: String!, $categoryId: String!, $name: String!, $qty: Int!, $description: String, $weight: Float!, $priority: String, $worn: Boolean, $order: Int, $weightOption: String, $link: String) {
    addItem(tripId: $tripId, bagId: $bagId, categoryId: $categoryId, name: $name, qty: $qty, description: $description, weight: $weight, priority: $priority, worn: $worn, order: $order, weightOption: $weightOption, link: $link) {
      tripId
    }
  }
`;


export const DUPLICATE_ITEM = gql`
  mutation DuplicateItem($tripId: String!, $bagId: String!, $categoryId: String!, $name: String!, $qty: Int!, $description: String, $weight: Float!, $priority: String, $worn: Boolean, $order: Int, $weightOption: String, $link: String, $imageUrl: String) {
    duplicateItem(tripId: $tripId, bagId: $bagId, categoryId: $categoryId, name: $name, qty: $qty, description: $description, weight: $weight, priority: $priority, worn: $worn, order: $order, weightOption: $weightOption, link: $link, imageUrl: $imageUrl) {
      tripId
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;



export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String, $qty: Int, $description: String, $weight: Float, $priority: String, $link: String, $worn: Boolean, $weightOption: String, $order: Int) {
    updateItem(id: $id, name: $name, qty: $qty, description: $description, weight: $weight, priority: $priority, link: $link, worn: $worn, weightOption: $weightOption, order: $order) {
      id
    }
  }
`;



export const UPDATE_ITEM_PICTURE = gql`
  mutation UpdateItem($id: ID!, $imageUrl: String!) {
    updateItem(id: $id, imageUrl: $imageUrl) {
      id
    }
  }
`;

