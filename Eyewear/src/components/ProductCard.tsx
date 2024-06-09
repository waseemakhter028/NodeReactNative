import React from 'react';

import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import Colors from '../constants/Colors';
import {fp} from '../helpers/responsive';
import {
  ImageBackground,
  Text,
  TextPrice,
  TouchableOpacity,
  View,
} from '../storybook';
import {NavigationProps, ProductCardProps} from '../types';

const ProductCard = ({
  item,
  isLiked,
  setIsLiked,
  isHideLikeSection,
}: ProductCardProps) => {
  const navigation: NavigationProps = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.push('ProductDetails', {item})}
      className="flex-1 rsmarginTop-h-2.5">
      <View className="bg-white  rsheight-h-32.5 rswidth-w-42.5 rsborderRadius-w-5 ">
        <ImageBackground
          source={{
            uri: process.env.IMAGE_URL + '/' + item.image,
          }}
          resizeMode="contain"
          className="rsheight-h-30.5 rswidth-w-40.5 rsborderRadius-w-5">
          {!isHideLikeSection && (
            <React.Fragment>
              {isLiked?.includes(item.id) ? (
                <TouchableOpacity
                  onPress={() => {
                    const data = isLiked;
                    const index = data.indexOf(item.id);
                    if (index !== -1) {
                      data.splice(index, 1);
                    }
                    if (setIsLiked !== undefined) {
                      setIsLiked([...data]);
                    }
                  }}
                  className="rsheight-h-4 rswidth-h-4 rounded-full bg-border items-center justify-center rsmarginLeft-w-31 rsmarginTop-h-2">
                  <AntDesign
                    name="heart"
                    size={fp(2.5)}
                    color={Colors.cprimaryDark}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    isLiked !== undefined &&
                    setIsLiked !== undefined &&
                    setIsLiked([...isLiked, item.id])
                  }
                  className="rsheight-h-4 rswidth-h-4 rounded-full bg-border items-center justify-center rsmarginLeft-w-31 rsmarginTop-h-2">
                  <AntDesign
                    name="hearto"
                    size={fp(2.5)}
                    color={Colors.cprimaryDark}
                  />
                </TouchableOpacity>
              )}
            </React.Fragment>
          )}

          <View className="flex-1 items-center justify-end">
            <Text className="rsfontSize-f-2.2 text-productTitle rsfontWeight-600">
              {item.name}
            </Text>
            <TextPrice className="rsfontSize-f-2.2 text-productPrice rsfontWeight-600">
              {item.price}
            </TextPrice>
            <View className="rspaddingLeft-w-32">
              <Entypo
                name="shopping-cart"
                size={fp(2.5)}
                color={Colors.cprimaryDark}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
