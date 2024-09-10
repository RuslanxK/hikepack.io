import { gql } from '@apollo/client';

export const GET_TRIPS = gql`
  query GetTrips {
    trips {
      id
      name
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
    }
  }
`;


