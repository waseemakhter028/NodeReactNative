import React, {useState} from 'react';
import {Modal} from 'react-native';

import {FormikProps, FormikProvider, useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';
import {useContext} from '../../context/ToastContext';
import {getFromAsyncStorage} from '../../helpers/common';
import {fp} from '../../helpers/responsive';
import useAxios from '../../hooks/useAxios';
import {
  ButtonWithLoader,
  Pressable,
  Text,
  TextInput,
  View,
} from '../../storybook';
import {AddAddressCompProps, AddAddressProps} from '../../types';
import {addressSchema} from '../../validation';

const AddAddress = ({
  modalOpen,
  setModalOpen,
  selectedAddress,
  handleCheckout,
}: AddAddressCompProps) => {
  const {Toast} = useContext();
  const {axiosCall} = useAxios();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      address_type: selectedAddress?.address_type ?? '',
      street: selectedAddress?.street ?? '',
      address: selectedAddress?.address ?? '',
      landmark: selectedAddress?.landmark ?? '',
      city: selectedAddress?.city ?? '',
      state: selectedAddress?.state ?? '',
      zipcode: selectedAddress?.zipcode ?? '',
    },
    validationSchema: addressSchema,
    onSubmit: values => hanldeAddress(values),
  });
  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldTouched,
  }: FormikProps<AddAddressProps> = formik;

  const hanldeAddress = async (values: AddAddressProps) => {
    setLoading(true);
    const user = JSON.parse(await getFromAsyncStorage('user'));
    values.zipcode = +values.zipcode;
    values = {...values, ...{user_id: user.id}};

    let info;
    let err;
    if (!selectedAddress) {
      const {data, error} = await axiosCall('/address/add', {
        data: values,
        method: 'post',
      });
      info = data;
      err = error;
    } else {
      const {data, error} = await axiosCall('/address/' + selectedAddress._id, {
        data: values,
        method: 'put',
      });
      info = data;
      err = error;
    }
    const res = info;
    if (err) {
      Toast('warning', 'Warning !', err.message);
    } else if (!err) {
      if (res.success === true) {
        resetForm();
        if (!selectedAddress) {
          Toast('success', 'Success !', 'Address Saved Successfully !', 2000);
        } else {
          Toast('success', 'Success !', 'Address Upated Successfully !', 2000);
        }
        if (handleCheckout !== undefined) {
          handleCheckout(res.data);
        }
        setModalOpen(false);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    }
    setLoading(false);
  };
  return (
    <View className="flex-1 rsheight-h-100 rswidth-w-100 rsbackgroundColor-black">
      <Modal visible={modalOpen} transparent>
        <View className="flex-1 justify-center items-center">
          <View className="rswidth-w-90 bg-ringTwo rspadding-w-4.5 rsborderRadius-w-5">
            <View className="flex-row justify-between">
              <Text className="rsfontSize-f-3 text-botLinearTwo">
                {selectedAddress ? 'Edit Address' : 'Add Address'}
              </Text>
              <Pressable onPress={() => setModalOpen(false)}>
                <AntDesign
                  name="closecircleo"
                  size={fp(3)}
                  color={Colors.botLinearTwo}
                />
              </Pressable>
            </View>
            <FormikProvider value={formik}>
              <KeyboardAwareScrollView>
                {/* Form container */}
                <View className="rspaddingTop-h-1">
                  <TextInput
                    placeholder="Enter Address Type"
                    maxLength={20}
                    placeholderTextColor={
                      touched.address_type && errors.address_type
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                    defaultValue={selectedAddress?.address_type ?? ''}
                    onChangeText={handleChange('address_type')}
                    onBlur={() => setFieldTouched('address_type')}
                    autoCapitalize="none"
                    className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.address_type &&
                      errors.address_type &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                  {touched.address_type && errors.address_type && (
                    <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                      {errors.address_type}
                    </Text>
                  )}
                </View>

                <View className="rspaddingTop-h-2">
                  <TextInput
                    placeholder="Enter Address"
                    maxLength={50}
                    placeholderTextColor={
                      touched.address && errors.address
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                    defaultValue={selectedAddress?.address ?? ''}
                    onChangeText={handleChange('address')}
                    onBlur={() => setFieldTouched('address')}
                    autoCapitalize="none"
                    className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.address &&
                      errors.address &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                  {touched.address && errors.address && (
                    <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                      {errors.address}
                    </Text>
                  )}
                </View>

                <View className="rspaddingTop-h-2">
                  <TextInput
                    placeholder="Enter Street Name"
                    maxLength={20}
                    placeholderTextColor={
                      touched.street && errors.street
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                    defaultValue={selectedAddress?.street ?? ''}
                    onChangeText={handleChange('street')}
                    onBlur={() => setFieldTouched('street')}
                    autoCapitalize="none"
                    className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.street &&
                      errors.street &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                  {touched.street && errors.street && (
                    <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                      {errors.street}
                    </Text>
                  )}
                </View>

                <View className="rspaddingTop-h-2">
                  <TextInput
                    placeholder="Enter Landmark"
                    maxLength={40}
                    placeholderTextColor={
                      touched.landmark && errors.landmark
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                    defaultValue={selectedAddress?.landmark ?? ''}
                    onChangeText={handleChange('landmark')}
                    onBlur={() => setFieldTouched('landmark')}
                    autoCapitalize="none"
                    className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.landmark &&
                      errors.landmark &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                  {touched.landmark && errors.landmark && (
                    <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                      {errors.landmark}
                    </Text>
                  )}
                </View>

                <View className="rspaddingTop-h-2">
                  <TextInput
                    placeholder="Enter City Name"
                    maxLength={20}
                    placeholderTextColor={
                      touched.city && errors.city
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                    defaultValue={selectedAddress?.city ?? ''}
                    onChangeText={handleChange('city')}
                    onBlur={() => setFieldTouched('city')}
                    autoCapitalize="none"
                    className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.city &&
                      errors.city &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                  {touched.city && errors.city && (
                    <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                      {errors.city}
                    </Text>
                  )}
                </View>

                <View className="rspaddingTop-h-2">
                  <TextInput
                    placeholder="Enter State Name"
                    maxLength={20}
                    placeholderTextColor={
                      touched.state && errors.state
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                    defaultValue={selectedAddress?.state ?? ''}
                    onChangeText={handleChange('state')}
                    onBlur={() => setFieldTouched('state')}
                    autoCapitalize="none"
                    className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.state &&
                      errors.state &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                  {touched.state && errors.state && (
                    <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                      {errors.state}
                    </Text>
                  )}
                </View>

                <View className="rspaddingTop-h-2">
                  <TextInput
                    placeholder="Enter Zipcode"
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholderTextColor={
                      touched.zipcode && errors.zipcode
                        ? Colors.cred
                        : Colors.cinputCol
                    }
                    defaultValue={selectedAddress?.zipcode.toString() ?? ''}
                    onChangeText={handleChange('zipcode')}
                    onBlur={() => setFieldTouched('zipcode')}
                    autoCapitalize="none"
                    className={`bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cinputCol ${
                      touched.zipcode &&
                      errors.zipcode &&
                      'rsborderWidth-w-0.3 border-cred'
                    }`}
                  />
                  {touched.zipcode && errors.zipcode && (
                    <Text className="text-cred rsfontSize-f-1.5 rspaddingLeft-w-1.5 rspaddingTop-h-0.5">
                      {errors.zipcode}
                    </Text>
                  )}
                </View>
              </KeyboardAwareScrollView>
              <View className="rspaddingTop-h-2">
                <ButtonWithLoader
                  loading={loading}
                  className="bg-cprimaryDark rounded-full rspadding-w-3.5"
                  onPress={handleSubmit}>
                  <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                    Submit
                  </Text>
                </ButtonWithLoader>
              </View>
            </FormikProvider>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddAddress;
