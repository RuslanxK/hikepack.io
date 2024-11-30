import { gql } from '@apollo/client';

export const GET_TRIPS = gql`
  query GetTrips {
    trips {
      id
      name
      about
      distance
      startDate
      endDate
      imageUrl
      
    }
  }
`;


export const GET_TRIP = gql`
 query GetTrip($id: ID!) {
    trip(id: $id) {
      id
      name
      about
      distance
      startDate
      endDate
      imageUrl
      bags {
        id
        name
        description
        goal
        imageUrl
      }
    }
  }
`;


export const GET_SHARED_TRIP = gql`
 query GetsSharedTrip($id: ID!) {
    sharedTrip(id: $id) {
      id
      name
      about
      distance
      startDate
      endDate
      imageUrl
      bags {
        id
        name
        description
        goal
        imageUrl
      }
    }
  }
`;



