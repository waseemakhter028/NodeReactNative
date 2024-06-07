import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';
import {fp} from '../helpers/responsive';
import {View} from '../storybook';

interface RatingType {
  rating: number;
  size: number;
  gap: number;
  showStarRatingWise?: boolean;
}

const RatingStar = ({rating, size, gap, showStarRatingWise}: RatingType) => {
  return (
    <React.Fragment>
      {showStarRatingWise ? (
        <View className={`flex-row rsgap-w-${gap}`}>
          {Array.from(new Array(rating), (x, i) => i + 1).map(item => (
            <Ionicons
              key={item}
              name="star-sharp"
              size={fp(size)}
              color={Colors.cprimaryDark}
            />
          ))}
        </View>
      ) : (
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
      )}
    </React.Fragment>
  );
};

export default RatingStar;
