import React, {
  createContext,
  ReactNode,
  useContext as ReactUseContext,
  useMemo,
  useState,
} from 'react';

import {ToastDataProps} from '../types';
// Define a type for the context value
interface ToastType {
  toastData: ToastDataProps;
  Toast: (
    type: string,
    title: string,
    message: string,
    timeout: number,
  ) => void;
}

// Create the context with a default value (can be null initially)
const ToastContext = createContext<ToastType | null>(null);

// Define a provider component
export const ToastContextProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [toastData, setToastData] = useState<ToastDataProps>({
    showToast: false,
    type: 'success',
    title: 'Success',
    message: 'this is message',
    timeoutToast: 2000,
  });

  const Toast = (
    type = 'success',
    title = 'Sucess!!',
    message = 'This example message',
    timeout = 2000,
  ) => {
    setToastData({
      showToast: true,
      type: type,
      title: title,
      message: message,
      timeoutToast: timeout,
    });

    const timer = setTimeout(() => {
      setToastData({
        showToast: false,
        type: 'success',
        title: 'Success',
        message: 'this is message',
        timeoutToast: 2000,
      });
      clearTimeout(timer);
    }, timeout);
  };

  const value: ToastType = useMemo(() => ({toastData, Toast}), [toastData]);

  // Return the provider with the context value
  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

// Create a custom hook to consume the context
export const useContext = (): any => {
  const context = ReactUseContext(ToastContext);
  if (!context) {
    throw new Error('useContext must be used within a CartContextProvider');
  }
  return context;
};
