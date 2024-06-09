import React from 'react';
import {FlatList, Modal} from 'react-native';

import {rand} from '../helpers/common';
import {hp, wp} from '../helpers/responsive';
import {Text, TouchableOpacity, View} from '../storybook';
import {AddressModalCardProps, AddressModalProps} from '../types';

const Card = ({selectedAddress, item}: AddressModalCardProps) => {
  return (
    <View className="rsmarginTop-h-2">
      <View className="flex-row items-center rsgap-w-5">
        <TouchableOpacity
          className="bg-cprimaryDark rswidth-w-23 rspadding-w-1 rounded-full"
          onPress={() => selectedAddress(item.address_type, item.id)}>
          <Text className="text-center rsfontSize-f-2 font-bold text-white">
            Select
          </Text>
        </TouchableOpacity>
        <View>
          <Text className="rsfontSize-f-2 text-cblue">{item.address_type}</Text>
          <Text className="rsfontSize-f-1.6 text-productTitle rsmarginRight-w-10 rsflexWrap-wrap">
            {item.street}, {item.address}, {item.landmark},
          </Text>
          <Text className="rsfontSize-f-1.6 text-productTitle rsmarginRight-w-10 rsflexWrap-wrap">
            {item.city}, {item.state}, {item.zipcode}, {item.country}
          </Text>
        </View>
      </View>
      <View className="bg-catBgColor rsheight-h-0.1 rswidth-w-90 rsmarginTop-h-2" />
    </View>
  );
};

const CheckoutAddressModal = ({
  modalOpen,
  selectedAddress,
  address,
}: AddressModalProps) => {
  return (
    <View className="rspaddingVertical-h-2 rsborderRadius-w-5">
      <Modal visible={modalOpen} transparent style={{borderRadius: wp(5)}}>
        <View className="flex-1 justify-center items-center">
          <View className="rswidth-w-90 bg-border rspadding-w-4.5 rsborderRadius-w-5">
            <Text className="rsfontSize-f-2.5 text-cblue text-center rspaddingTop-h-2">
              Select Delivery Address
            </Text>
            <FlatList
              numColumns={1}
              data={address}
              renderItem={({item}) => (
                <Card selectedAddress={selectedAddress} item={item} />
              )}
              keyExtractor={() => rand().toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: hp(5),
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckoutAddressModal;
