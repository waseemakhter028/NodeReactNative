import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import {FormikProvider, useFormik} from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {fp} from '../../helpers/responsive';
import {
  ButtonWithLoader,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../storybook';
import {NavigationProps, SignUpValidationProps} from '../../types';
import {signUpSchema} from '../../validation';

const SignUp = () => {
  const {Toast} = useContext();
  const {setSignUpVerify} = useAppContext();
  const [isHidePass, setIsHidePass] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation: NavigationProps = useNavigation();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      login_type: 0,
    },
    validationSchema: signUpSchema,
    onSubmit: values => handleSignup(values),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
  } = formik;

  const handleSignup = async (values: SignUpValidationProps) => {
    setLoading(true);
    try {
      const info = await axios.post('/register', JSON.stringify(values));
      const res = info.data;
      if (res.success === true) {
        resetForm();
        setSignUpVerify({
          verify: true,
          email: values.email,
        });
        Toast(
          'success',
          'Success !',
          'Successfully Sign up. Please verify your account',
          2000,
        );
        setTimeout(() => navigation.push('SignUpVerify'), 100);
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
          Sign Up
        </Text>
        {/* Form container */}
        <FormikProvider value={formik}>
          <View className="bg-botLinearOne rsmarginTop-h-2.5 rspaddingHorizontal-w-5 rspaddingVertical-h-4 rsborderRadius-w-3">
            {/* fullname field */}
            <View>
              <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
                Fullname
              </Text>
              <TextInput
                placeholder="Fullname"
                maxLength={50}
                placeholderTextColor={
                  touched.name && errors.name ? Colors.cred : Colors.cinputCol
                }
                onChangeText={handleChange('name')}
                onBlur={() => setFieldTouched('name')}
                autoCapitalize="none"
                className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                  touched.name &&
                  errors.name &&
                  'rsborderWidth-w-0.3 border-cred'
                }`}
              />
              {touched.name && errors.name && (
                <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                  {errors.name}
                </Text>
              )}
            </View>
            {/* email field */}
            <View className="rspaddingTop-h-2">
              <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
                Email ID
              </Text>
              <TextInput
                placeholder="Email Address"
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
            {/* password field */}
            <View className="rspaddingTop-h-2">
              <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
                Password
              </Text>
              <View
                className={`bg-white rounded-full rsheight-h-6 flex-row justify-between items-center ${
                  touched.password &&
                  errors.password &&
                  'rsborderWidth-w-0.3 border-cred'
                }`}>
                <TextInput
                  secureTextEntry={isHidePass}
                  maxLength={50}
                  placeholder="Password"
                  placeholderTextColor={
                    touched.password && errors.password
                      ? Colors.cred
                      : Colors.cinputCol
                  }
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  autoCapitalize="none"
                  className="bg-white rounded-full rsheight-h-5.5 rswidth-w-70  rsfontSize-f-2 rspaddingLeft-w-5 placeholder-cinputCol"
                />
                <TouchableOpacity
                  className="rspaddingRight-w-4"
                  onPress={() => setIsHidePass(!isHidePass)}>
                  <Ionicons
                    name={isHidePass ? 'eye-outline' : 'eye-off-outline'}
                    size={fp(2)}
                    color={
                      touched.password && errors.password
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text className="text-cred rsfontSize-f-1.5  rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                  {errors.password}
                </Text>
              )}
            </View>
            {/* sign in  button */}
            <View className="rspaddingTop-h-3">
              <ButtonWithLoader
                loading={loading}
                className="bg-cprimaryDark rounded-full rspadding-w-3.5"
                onPress={() => handleSubmit()}>
                <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                  Sign Up
                </Text>
              </ButtonWithLoader>
            </View>
            {/* links  */}
            <View className="rspaddingTop-h-2 items-end">
              <TouchableOpacity onPress={() => navigation.push('Login')}>
                <Text className="text-sizeActive font-bold rsfontSize-f-2 rspaddingRight-w-3">
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FormikProvider>
      </View>
    </LinearGradient>
  );
};

export default SignUp;
