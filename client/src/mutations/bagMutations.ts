
import { gql } from '@apollo/client';


export const ADD_BAG = gql`
  mutation AddBag($tripId: String!, $name: String!, $description: String!, $goal: String!, $exploreBags: Boolean!, $imageUrl: String) {
    addBag(tripId: $tripId, name: $name, description: $description, goal: $goal, exploreBags: $exploreBags, imageUrl: $imageUrl) {
      tripId
    }
  }
`;

export const DUPLICATE_BAG = gql`
  mutation DuplicateBag($id: ID, $tripId: String!, $name: String!, $description: String!, $goal: String!, $exploreBags: Boolean!, $imageUrl: String) {
    duplicateBag(id: $id, tripId: $tripId, name: $name, description: $description, goal: $goal, exploreBags: $exploreBags, imageUrl: $imageUrl) {
      tripId
    }
  }
`;


export const UPDATE_BAG = gql`
  mutation UpdateBag($bagId: ID!, $name: String, $description: String, $goal: String, $exploreBags: Boolean, $imageUrl: String) {
    updateBag(bagId: $bagId, name: $name, description: $description, goal: $goal, exploreBags: $exploreBags, imageUrl: $imageUrl) {
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


export const UPDATE_BAG_PASSED_STATUS = gql`
  mutation UpdateBagPassedStatus($id: ID!, $passed: Boolean!) {
    updateBagPassedStatus(id: $id, passed: $passed) {
      id
      passed
    }
  }
`;