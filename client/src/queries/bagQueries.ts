import { gql } from '@apollo/client';

export const GET_BAGS = gql`
  query GetBags($tripId: ID!) {
    bags(tripId: $tripId) {
      id
      tripId
      name
     
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