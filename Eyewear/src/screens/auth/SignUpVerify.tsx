import React, {useEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {FormikProvider, useFormik} from 'formik';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {
  ButtonWithLoader,
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../storybook';
import {NavigationProps, SignUpVerifyValidationProps} from '../../types';
import {verifySchema} from '../../validation';

const SignUpVerify = () => {
  const {Toast} = useContext();
  const {signUpVerify, setSignUpVerify} = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);

  const navigation: NavigationProps = useNavigation();
  const formik = useFormik({
    initialValues: {
      email: signUpVerify.email,
      otp: [],
    },
    validationSchema: verifySchema,
    onSubmit: values => handleVerifyAccount(values),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
  } = formik;

  const handleVerifyAccount = async (values: SignUpVerifyValidationProps) => {
    setLoading(true);
    const data = {
      email: values.email,
      otp: Number(values.otp.join('')),
    };
    try {
      const info = await axios.post('/verifyotp', JSON.stringify(data));
      const res = info.data;
      if (res.success === true) {
        resetForm();
        setSignUpVerify({
          verify: false,
          email: '',
        });
        Toast('success', 'Success !', 'Email verified successfully !!');
        navigation.push('Login');
      } else {
        Toast('danger', 'Error !', res.message);
      }
    } catch (e: any) {
      Toast('warning', 'Warning !', e.message);
    } finally {
      setLoading(false);
    }
  };

  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [isResendOTPDisable, setIsResendOTPDisable] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime === 0) {
          clearInterval(timer);
          setIsResendOTPDisable(false);
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [remainingTime]);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    let minutes: number | string = 0;
    if (min < 1) {
      minutes = '00';
    } else if (min > 0 && min < 10) {
      minutes = 0 + min;
    } else {
      minutes = min;
    }
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const sendOtp = async () => {
    setIsResendOTPDisable(true);
    try {
      const info = await axios.post(
        '/sendotp',
        JSON.stringify({
          email: signUpVerify.email,
        }),
      );
      const res = info.data;
      if (res.success === true) {
        setRemainingTime(60);
        Toast('success', 'Success !', 'OTP resend on email successfully !!');
      } else {
        Toast('danger', 'Error !', res.message);
      }
    } catch (e: any) {
      Toast('warning', 'Warning !', e.message);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.cprimaryDark, Colors.cprimaryLight]}
      className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.cprimaryDark}
      />
      <View className="rspaddingHorizontal-w-5">
        {/* image view */}
        <View className="items-center rspaddingTop-h-2">
          <Image
            source={require('../../../assets/images/logo.png')}
            className="rsheight-h-8 rswidth-h-8"
          />
        </View>
        <Text className="text-white font-bold rsfontSize-f-3 rsmarginTop-h-3">
          Account Verification
        </Text>
        {/* Form container */}
        <FormikProvider value={formik}>
          <View className="bg-botLinearOne rsmarginTop-h-2.5 rspaddingHorizontal-w-5 rspaddingVertical-h-4 rsborderRadius-w-3">
            {/* otp field */}
            <View>
              <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
                Enter OTP (OTP Is Already Sent Your Email)
              </Text>
              <View className="flex-row rsgap-w-1.8">
                {[1, 2, 3, 4, 5, 6].map((item, index) => (
                  <TextInput
                    key={item}
                    keyboardType="number-pad"
                    maxLength={1}
                    placeholderTextColor={Colors.cinputCol}
                    onChangeText={(text: string) => {
                      handleChange(`otp.${index}`)(text);
                    }}
                    onBlur={() => setFieldTouched('otp')}
                    className={`bg-white rsborderRadius-w-3 rswidth-w-12 rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.otp &&
                      errors.otp &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                ))}
              </View>
              {touched.otp && errors.otp && (
                <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                  {errors.otp}
                </Text>
              )}
            </View>
            {/* submit  button */}
            <View className="rspaddingTop-h-3">
              <ButtonWithLoader
                loading={loading}
                className="bg-cprimaryDark rounded-full rspadding-w-3.5"
                onPress={() => handleSubmit()}>
                <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                  Submit
                </Text>
              </ButtonWithLoader>
            </View>
            {/* submit  button */}
            <View className="rspaddingTop-h-3">
              <Pressable
                className={`${
                  isResendOTPDisable ? 'bg-border' : 'bg-lightgreen'
                } rounded-full rspadding-w-3.5`}
                disabled={isResendOTPDisable}
                onPress={sendOtp}>
                <Text
                  className={`text-center rsfontSize-f-2.5 font-bold ${
                    isResendOTPDisable ? 'text-cprimaryDark' : 'text-white'
                  }`}>
                  {isResendOTPDisable
                    ? `Resend OTP Enable: ${formatTime(remainingTime)}`
                    : 'Resend OTP'}
                </Text>
              </Pressable>
            </View>
            {/* links  */}
            <View className="rspaddingTop-h-2 items-end">
              <TouchableOpacity onPress={() => navigation.push('Login')}>
                <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1 rspaddingRight-w-4">
                  Already Verified? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FormikProvider>
      </View>
    </LinearGradient>
  );
};

export default SignUpVerify;
