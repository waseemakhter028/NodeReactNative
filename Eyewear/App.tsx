import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';

import {addEventListener} from '@react-native-community/netinfo';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import 'moment-timezone';
import './src/i18n/i18n.config';
import ToastMessage from './src/components/ToastMesssage';
import {AppContextProvider, useContext} from './src/context/AppContext';
import {ToastContextProvider} from './src/context/ToastContext';
import AppNavigation from './src/navigation';
import {SaveInternetProps} from './src/types';

const SaveInternet = ({connection}: SaveInternetProps) => {
  const {setIsConnected} = useContext();

  useEffect(() => {
    setIsConnected(connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <React.Fragment />;
};

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const unsubscribe = addEventListener((state: any) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <SaveInternet connection={isConnected} />
        <ToastContextProvider>
          <AppNavigation />
          <ToastMessage />
        </ToastContextProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
