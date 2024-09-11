
import { gql } from '@apollo/client';


export const ADD_TRIP = gql`
  mutation AddTrip($name: String!, $about: String!, $distance: String!, $startDate: String!, $endDate: String!, $imageUrl: String) {
    addTrip(name: $name, about: $about, distance: $distance, startDate: $startDate, endDate: $endDate, imageUrl: $imageUrl ) {
     id
    }
  }
`;



export const UPDATE_TRIP = gql`
  mutation UpdateTrip($id: ID!, $name: String!, $about: String!, $distance: String!, $startDate: String!, $endDate: String!, $imageUrl: String) {
    updateTrip(id: $id, name: $name, about: $about, distance: $distance, startDate: $startDate, endDate: $endDate, imageUrl: $imageUrl) {
      id
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