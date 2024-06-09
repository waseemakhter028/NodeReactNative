import 'react-native-gesture-handler';
import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import 'moment-timezone';
import './src/i18n/i18n.config';
import ToastMessage from './src/components/ToastMesssage';
import {AppContextProvider} from './src/context/AppContext';
import {ToastContextProvider} from './src/context/ToastContext';
import AppNavigation from './src/navigation';

const App = () => {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <ToastContextProvider>
          <AppNavigation />
          <ToastMessage />
        </ToastContextProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
