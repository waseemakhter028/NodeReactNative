import React from 'react';

import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';
import {useContext} from '../context/AppContext';
import {fp} from '../helpers/responsive';
import {Image, TouchableOpacity, View} from '../storybook';
import {NavigationProps} from '../types';

interface HeaderType {
  isFromDrawer?: boolean;
  isBack?: boolean;
}

const Header = ({isFromDrawer, isBack}: HeaderType) => {
  const navigation: NavigationProps = useNavigation();
  const {setIsOpenDrawer} = useContext();
  const handleDrawer = () => {
    if (isFromDrawer) {
      navigation.openDrawer();
    } else {
      setIsOpenDrawer(true);
      navigation.push('Dashboard');
    }
  };

  return (
    <View className="flex-row justify-between items-center">
      <View className="bg-lightgreen rsheight-w-10 rswidth-w-10 rsborderRadius-w-5 justify-center items-center">
        {isBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" color={Colors.white} size={fp(3)} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleDrawer}>
            <Ionicons name="reorder-four" color={Colors.white} size={fp(3)} />
          </TouchableOpacity>
        )}
      </View>
      <Image
        source={require('../../assets/images/logo.png')}
        className="rsheight-w-11 rswidth-w-11 rsborderRadius-w-5.5"
      />
    </View>
  );
};

export default Header;
