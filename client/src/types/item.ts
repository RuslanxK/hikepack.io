export interface Item {
    id: string;
    tripId: string;
    bagId: string;
    categoryId: string;
    name: string;
    qty: number;
    description?: string;
    weight?: number;
    priority?: string;
    link?: string;
    worn?: boolean;
    imageUrl?: string;
    order?: number;
    weightOption?: string
  }
  
  export interface GetItemsData {
    items: Item[];
  }
  
  export interface AddItemVariables {
    tripId: string;
    bagId: string;
    categoryId: string;
    name: string;
    qty: number;
    weight: number
    
  }


  export interface AddRecentItemVariables {
    tripId: string;
    bagId: string;
    categoryId: string;
    name: string;
    qty: number;
    weight: number
    priority: string
    worn: boolean
    link: string
  }



  export interface SingleItemProps {
    itemData: Item;
    sendChecked: (id: string, checked: boolean) => void
    weightUnit: string
    index: number
  }


  export interface ItemPictureModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: string
    itemPicLink: string
    categoryId: string
  }
  
  
  export interface SingleItemShareProps {
    itemData: Item;
    weightUnit: string
  }


  export interface AddLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemLink?: string
    itemId: string;  
    categoryId: string
  }
  