import React from 'react';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import {fp} from '../../helpers/responsive';
import {Text, View} from '../../storybook';

interface TabType {
  color: string;
}

export const CartTab = ({color}: TabType) => {
  return (
    <View className="items-center">
      <Ionicons name="cart-outline" color={color} size={fp(3.5)} />
      <Text className={`font-bold rsfontSize-f-1.3 rscolor-${color}`}>
        Cart
      </Text>
    </View>
  );
};

export const HomeTab = ({color}: TabType) => {
  return (
    <View className="items-center">
      <Feather name="home" color={color} size={fp(3.5)} />
      <Text className={`font-bold rsfontSize-f-1.3 rscolor-${color}`}>
        Home
      </Text>
    </View>
  );
};

export const NotificationTab = ({color}: TabType) => {
  return (
    <View className="items-center">
      <Ionicons name="notifications-outline" color={color} size={fp(3.5)} />
      <Text className={`font-bold rsfontSize-f-1.3 rscolor-${color}`}>
        Notify
      </Text>
    </View>
  );
};

export const SearchTab = () => {
  return (
    <View className="items-center">
      <View className="bg-lightgreen items-center justify-center rsheight-h-4.5 rswidth-w-10 rsborderRadius-w-2">
        <Ionicons name="search" color={Colors.white} size={fp(3.5)} />
      </View>
    </View>
  );
};

export const OrderTab = ({color}: TabType) => {
  return (
    <View className="items-center">
      <Ionicons name="reorder-four" color={color} size={fp(3.5)} />
      <Text className={`font-bold rsfontSize-f-1.3 rscolor-${color}`}>
        Order
      </Text>
    </View>
  );
};
