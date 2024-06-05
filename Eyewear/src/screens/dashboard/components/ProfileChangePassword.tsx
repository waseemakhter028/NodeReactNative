import React, {useEffect, useState} from 'react';

import {FormikProvider, useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../../constants/Colors';
import {useContext} from '../../../context/ToastContext';
import {fp} from '../../../helpers/responsive';
import useAxios from '../../../hooks/useAxios';
import {Text, TextInput, TouchableOpacity, View} from '../../../storybook';
import {ProfileChangePasswordProps} from '../../../types';
import {profilePaswordSchema} from '../../../validation';

const ProfileChangePassword = () => {
  const {Toast} = useContext();
  const {axiosCall} = useAxios();
  const [isHidePass, setIsHidePass] = useState<boolean>(true);
  const [isHideConPass, setIsHideConPass] = useState<boolean>(true);

  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: profilePaswordSchema,
    onSubmit: values => handleChangePassword(values),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
  } = formik;

  const handleChangePassword = async (values: ProfileChangePasswordProps) => {
    const {data, error} = await axiosCall('/changepassword', {
      method: 'post',
      data: values,
    });
    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
    } else if (!error) {
      if (res.success === true) {
        resetForm();
        Toast('success', 'Success !', 'Password Changed Successfully !', 3000);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    }
  };

  useEffect(() => {
    resetForm();
    return () => {
      resetForm();
    };
  }, [resetForm]);

  return (
    <FormikProvider value={formik}>
      {/* Form container */}
      <KeyboardAwareScrollView>
        {/* fullname field */}
        <View>
          <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
            Current Password
          </Text>
          <TextInput
            secureTextEntry={true}
            maxLength={50}
            placeholder="Current Password"
            placeholderTextColor={
              touched.current_password && errors.current_password
                ? Colors.cred
                : Colors.cinputCol
            }
            onChangeText={handleChange('current_password')}
            onBlur={() => setFieldTouched('current_password')}
            autoCapitalize="none"
            className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
              touched.current_password &&
              errors.current_password &&
              'rsborderWidth-w-0.3 border-cred'
            }`}
          />
          {touched.current_password && errors.current_password && (
            <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
              {errors.current_password}
            </Text>
          )}
        </View>
        {/* new  password field */}
        <View className="rspaddingTop-h-2">
          <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
            New Password
          </Text>
          <View
            className={`bg-white rounded-full rsheight-h-6 flex-row justify-between items-center ${
              touched.new_password &&
              errors.new_password &&
              'rsborderWidth-w-0.3 border-cred'
            }`}>
            <TextInput
              secureTextEntry={isHidePass}
              maxLength={50}
              placeholder="New Password"
              placeholderTextColor={
                touched.new_password && errors.new_password
                  ? Colors.cred
                  : Colors.cinputCol
              }
              onChangeText={handleChange('new_password')}
              onBlur={() => setFieldTouched('new_password')}
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
                  touched.new_password && errors.new_password
                    ? Colors.cred
                    : Colors.cinputCol
                }
              />
            </TouchableOpacity>
          </View>
          {touched.new_password && errors.new_password && (
            <Text className="text-cred rsfontSize-f-1.5  rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
              {errors.new_password}
            </Text>
          )}
        </View>
        {/* confirm  password field */}
        <View className="rspaddingTop-h-2">
          <Text className="text-sizeActive font-bold rsfontSize-f-2 rspadding-w-1.5">
            Confirm Password
          </Text>
          <View
            className={`bg-white rounded-full rsheight-h-6 flex-row justify-between items-center ${
              touched.confirm_password &&
              errors.confirm_password &&
              'rsborderWidth-w-0.3 border-cred'
            }`}>
            <TextInput
              secureTextEntry={isHideConPass}
              maxLength={50}
              placeholder="Confirm Password"
              placeholderTextColor={
                touched.confirm_password && errors.confirm_password
                  ? Colors.cred
                  : Colors.cinputCol
              }
              onChangeText={handleChange('confirm_password')}
              onBlur={() => setFieldTouched('confirm_password')}
              autoCapitalize="none"
              className="bg-white rounded-full rsheight-h-5.5 rswidth-w-70  rsfontSize-f-2 rspaddingLeft-w-5 placeholder-cinputCol"
            />
            <TouchableOpacity
              className="rspaddingRight-w-4"
              onPress={() => setIsHideConPass(!isHideConPass)}>
              <Ionicons
                name={isHideConPass ? 'eye-outline' : 'eye-off-outline'}
                size={fp(2)}
                color={
                  touched.confirm_password && errors.confirm_password
                    ? Colors.cred
                    : Colors.cinputCol
                }
              />
            </TouchableOpacity>
          </View>
          {touched.confirm_password && errors.confirm_password && (
            <Text className="text-cred rsfontSize-f-1.5  rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
              {errors.confirm_password}
            </Text>
          )}
        </View>
      </KeyboardAwareScrollView>
      {/* sign in  button */}
      <View className="rspaddingTop-h-3">
        <TouchableOpacity
          className="bg-cprimaryDark rounded-full rspadding-w-3.5"
          onPress={() => handleSubmit()}>
          <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
            Change Password
          </Text>
        </TouchableOpacity>
      </View>
    </FormikProvider>
  );
};

export default ProfileChangePassword;
