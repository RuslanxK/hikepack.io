import { gql } from '@apollo/client';


export const GET_BAG = gql`
  query GetBag($id: ID!) {
    bag(id: $id) {
      id
      tripId
      name
      description
      goal
      likes
      imageUrl
      exploreBags
      
      categories {
      id
      tripId
      bagId
      name
      order
      color
      totalWeight
      totalWornWeight
      items {
         id
         categoryId
         bagId
         tripId
         name
         description
         qty
         weight
         weightOption
         priority
         imageUrl
         link
         worn
         order
       }
      }

      allItems {
          id
          tripId
          bagId
          categoryId
          name
          qty
          weight
          priority
          worn
          link
      }
      
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
      
      categories {
      id
      tripId
      bagId
      name
      order
      color
      totalWeight
      totalWornWeight
      items {
         id
         categoryId
         bagId
         tripId
         name
         description
         qty
         weight
         weightOption
         priority
         imageUrl
         link
         worn
         order
       }
      }
      
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


export const GET_ALL_USER_BAGS = gql`
  query GetUserBags($userId: ID!) {
    allUserBags(userId: $userId) {
      id
      name
      description
      exploreBags
      imageUrl
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