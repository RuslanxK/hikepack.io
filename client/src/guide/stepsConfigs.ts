import { StepConfig } from './steps';

export const homeStepsConfig: StepConfig[] = [
  {
    target: '.add-trip-button',
    content: 'Start planning your next adventure by adding a new trip here!',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.welcome-message',
    content: 'This is your dashboard. Manage your trips and bags here.',
    placement: 'right',
  },
  {
    target: '.latest-bag-status',
    content: 'Here you can see the latest status of your bag.',
    placement: 'top',
    disableBeacon: false,
  },
];
