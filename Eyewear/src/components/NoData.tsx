import React from 'react';

import {Image, View} from '../storybook';
const NoData = () => {
  return (
    <View className="rswidth-w-90 rsheight-h-30 justify-center items-center">
      <Image
        source={require('../../assets/images/nodata.png')}
        resizeMode="contain"
        className="rswidth-w-70 rsheight-h-30"
      />
    </View>
  );
};

export default NoData;
