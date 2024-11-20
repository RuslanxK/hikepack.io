import React from 'react';

interface MessageProps {
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  padding?: string; 
  width?: string; 
  titleMarginBottom?: string; 
}

const Message: React.FC<MessageProps> = ({
  title,
  message,
  type,
  padding = 'p-8',
  width = 'w-fit',
  titleMarginBottom = 'mb-2',
}) => {
  const getStyles = () => {
    switch (type) {
      case 'info':
        return {
          bgColor: 'bg-info-body dark:bg-gray-800 border border-info-headline',
          titleColor: 'text-info-headline dark:text-white',
          messageColor: 'text-zinc-700 dark:text-gray-300',
          iconPath: 'M12 9V12M12 15H12.01M21 12A9 9 0 1 1 12 3A9 9 0 0 1 21 12Z'
        };
      case 'success':
        return {
          bgColor: 'bg-green bg-opacity-10 border border-green dark:bg-green-50',
          titleColor: 'text-green dark:text-green',
          messageColor: 'text-emerald-800 dark:text-gray-300',
          iconPath: 'M9 12L11 14L15 10M21 12A9 9 0 1 1 12 3A9 9 0 0 1 21 12Z'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 dark:bg-red-950 border border-red-500',
          titleColor: 'text-red',
          messageColor: 'text-button-red dark:text-red',
          iconPath: 'M12 9V12M12 15H12.01M21 12A9 9 0 1 1 12 3A9 9 0 0 1 21 12Z'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow dark:bg-black',
          titleColor: 'text-yellow',
          messageColor: 'text-yellow',
          iconPath: 'M12 8V12M12 16H12.01M21 12A9 9 0 1 1 12 3A9 9 0 0 1 21 12Z'
        };
      default:
        return {
          bgColor: 'bg-blue dark:bg-black',
          titleColor: 'text-blue',
          messageColor: 'text-blue',
          iconPath: 'M12 9V12M12 15H12.01M21 12A9 9 0 1 1 12 3A9 9 0 0 1 21 12Z'
        };
    }
  };

  const { bgColor, titleColor, messageColor, iconPath } = getStyles();

  return (
    <div className={`flex ${width} items-left ${padding} h-fit text-sm rounded-lg ${bgColor}`} role="alert">
      <svg className={`flex-shrink-0 inline w-5 h-5 me-3 ${titleColor}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      <span className="sr-only">{title}</span>
      <div className='flex flex-col'>
        <span className={`font-medium ${titleMarginBottom} ${titleColor}`}>{title}</span> 
        <span className={messageColor}>{message}</span>
      </div>
    </div>
  );
};

export default Message;
