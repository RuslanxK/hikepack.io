import { gql } from '@apollo/client';


export const ADD_ITEM = gql`
  mutation AddItem($tripId: String!, $bagId: String!, $categoryId: String!, $name: String!, $qty: Int!, $description: String, $weight: Float!, $priority: String, $worn: Boolean, $order: Int, $weightOption: String) {
    addItem(tripId: $tripId, bagId: $bagId, categoryId: $categoryId, name: $name, qty: $qty, description: $description, weight: $weight, priority: $priority, worn: $worn, order: $order, weightOption: $weightOption) {
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

export const UPDATE_ITEM_ORDER = gql`
  mutation UpdateItemOrder($id: ID!, $order: Int!) {
    updateItemOrder(id: $id, order: $order) {
      id
    }
  }
`;


export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String, $qty: Int, $description: String, $weight: Float, $priority: String, $link: String, $worn: Boolean, $weightOption: String) {
    updateItem(id: $id, name: $name, qty: $qty, description: $description, weight: $weight, priority: $priority, link: $link, worn: $worn, weightOption: $weightOption) {
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


export const UPDATE_ITEM_LINK = gql`
  mutation UpdateItemLink($id: ID!, $link: String!) {
    updateItemLink(id: $id, link: $link) {
      id
    }
  }
`;
