import React, {useEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {useSharedValue, withSpring} from 'react-native-reanimated';

import Colors from '../constants/Colors';
import {hp} from '../helpers/responsive';
import {Image, StatusBar, Text, TouchableOpacity, View} from '../storybook';
import {NavigationProps} from '../types';

const WelcomeScreen = () => {
  const {t} = useTranslation();
  const ring1Padding = useSharedValue(0);
  const ring2Padding = useSharedValue(0);
  const [nextCount, setNextCount] = useState(0);

  const navigation: NavigationProps = useNavigation();

  const handleNextScreen = () => {
    let current = nextCount;
    ++current;
    setNextCount(current);
    if (current >= 3) {
      setNextCount(0);
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    ring1Padding.value = 0;
    ring2Padding.value = 0;

    setTimeout(
      () => (ring1Padding.value = withSpring(ring1Padding.value + hp(5))),
      100,
    );
    setTimeout(
      () => (ring2Padding.value = withSpring(ring2Padding.value + hp(5.5))),
      300,
    );
    return () => setNextCount(0);
  }, [ring1Padding, ring2Padding]);

  return (
    <LinearGradient
      colors={[Colors.cprimaryDark, Colors.cprimaryLight]}
      className="flex-1">
      <View className="flex-1 justify-center items-center space-y-10">
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.cprimaryDark}
        />
        {/* screen one*/}
        {nextCount === 0 && (
          <View>
            {/* logo image with rings */}
            <Animated.View
              style={{
                padding: ring2Padding,
                backgroundColor: Colors.ringOne,
                borderRadius: hp(20),
              }}>
              <Animated.View
                style={{
                  padding: ring1Padding,
                  backgroundColor: Colors.ringTwo,
                  borderRadius: hp(20),
                }}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  className="rsheight-h-20 rswidth-h-20 rsborderRadius-h-10"
                />
              </Animated.View>
            </Animated.View>

            {/* title and punchline */}
            <View className="flex items-center">
              <Text className="font-bold text-white rsfontSize-f-7">
                {t('welcome.title')}
              </Text>
              <Text className="rsfontSize-f-2 text-white tracking-widest">
                {t('welcome.subtitle')}
              </Text>
            </View>
          </View>
        )}
        {/* screen two */}
        {nextCount === 1 && (
          <View className="items-center justify-center">
            {/* logo image with rings */}
            <Animated.View
              style={{
                padding: ring1Padding,
                backgroundColor: Colors.ringTwo,
                borderRadius: hp(20),
              }}>
              <Image
                source={require('../../assets/images/logo.png')}
                className="rsheight-h-20 rswidth-h-20 rsborderRadius-h-10"
              />
            </Animated.View>
            <View className="justify-center rspaddingTop-h-3 rspaddingHorizontal-w-2">
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_1')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_2')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_3')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_4')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_5')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_6')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_7')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_8')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_9')}
              </Text>
              <Text className="text-white rsfontSize-f-2.2">
                &#8226; {t('welcome.line_10')}
              </Text>
            </View>
          </View>
        )}
        {/* screen three */}
        {nextCount === 2 && (
          <View className="items-center justify-center">
            {/* logo image with rings */}
            <Animated.View
              style={{
                padding: ring1Padding,
                backgroundColor: Colors.ringTwo,
                borderRadius: hp(20),
              }}>
              <Image
                source={require('../../assets/images/logo.png')}
                className="rsheight-h-20 rswidth-h-20 rsborderRadius-h-10"
              />
            </Animated.View>
            <View className="justify-center rspaddingTop-h-3 rspaddingHorizontal-w-2">
              <Text className="text-white rsfontSize-f-3">
                {t('welcome.letstart')}
              </Text>
            </View>
          </View>
        )}
        {/* button container */}
        <View>
          <View className="flex-row items-center justify-center rsgap-w-3">
            {[0, 1, 2].map(item => (
              <View
                className={`rsheight-h-1.5 rswidth-h-1.5 rounded-full ${
                  nextCount === item ? 'bg-lightgreen' : 'bg-white'
                }`}
                key={item}
              />
            ))}
          </View>
          <TouchableOpacity
            className="bg-lightgreen rspadding-w-1.5 rsmarginTop-h-2.5 rounded-full"
            onPress={() => handleNextScreen()}>
            <Text className="text-white text-center">{t('welcome.next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default WelcomeScreen;
