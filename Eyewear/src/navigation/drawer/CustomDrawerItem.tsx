import React from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {fp} from '../../helpers/responsive';

interface DrawerType {
  color: string;
}

export const ProfileDrawer = ({color}: DrawerType) => {
  return <FontAwesome name="user-o" size={fp(2.5)} color={color} />;
};

export const HomeDrawer = ({color}: DrawerType) => {
  return <Ionicons name="home-outline" size={fp(2.5)} color={color} />;
};

export const AddressDrawer = ({color}: DrawerType) => {
  return <FontAwesome name="address-book-o" size={fp(2.5)} color={color} />;
};

export const CouponDrawer = ({color}: DrawerType) => {
  return <AntDesign name="tago" size={fp(2.5)} color={color} />;
};

export const AboutUsDrawer = ({color}: DrawerType) => {
  return <MaterialIcons name="details" size={fp(2.5)} color={color} />;
};

export const ContactUsDrawer = ({color}: DrawerType) => {
  return <AntDesign name="contacts" size={fp(2.5)} color={color} />;
};

export const LanguageDrawer = ({color}: DrawerType) => {
  return <FontAwesome name="language" size={fp(2.5)} color={color} />;
};
