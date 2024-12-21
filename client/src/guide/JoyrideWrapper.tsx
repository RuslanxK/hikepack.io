// src/shared/JoyrideWrapper.tsx
import React, { useState } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface JoyrideWrapperProps {
  steps: Step[];
  run?: boolean;
  onFinish?: () => void; 
}

const JoyrideWrapper: React.FC<JoyrideWrapperProps> = ({ steps, run = false, onFinish }) => {
  const [walkthroughActive, setWalkthroughActive] = useState(run);

  const handleJoyrideCallback = (data: CallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      setWalkthroughActive(false);
      if (onFinish) onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={walkthroughActive}
      continuous
      showSkipButton
      styles={{
        options: {
          arrowColor: '#f0f0f0',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          primaryColor: '#1d4ed8',
          textColor: '#000',
          zIndex: 1000,
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default JoyrideWrapper;
