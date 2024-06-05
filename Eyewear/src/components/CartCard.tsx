import React, {useEffect, useState} from 'react';

import {Image, Text, TextPrice, TouchableOpacity, View} from '../storybook';
import {CardProps} from '../types';

const CartCard = ({item, handleDelete, handleUpdate, Toast}: CardProps) => {
  const [qty, setQty] = useState<number>(item.quantity);

  const plusQty = (cartId: string, quantity: number) => {
    if (quantity === 20) {
      Toast(
        'warning',
        'Warning !',
        'Only 20 quantity you can order at a time !',
      );
      return false;
    }
    const q = ++quantity;

    setQty(quantity);
    handleUpdate(cartId, q);
  };

  const minusQty = (cartId: string, quantity: number) => {
    if (quantity > 1) {
      const q = --quantity;
      setQty(quantity);
      handleUpdate(cartId, q);
    }
  };

  useEffect(() => {}, [qty]);
  return (
    <View className="flex-row rsmarginVertical-h-1.18">
      <View className="bg-white rsheight-h-15 rswidth-w-23 rsborderRadius-w-5">
        <Image
          source={{
            uri: process.env.IMAGE_URL + '/' + item.product_id.image,
          }}
          className="rsheight-h-15 rswidth-w-23"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 rsmarginHorizontal-w-2.4 rsmarginTop-h-1">
        <Text className="rsfontSize-f-2.2 text-productTitle rsfontWeight-500">
          {item.product_id.name}
        </Text>
        <View className="flex-row rsgap-w-15">
          <TextPrice className="rsfontSize-f-2.1 text-productPrice rsfontWeight-500 rsmarginVertical-h-1.18">
            {item.product_id.price}
          </TextPrice>
          <View className="flex-row rsmarginTop-h-1">
            <TouchableOpacity className="rsheight-w-8 rswidth-w-8 rsborderRadius-w-4 bg-cinputBg justify-center items-center">
              <Text
                className="rsfontSize-f-2.5 font-bold text-cblue"
                onPress={() => minusQty(item?.id, qty)}>
                -
              </Text>
            </TouchableOpacity>
            <View className="rsheight-w-8 rswidth-w-8 rsborderRadius-w-4 bg-white justify-center items-center">
              <Text className="rsfontSize-f-2.5 font-bold text-cblue">
                {qty}
              </Text>
            </View>
            <TouchableOpacity className="rsheight-w-8 rswidth-w-8 rsborderRadius-w-4 bg-cinputBg justify-center items-center">
              <Text
                className="rsfontSize-f-2.5 font-bold text-cblue"
                onPress={() => plusQty(item?.id, qty)}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row rsmarginHorizontal-w-2.4">
          <View
            className={`rsheight-w-7.9 rswidth-w-7.9 rsborderRadius-w-4 rsbackgroundColor-${item.color}`}
          />
          <View className="rsheight-w-7.9 rswidth-w-7.9 rsborderRadius-w-4 bg-white justify-center items-center rsmarginLeft-w-2.4">
            <Text className="rsfontSize-f-2.2 rsfontWeight-500 text-productTitle">
              {item.size}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Image
          source={require('../../assets/images/deleteIcon.png')}
          className="rsheight-h-3.52 rswidth-w-7.5 marginTop-h-1.18"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CartCard;
