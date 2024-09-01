import { gql } from '@apollo/client';

export const GET_BAGS = gql`
  query GetBags($tripId: ID!) {
    bags(tripId: $tripId) {
      id
      tripId
      name
      description
      goal
     
      
    }
  }
`;

export const GET_BAG = gql`
  query GetBag($id: ID!) {
    bag(id: $id) {
      id
      tripId
      name
      description
      goal
      likes
      exploreBags
      
    }
  }
`;



export const GET_SHARED_BAG = gql`
  query GetSharedBag($id: ID!) {
    sharedBag(id: $id) {
      id
      tripId
      name
      description
      goal
      likes
      exploreBags
     
    }
  }
`;



export const ADD_BAG = gql`
  mutation AddBag($tripId: String!, $name: String!, $description: String!, $goal: String!, $exploreBags: Boolean!) {
    addBag(tripId: $tripId, name: $name, description: $description, goal: $goal, exploreBags: $exploreBags) {
      tripId
      name
      description
      goal
      exploreBags
    }
  }
`;




export const UPDATE_BAG = gql`
  mutation UpdateBag($bagId: ID!, $name: String!, $description: String!, $goal: String!) {
    updateBag(bagId: $bagId, name: $name, description: $description, goal: $goal) {
      id
      tripId
      name
      description
      goal
     
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


export const GET_LATEST_BAGS = gql`
  query GetLatestBags {
    latestBags {
      id
      name
    }
  }
`;


export const GET_LATEST_BAG_WITH_DETAILS = gql`
  query GetLatestBagWithDetails {
    latestBagWithDetails {
      id
      name
      totalCategories
      totalItems
      totalWeight
      goal
    }
  }
`;



export const UPDATE_EXPLORE_BAGS = gql`
  mutation UpdateExploreBags($bagId: ID!, $exploreBags: Boolean!) {
    updateExploreBags(bagId: $bagId, exploreBags: $exploreBags) {
      id
      tripId
      name
      description
      goal
      exploreBags
    }
  }
`;


export const UPDATE_LIKES_BAG = gql`
  mutation UpdateLikesBag($bagId: ID!, $increment: Int!) {
    updateLikesBag(bagId: $bagId, increment: $increment) {
      id
      likes
    }
  }
`;


export const GET_EXPLORE_BAGS = gql`
  query GetExploreBags {
    exploreBags {
      id
      tripId
      name
      description
      goal
      likes
      totalCategories
      totalItems
      owner
    }
  }
`;