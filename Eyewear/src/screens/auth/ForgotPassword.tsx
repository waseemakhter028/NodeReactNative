import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {FormikProvider, useFormik} from 'formik';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../constants/Colors';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {
  ButtonWithLoader,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../storybook';
import {ForgotPassValidationProps, NavigationProps} from '../../types';
import {forgotSchema} from '../../validation';

const ForgotPassword = () => {
  const {Toast} = useContext();
  const navigation: NavigationProps = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotSchema,
    onSubmit: values => handleForgotPassword(values),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
  } = formik;

  const handleForgotPassword = async (values: ForgotPassValidationProps) => {
    setLoading(true);
    try {
      const info = await axios.post('/forgotpassword', JSON.stringify(values));
      const res = info.data;
      if (res.success === true) {
        resetForm();
        Toast(
          'success',
          'Success !',
          'Password Sent On Email Successfully !',
          3000,
        );
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
          Forgot Password
        </Text>
        {/* Form container */}
        <FormikProvider value={formik}>
          <View className="bg-botLinearOne rsmarginTop-h-2.5 rspaddingHorizontal-w-5 rspaddingVertical-h-4 rsborderRadius-w-3">
            {/* otp field */}
            <View>
              <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
                Enter Email Id (Email Id To Receive New Password)
              </Text>
              <TextInput
                placeholder="Enter Email Id"
                maxLength={50}
                placeholderTextColor={
                  touched.email && errors.email ? Colors.cred : Colors.cinputCol
                }
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                autoCapitalize="none"
                className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                  touched.email &&
                  errors.email &&
                  'rsborderWidth-w-0.3 border-cred'
                }`}
              />
              {touched.email && errors.email && (
                <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                  {errors.email}
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
            {/* links  */}
            <View className="rspaddingTop-h-2 items-end">
              <TouchableOpacity onPress={() => navigation.push('Login')}>
                <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1 rspaddingRight-w-4">
                  Remember Password? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FormikProvider>
      </View>
    </LinearGradient>
  );
};

export default ForgotPassword;
