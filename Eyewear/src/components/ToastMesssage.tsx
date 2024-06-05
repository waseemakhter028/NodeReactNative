import React from 'react';
import {StyleSheet} from 'react-native';

import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Colors from '../constants/Colors';
import {useContext} from '../context/ToastContext';
import {fp, hp, wp} from '../helpers/responsive';
import {Text, View} from '../storybook';

const ToastMessage = () => {
  const {toastData} = useContext();
  const {showToast, type, title, message} = toastData;

  const TOAST_TYPE: any = {
    success: {
      backgroundColor: Colors.toastSuccess,
      icon: 'check-circle',
    },
    danger: {
      backgroundColor: Colors.toastDanger,
      icon: 'exclamation-circle',
    },
    info: {
      backgroundColor: Colors.toastInfo,
      icon: 'info-circle',
    },
    warning: {
      backgroundColor: Colors.toastWarning,
      icon: 'exclamation-triangle',
    },
  };

  const backgroundColor = TOAST_TYPE[type].backgroundColor;
  const icon = TOAST_TYPE[type].icon;

  return (
    <>
      {showToast && (
        <Animated.View
          style={[styles.animatedView, {backgroundColor: backgroundColor}]}
          entering={FadeInUp.delay(200)}
          exiting={FadeOutUp}>
          <FontAwesome5 name={icon} size={fp(4)} color={Colors.white} />

          <View className="rsmarginLeft-w-5">
            <Text className="rsfontSize-f-2  text-white">{title}</Text>
            <Text className="rsfontSize-f-1.5 rsfontWeight-400 text-white">
              {message}
            </Text>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default ToastMessage;

const styles = StyleSheet.create({
  animatedView: {
    position: 'absolute',
    top: hp(0),
    left: wp(5),
    width: wp(90),
    height: hp(8),
    borderRadius: wp(2),
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: hp(0.5),
    },
    shadowOpacity: 0.25,
    shadowRadius: hp(1.84),
    elevation: 5,
  },
});
