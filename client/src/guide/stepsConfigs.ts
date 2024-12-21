import { StepConfig } from './steps';

export const homeStepsConfig: StepConfig[] = [
  {
    target: '.add-trip-button',
    content: 'Start planning your next adventure by adding a new trip here!',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
    disableNext: true,
  },
];



export const createTripStepsConfig: StepConfig[] = [
  {
    target: '.trip-name',
    content: 'Step 1: Enter the name of your trip. This will be the main identifier for your adventure.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
    
    
  },
  {
    target: '.trip-distance',
    content: 'Step 2: Specify the distance for your trip. It helps calculate goals and progress.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
    
  },
  {
    target: '.trip-description',
    content: 'Step 3: Provide a brief description of your trip. Share key details about your plans.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
   
  },
  {
    target: '.trip-start-date',
    content: 'Step 4: Choose the start date for your trip. This marks the beginning of your adventure.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
    
  },
  {
    target: '.trip-end-date',
    content: 'Step 5: Choose the end date for your trip. This marks the conclusion of your journey.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
    
  },
  {
    target: '.trip-image',
    content: 'Step 6: Upload an image to represent your trip. If no image is uploaded, a random image will be chosen automatically.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
    
  },
  {
    target: '.trip-submit-button',
    content: 'All set! Click here to save and create your trip.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
   
  },
];



export const createBagStepsConfig: StepConfig[] = [
  {
    target: '.bag-name',
    content: 'Step 1: Enter the name of your bag.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.bag-weight-goal',
    content: 'Step 2: Set a weight goal for your bag. This helps you track your packing limits.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
   
  },
  {
    target: '.bag-description',
    content: 'Step 3: Provide a brief description of your bag. Add any additional notes or details.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
   
  },
  {
    target: '.bag-image-upload',
    content: 'Step 4: Choose an image to represent your bag.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
    
  },
  {
    target: '.bag-custom-image',
    content: 'Step 5: Optionally, select a custom image for your bag if you prefer.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
   
  },
  {
    target: '.bag-submit-button',
    content: 'All set! Click here to save and create your bag.',
    placement: 'bottom',
    disableInteraction: true,
    disableScrolling: true,
  
  },
];





export const tripDetailsStepsConfig: StepConfig[] = [
  {
    target: '.add-bag-button',
    content: 'Add a new bag to your trip here.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.edit-trip-button',
    content: 'Edit the details of your trip',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
];



export const bagDetailsStepsConfig: StepConfig[] = [
  {
    target: '.add-category-button',
    content: 'Add a new category to your bag.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.edit-bag-button',
    content: 'Edit the details of your bag',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.bag-link-button',
    content: 'Share your bag details with others',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },

];


export const categoryDetailsStepsConfig: StepConfig[] = [
  {
    target: '.edit-category-button',
    content: 'Modify the name of this category',
    placement: 'top',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.delete-category-button',
    content: 'Remove this category permanently',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.close-open-category-button',
    content: 'Toggle the visibility of this category to hide or display its contents.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.drag-category-button',
    content: 'Reorder this category by dragging it to your desired position.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.add-item-button',
    content: 'Add new items to this category',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
];


export const itemDetailsStepsConfig: StepConfig[] = [
  {
    target: '.drag-item-button',
    content: 'Drag and rearrange the item to change its order within the list.',
    placement: 'top',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.checkbox-item-button',
    content: 'Toggle the checkbox to select or deselect this item for deletion',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-name',
    content: 'Enter or update the name of this item to identify it clearly.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-description',
    content: 'Add a brief description to provide more context about this item.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-qty',
    content: 'Specify the quantity of this item for accurate inventory tracking.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },

  {
    target: '.item-weight',
    content: 'Enter or adjust the weight of this item for accurate calculations and tracking.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-weight-option',
    content: 'Choose the weight unit for this item (e.g., kg, g, lb, oz).',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-priority',
    content: 'Set the priority level of this item (Low, Medium, High).',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-image',
    content: 'Upload or view an image associated with this item.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-wear',
    content: 'Toggle this option if the item will be worn instead of packed.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-duplicate',
    content: 'Duplicate this item to create a copy with the same details.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
  {
    target: '.item-link',
    content: 'Attach a link to an external resource or product page for this item.',
    placement: 'bottom',
    disableBeacon: true,
    disableInteraction: true,
    disableScrolling: true,
  },
];