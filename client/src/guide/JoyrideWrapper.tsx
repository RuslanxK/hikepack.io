import React, { useState } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

// Extend Step with a custom property
interface CustomStep extends Step {
  disableNext?: boolean;
}

interface JoyrideWrapperProps {
  steps: CustomStep[];
  run?: boolean;
  onFinish?: () => void; 
}

const JoyrideWrapper: React.FC<JoyrideWrapperProps> = ({ steps, run = false, onFinish }) => {
  const [walkthroughActive, setWalkthroughActive] = useState(run);
  const [currentStep, setCurrentStep] = useState(0);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, action } = data;

    if (status === 'finished' || status === 'skipped') {
      setWalkthroughActive(false);
      if (onFinish) onFinish();
    }

    if (action === 'update' || action === 'next') {
      setCurrentStep(index);
    }
  };

  const currentStepConfig = steps[currentStep] || {};

  return (
    <Joyride
      steps={steps}
      run={walkthroughActive}
      continuous
      showSkipButton
      disableCloseOnEsc
      disableScrolling={false}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: '#f0f0f0',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          primaryColor: '#1d4ed8',
          textColor: '#000',
          zIndex: 1000,
        },
        buttonNext: currentStepConfig.disableNext
          ? { display: 'none' }
          : {},
      }}
    />
  );
};

export default JoyrideWrapper;
