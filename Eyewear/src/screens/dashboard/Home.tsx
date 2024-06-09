import React, {useEffect} from 'react';
import {View} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {NavigationProps} from '../../types';

const Home = () => {
  const navigation: NavigationProps = useNavigation();
  useEffect(() => {
    navigation.push('Home');
  }, [navigation]);
  return <View />;
};

export default Home;
