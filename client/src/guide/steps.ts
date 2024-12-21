import { Step } from 'react-joyride';

export interface StepConfig {
  target: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'; // Specify valid placement values
  disableBeacon?: boolean;
}

export const getSteps = (configs: StepConfig[]): Step[] => {
  return configs.map((config) => ({
    target: config.target,
    content: config.content,
    placement: config.placement || 'bottom', // Default placement is 'bottom'
    disableBeacon: config.disableBeacon ?? true, // Default is true if not provided
  }));
};
