import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';
import {fp} from '../helpers/responsive';
import {View} from '../storybook';

interface RatingType {
  rating: number;
  size: number;
  gap: number;
}

const RatingStar = ({rating, size, gap}: RatingType) => {
  return (
    <View className={`flex-row rsgap-w-${gap}`}>
      {[1, 2, 3, 4, 5].map(item => (
        <Ionicons
          key={item}
          name={rating >= item ? 'star-sharp' : 'star-outline'}
          size={fp(size)}
          color={Colors.cprimaryDark}
        />
      ))}
    </View>
  );
};

export default RatingStar;
