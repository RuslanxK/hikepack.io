import { Bag } from "./bag";
import { Item } from "./item";

export interface Category {
    id: string;
    tripId: string;
    bagId: string;
    name: string;
    order: number | null;
    color: string;
    totalWeight: number
    totalWornWeight: number
    items: Item[];
    
    
  }
  
  export interface GetCategoriesData {
    categories: Category[];
    
  }
  
  export interface GetCategoryData {
    category: Category;
   
  }
  
  export interface CategoryProps {
    categoryData: {
      id: string;
      tripId: string;
      bagId: string;
      name: string;
      items: Item[];
      color: string;
    };

    weightUnit: string
  }

  export interface CategoryChartProps {
    categories: Category[];
    weightUnit: string
  }

  export interface CategoryTableProps {
    categories: Category[];
    weightUnit: string
    bag?: Bag
  }


  export interface DeleteCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
   categoryId: string
   categoryName: string
  }

  export interface AddItemToCategoryModalProps {

    onClose: () => void;
    isOpen: boolean;
    categories: Category[]
    item: Item
   
  }
  

