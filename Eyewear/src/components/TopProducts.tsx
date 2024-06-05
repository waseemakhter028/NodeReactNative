import React from 'react';
import {FlatList} from 'react-native';

import ProductCard from './ProductCard';
import {wp} from '../helpers/responsive';
import {ItemProps} from '../types';

interface TopProductsProps {
  data: ItemProps[];
}

const TopProducts = ({data}: TopProductsProps) => {
  return (
    <FlatList
      numColumns={2}
      data={data}
      renderItem={({item}) => (
        <ProductCard item={item} isHideLikeSection={true} />
      )}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{gap: wp(5)}}
      scrollEnabled={false}
    />
  );
};

export default TopProducts;
