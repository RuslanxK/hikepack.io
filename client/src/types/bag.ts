export interface Bag {
  id: string;
  tripId: string;
  name: string;
  description: string;
  likes: number;
  exploreBags: boolean;
  goal: string;
  passed: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  
  // Add these properties
  totalWeight?: number;
  totalWornWeight?: number;
  baseWeight?: number;
}

  export interface GetBagsData {
    bags: Bag[];
  }


  export interface AddBagData {
    addBag: Bag;
  }


  export interface AddBagVars {
    tripId: string
    name: string;
    description: string;
    goal: string;
    imageUrl: string
    exploreBags: boolean
    
  }

  export interface UpdateBagData {
    updateBag: Bag;
  }
  
  export interface UpdateBagVars {
    bagId: string;
    name?: string;
    description?: string;
    imageUrl: string
    goal?: string;
  }
  

  export interface DeleteBagVars {
    id: string;
  }

  export interface DuplicateBagVars {

    id: string,
    tripId: string;
    name: string;
    description: string;
    goal: string;
    imageUrl: string
    exploreBags: boolean;
  }


  export interface DeleteBagData {
    deleteBag: { id: string };
  }

  export interface DuplicateBagData {
    duplicateBag: { id: string};
  }


  export interface SingleBagProps {
    bagData: Bag;
  
  }

  export interface AddBagModalProps {
    isOpen: boolean;
    onClose: () => void;
    weightUnit: string
  }

  export interface UpdateBagModalProps {
    isOpen: boolean;
    onClose: () => void;
    bag: Bag
    weightUnit: string
  }
  

  export interface LatestBagWithDetails {
    id: string;
    name: string;
    totalCategories: number;
    totalItems: number;
    totalWeight: number;
    goal: string
    passed: boolean
    
  }

  export interface DeleteBagModalProps {
    isOpen: boolean;
    onClose: () => void;
    bag: Bag
   
  
  }

  export interface DuplicateBagModalProps {
    isOpen: boolean;
    onClose: () => void;
    bag: Bag
   
  
  }
  
  export interface GetLatestBagWithDetailsData {
    latestBagWithDetails: LatestBagWithDetails;
  }