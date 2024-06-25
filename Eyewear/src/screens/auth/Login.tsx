import React, {useEffect, useState} from 'react';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {FormikProvider, useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {saveToAsyncStorage} from '../../helpers/common';
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
import {LoginValidationProps, NavigationProps} from '../../types';
import {loginSchema} from '../../validation';

const Login = () => {
  const {Toast} = useContext();
  const {t} = useTranslation();
  const {setIsLogin, setSignUpVerify, setCartCount} = useAppContext();
  const [isHidePass, setIsHidePass] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation: NavigationProps = useNavigation();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_CLIENT_ID,
      forceCodeForRefreshToken: true,
      offlineAccess: true,
    });
  }, []);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      login_type: 0,
    },
    validationSchema: loginSchema,
    onSubmit: values => handleLogin(values),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
  } = formik;

  const handleLogin = async (values: LoginValidationProps) => {
    setLoading(true);
    try {
      const info = await axios.post('/login', JSON.stringify(values));
      const res = info.data;
      if (res.success === true) {
        await saveToAsyncStorage({
          user: JSON.stringify(res.data),
          token: JSON.stringify(res.data.api_token),
          cartCount: JSON.stringify(res.data.cartCount),
        });
        resetForm();
        setIsLogin(true);
        setCartCount(res.data.cartCount);
        Toast('success', t('common.success'), t('login.res.success'), 1000);
        setTimeout(() => navigation.push('Home'), 1001);
      } else if (res.status === 201 && res.success === false) {
        setSignUpVerify({
          verify: true,
          email: values.email,
        });
        navigation.push('SignUpVerify');
      } else {
        Toast('danger', t('common.error'), res.message);
      }
    } catch (e: any) {
      Toast('warning', t('common.warning'), e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const googleRes = await GoogleSignin.signIn();
      try {
        const values = {
          social_id: googleRes.user.id,
          name: googleRes.user.name,
          email: googleRes.user.email,
          image: googleRes.user.photo,
          login_type: 1,
        };
        const info = await axios.post('/sociallogin', JSON.stringify(values));
        const res = info.data;
        if (res.success === true) {
          await saveToAsyncStorage({
            user: JSON.stringify(res.data),
            token: JSON.stringify(res.data.api_token),
            cartCount: JSON.stringify(res.data.cartCount),
          });
          setIsLogin(true);
          setCartCount(res.data.cartCount);
          Toast('success', t('common.success'), t('login.res.success'), 1000);
          setTimeout(() => navigation.push('Home'), 1001);
        } else {
          Toast('danger', t('common.error'), res.message);
        }
      } catch (e: any) {
        Toast('warning', t('common.warning'), e.message);
      } finally {
        setLoading(false);
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
          {t('login.title')}
        </Text>
        {/* Form container */}
        <FormikProvider value={formik}>
          <View className="bg-botLinearOne rsmarginTop-h-2.5 rspaddingHorizontal-w-5 rspaddingVertical-h-3 rsborderRadius-w-3">
            {/* email field */}
            <View>
              <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
                {t('login.label.email')}
              </Text>
              <TextInput
                placeholder={t('login.place.email')}
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
                  {t(errors.email)}
                </Text>
              )}
            </View>
            {/* password field */}
            <View className="rspaddingTop-h-2">
              <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
                {t('login.label.password')}
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
                  placeholder={t('login.place.password')}
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
                  {t(errors.password)}
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
                  {t('login.button.signin')}
                </Text>
              </ButtonWithLoader>
            </View>
            {/* facebook login  button */}
            <View className="rspaddingTop-h-2">
              <TouchableOpacity className="bg-cblue rounded-full rspadding-w-3.5">
                <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                  <FontAwesome name="facebook" size={fp(2.5)} />{' '}
                  {t('login.button.facebook')}
                </Text>
              </TouchableOpacity>
            </View>
            {/* google login  button */}
            <View className="rspaddingTop-h-2">
              <TouchableOpacity
                className="bg-cred rounded-full rspadding-w-3.5"
                onPress={() => handleGoogleLogin()}>
                <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                  <FontAwesome name="google-plus" size={fp(2.5)} />{' '}
                  {t('login.button.google')}
                </Text>
              </TouchableOpacity>
            </View>
            {/* links  */}
            <View className="rspaddingTop-h-3 flex-row justify-between">
              <TouchableOpacity onPress={() => navigation.push('SignUp')}>
                <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1">
                  {t('login.button.signup')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.push('ForgotPassword')}>
                <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1">
                  {t('login.button.forgot')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FormikProvider>
      </View>
    </LinearGradient>
  );
};

export default Login;
