import React from 'react';
import {StyleSheet} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../constants/Colors';
import {useContext} from '../context/AppContext';
import {wp} from '../helpers/responsive';
import {Image, Text, TouchableOpacity, View} from '../storybook';

const NoInternet = () => {
  const {setIsConnected} = useContext();

  const recheckInternet = () => {
    NetInfo.refresh().then((state: any) => {
      setIsConnected(state.isConnected);
    });
  };

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <View className="flex-row justify-end items-center">
          <Image
            source={require('../../assets/images/logo.png')}
            className="rsheight-w-11 rswidth-w-11 rsborderRadius-w-5.5"
          />
        </View>
      </View>
      {/* content */}
      <View className="rspaddingTop-h-6 items-center justify-center">
        <Image
          source={require('../../assets/images/nointernet.jpg')}
          className="rsheight-h-30 rswidth-h-30 rs rs-borderRadius-h-15"
          resizeMode="cover"
        />
        <TouchableOpacity
          l
          className="bg-cprimaryDark rounded-full rspadding-w-3.5 rswidth-w-50 rsmarginTop-h-10"
          onPress={() => recheckInternet()}>
          <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
            Reload
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
