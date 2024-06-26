import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import StackNav from './stack';
import {SaveInternetProps} from '../types';

const AppNavigation = ({connection}: SaveInternetProps) => {
  return (
    <NavigationContainer>
      <StackNav connection={connection} />
    </NavigationContainer>
  );
};

export default AppNavigation;
