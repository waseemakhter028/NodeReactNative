import React, {useState} from 'react';
import {FlatList} from 'react-native';

import NoData from './NoData';
import RatingStar from './RatingStar';
import {showNotifiDate} from '../helpers/common';
import {Image, Text, TouchableOpacity, View} from '../storybook';
import {ProductInfoAndReviewProps, ProductReviewProps} from '../types';

const Review = ({data}: ProductReviewProps) => {
  const getImage = (image: string) => {
    if (image !== null) {
      return {uri: process.env.USER_IMAGE_URL + '/' + image};
    } else {
      return require('../../assets/images/avatar.jpg');
    }
  };

  return (
    <View className="rsmarginTop-h-3">
      <View className="flex-row items-center rsgap-w-3.5">
        <Image
          source={getImage(data.image)}
          className="rsheight-h-4 rs rswidth-h-4 rounded-full"
        />
        <Text className="rsfontSize-f-1.5 text-productTitle rsfontWeight-500">
          {data.name}
        </Text>
        <RatingStar rating={data?.rating} size={3} gap={1.5} />
        <Text className="rsfontSize-f-1.5 text-cprimaryDark rsfontWeight-700">
          {showNotifiDate(data.created_at)}
        </Text>
      </View>
      <Text className="rsfontSize-f-1.6 text-productPrice rsfontWeight-500 rsmarginTop-h-1">
        {data.comment}
      </Text>
    </View>
  );
};

const ProductInfoAndReviews = ({
  information,
  reviews,
}: ProductInfoAndReviewProps) => {
  const [isInfoTab, setIsInfoTab] = useState<boolean>(true);
  return (
    <View>
      <View className="bg-cprimaryDark rsheight-h-7 rswidth-w-90 rsborderRadius-w-3 items-center justify-center flex-row">
        <TouchableOpacity
          className={`${
            isInfoTab ? 'bg-white' : 'bg-cprimaryDark'
          }  rsheight-h-5.5 rswidth-w-44 rsborderRadius-w-3 items-center justify-center rsmarginLeft-w-1.5`}
          onPress={() => setIsInfoTab(true)}>
          <Text
            className={`rsfontSize-f-2 ${
              isInfoTab ? 'text-cprimaryDark' : 'text-white'
            } text-center rsfontWeight-700`}>
            Information
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            !isInfoTab ? 'bg-white' : 'bg-cprimaryDark'
          } rsheight-h-5.5 rswidth-w-42 rsborderRadius-w-3 items-center justify-center rsmarginRight-w-1.5`}
          onPress={() => setIsInfoTab(false)}>
          <Text
            className={`rsfontSize-f-2  ${
              !isInfoTab ? 'text-cprimaryDark' : 'text-white'
            } text-center rsfontWeight-700`}>
            Reviews
          </Text>
        </TouchableOpacity>
      </View>
      {isInfoTab ? (
        <View className="rspaddingTop-h-2">
          <Text className="rsfontSize-f-2.5 text-productTitle rsfontWeight-500 text-center">
            Product Information
          </Text>
          <Text className="rsfontSize-f-1.8 text-productPrice rsfontWeight-500 rsmarginTop-h-2">
            {information}
          </Text>
        </View>
      ) : (
        <View>
          <FlatList
            numColumns={1}
            data={reviews}
            renderItem={({item}) => <Review data={item} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={<NoData />}
          />
        </View>
      )}
    </View>
  );
};

export default ProductInfoAndReviews;
