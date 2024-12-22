import { useState, useEffect } from 'react';


export const useJoyride = (key: string) => {
  const [isJoyrideRun, setIsJoyrideRun] = useState(false);
  useEffect(() => {
    const hasSeenJoyride = localStorage.getItem(key);
    if (!hasSeenJoyride) {
      setIsJoyrideRun(true);
      localStorage.setItem(key, 'true');
      
    }
  }, [key]);

  return isJoyrideRun;
};
