import { gql } from '@apollo/client';

// Define GraphQL queries and mutations
export const GET_TRIPS = gql`
  query GetTrips {
    trips {
      id
      name
      startDate
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


export const ADD_TRIP = gql`
  mutation AddTrip($name: String!, $about: String!, $distance: String!, $startDate: String!, $endDate: String!, $imageUrl: String) {
    addTrip(name: $name, about: $about, distance: $distance, startDate: $startDate, endDate: $endDate, imageUrl: $imageUrl ) {
      name
      about
      distance
      startDate
      endDate
      imageUrl
      
    }
  }
`;



export const UPDATE_TRIP = gql`
  mutation UpdateTrip($id: ID!, $name: String!, $about: String!, $distance: String!, $startDate: String!, $endDate: String!, $imageUrl: String) {
    updateTrip(id: $id, name: $name, about: $about, distance: $distance, startDate: $startDate, endDate: $endDate, imageUrl: $imageUrl) {
      id
      name
      about
      distance
      startDate
      imageUrl
      endDate
    }
  }
`;



export const DELETE_TRIP = gql`
  mutation DeleteTrip($id: ID!) {
    deleteTrip(id: $id) {
      id
    }
  }
`;