export interface Trip {
  id: string;
  name: string;
  about: string;
  distance: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  imageUrl: string
}

export interface GetTripData {
  trips: Trip[];
 
}

export interface AddTripData {
  addTrip: Trip;
}

export interface AddTripVars {
  name: string;
  about: string;
  distance: string;
  startDate: string;
  endDate: string;
  imageUrl: string
}

export interface DuplicateTripVars {

  id: string;
  name: string;
  about: string;
  distance: string;
  startDate: string;
  endDate: string;
  imageUrl: string

}

export interface UpdateTripData {
  updateTrip: Trip;
}

export interface UpdateTripVars {
  id: string;
  name: string;
  about: string;
  distance: string;
  startDate: string;
  endDate: string;
  imageUrl: string
  
}


export interface DeleteTripData {
  deleteTrip: { id: string };
}

export interface DeleteTripVars {
  id: string;
}

export interface SingleTripProps {
  tripData: Trip;
  
}


export interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  distanceUnit: string
 
}


export interface DuplicateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip
 
}

export interface UpdateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip
  distanceUnit: string
  

}

export interface DeleteTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip
 

}

