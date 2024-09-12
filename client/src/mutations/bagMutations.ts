
import { gql } from '@apollo/client';


export const ADD_BAG = gql`
  mutation AddBag($tripId: String!, $name: String!, $description: String!, $goal: String!, $exploreBags: Boolean!) {
    addBag(tripId: $tripId, name: $name, description: $description, goal: $goal, exploreBags: $exploreBags) {
      tripId
    }
  }
`;


export const UPDATE_BAG = gql`
  mutation UpdateBag($bagId: ID!, $name: String, $description: String, $goal: String, $exploreBags: Boolean) {
    updateBag(bagId: $bagId, name: $name, description: $description, goal: $goal, exploreBags: $exploreBags) {
      id
    }
  }
`;

export const DELETE_BAG = gql`
  mutation DeleteBag($id: ID!) {
    deleteBag(id: $id) {
      id
    }
  }
`;




export const UPDATE_LIKES_BAG = gql`
  mutation UpdateLikesBag($bagId: ID!, $increment: Int!) {
    updateLikesBag(bagId: $bagId, increment: $increment) {
      id
    }
  }
`;