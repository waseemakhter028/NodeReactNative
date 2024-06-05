import React from 'react';
import {ActivityIndicator} from 'react-native';

import {View} from '../storybook';
const Loader = () => {
  return (
    <View className="rswidth-w-90 rsheight-h-60 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loader;
