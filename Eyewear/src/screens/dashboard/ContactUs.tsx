import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import {FormikProvider, useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {wp} from '../../helpers/responsive';
import {ButtonWithLoader, Text, TextInput, View} from '../../storybook';
import {ContactUsProps} from '../../types';
import {contactSchema} from '../../validation';

const ContactUsScreen = () => {
  const {user} = useAppContext();
  const {Toast} = useContext();
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      name: '',
      email: user.email,
      phone: '',
      message: '',
    },
    validationSchema: contactSchema,
    onSubmit: formValues => sendQuery(formValues),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
    values,
  } = formik;

  const sendQuery = async (formValues: ContactUsProps) => {
    setLoading(true);
    try {
      const info = await axios.post('/contact', formValues);
      const res = info.data;
      if (res.success === true) {
        resetForm();
        Toast(
          'success',
          'Success !',
          'Query Sent To Admin Successfully !',
          3000,
        );
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
                  value={values.name}
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
              <View className="rsmarginTop-h-2">
                <Text className="text-cblue font-bold rsfontSize-f-2 rspadding-w-1.5">
                  Your Email
                </Text>
                <TextInput
                  placeholder="Email"
                  maxLength={50}
                  value={user.email}
                  disabled={true}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholderTextColor={Colors.white}
                  autoCapitalize="none"
                  className={`bg-placeholder rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-white ${
                    touched.email &&
                    errors.email &&
                    'rsborderWidth-w-0.3 border-cred'
                  }`}
                />
              </View>
              {/* phone field */}
              <View className="rsmarginTop-h-2">
                <Text className="text-cblue font-bold rsfontSize-f-2 rspadding-w-1.5">
                  Your Phone Number
                </Text>
                <TextInput
                  placeholder="Phone Number"
                  maxLength={10}
                  value={values.phone}
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
                  value={values.message}
                  placeholderTextColor={
                    touched.message && errors.message
                      ? Colors.cred
                      : Colors.cinputCol
                  }
                  onChangeText={handleChange('message')}
                  onBlur={() => setFieldTouched('message')}
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
                <ButtonWithLoader
                  loading={loading}
                  className="bg-cblue rounded-full rspadding-w-3.5"
                  onPress={() => handleSubmit()}>
                  <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                    Send Message
                  </Text>
                </ButtonWithLoader>
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
