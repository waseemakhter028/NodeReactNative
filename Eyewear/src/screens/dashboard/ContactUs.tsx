import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {FormikProvider, useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {wp} from '../../helpers/responsive';
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from '../../storybook';
import {ContactUsProps, NavigationProps} from '../../types';
import {contactSchema} from '../../validation';

const ContactUsScreen = () => {
  const {Toast} = useContext();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation: NavigationProps = useNavigation();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
    validationSchema: contactSchema,
    onSubmit: values => sendQuery(values),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
    initialValues,
  } = formik;

  const sendQuery = async (values: ContactUsProps) => {
    setLoading(true);
    try {
      const info = await axios.post('/contact', values);
      const res = info.data;
      if (res.success === true) {
        resetForm();
        Toast(
          'success',
          'Success !',
          'Query Sent To Admin Successfully !',
          3000,
        );
        navigation.navigate('Home');
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
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header isFromDrawer={true} />
      </View>
      {/* form container */}
      <KeyboardAwareScrollView>
        <View className="rsmarginTop-h-4">
          <View className="bg-border rsmarginTop-h-2.5 rspaddingHorizontal-w-5 rspaddingVertical-h-4 rsborderRadius-w-5">
            <Text className="rsfontSize-f-2.5 text-cblue text-center rsmarginBottom-h-2">
              Leave Message
            </Text>
            <FormikProvider value={formik}>
              {/* name field */}
              <View>
                <Text className="text-cblue font-bold rsfontSize-f-2 rspadding-w-1.5">
                  Your Name
                </Text>
                <TextInput
                  placeholder="Name"
                  maxLength={40}
                  placeholderTextColor={
                    touched.name && errors.name ? Colors.cred : Colors.cinputCol
                  }
                  defaultValue={initialValues.name}
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
              <View className="rsmarginTop-h-2">
                <Text className="text-cblue font-bold rsfontSize-f-2 rspadding-w-1.5">
                  Your Email
                </Text>
                <TextInput
                  placeholder="Email"
                  maxLength={50}
                  placeholderTextColor={
                    touched.email && errors.email
                      ? Colors.cred
                      : Colors.cinputCol
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
              {/* phone field */}
              <View className="rsmarginTop-h-2">
                <Text className="text-cblue font-bold rsfontSize-f-2 rspadding-w-1.5">
                  Your Phone Number
                </Text>
                <TextInput
                  placeholder="Phone Number"
                  maxLength={10}
                  keyboardType="number-pad"
                  placeholderTextColor={
                    touched.phone && errors.phone
                      ? Colors.cred
                      : Colors.cinputCol
                  }
                  onChangeText={handleChange('phone')}
                  onBlur={() => setFieldTouched('phone')}
                  autoCapitalize="none"
                  className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                    touched.phone &&
                    errors.phone &&
                    'rsborderWidth-w-0.3 border-cred'
                  }`}
                />
                {touched.phone && errors.phone && (
                  <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                    {errors.phone}
                  </Text>
                )}
              </View>
              {/* message field */}
              <View className="rsmarginTop-h-2">
                <Text className="text-cblue font-bold  rsfontSize-f-2 rspadding-w-1.5">
                  Your Message
                </Text>
                <TextInput
                  placeholder="Message"
                  maxLength={500}
                  placeholderTextColor={
                    touched.message && errors.message
                      ? Colors.cred
                      : Colors.cinputCol
                  }
                  onChangeText={handleChange('message')}
                  onBlur={() => setFieldTouched('message')}
                  // numberOfLines={8}
                  // multiline={true}
                  className={`bg-white rsborderRadius-w-15 rsheight-h-12 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                    touched.message &&
                    errors.message &&
                    'rsborderWidth-w-0.3 border-cred'
                  }`}
                />
                {touched.message && errors.message && (
                  <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-2.5 rspaddingTop-h-0.5">
                    {errors.message}
                  </Text>
                )}
              </View>
              {/* submit  button */}
              <View className="rspaddingTop-h-3">
                {!loading ? (
                  <TouchableOpacity
                    className="bg-cblue rounded-full rspadding-w-3.5"
                    onPress={() => handleSubmit()}>
                    <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                      Send Message
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Pressable
                    className="bg-catColor rounded-full rspadding-w-3.5"
                    disabled={true}>
                    <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                      Sending ....
                    </Text>
                  </Pressable>
                )}
              </View>
            </FormikProvider>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
