import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import StackNav from './stack';

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
};

export default AppNavigation;
