import React, {useState} from 'react';
import {FlatList, Modal} from 'react-native';

import Loader from './Loader';
import {useContext} from '../context/ToastContext';
import {getFromAsyncStorage, rand} from '../helpers/common';
import {hp, wp} from '../helpers/responsive';
import useAxios from '../hooks/useAxios';
import {Text, TextPrice, TouchableOpacity, View} from '../storybook';
import {CouponModalCardProps, CouponModalProps} from '../types';

const Card = ({
  applyCoupon,
  item,
  appliedCoupon,
  selectedCoupon,
}: CouponModalCardProps) => {
  return (
    <View className="rsmarginTop-h-2">
      <View className="flex-row items-center rsgap-w-5">
        {item.validity === 'Expired' ? (
          <TouchableOpacity className="bg-cinputCol rswidth-w-23 rspadding-w-1 rounded-full items-center">
            <Text className="text-center rsfontSize-f-2 font-bold text-white">
              Expired
            </Text>
          </TouchableOpacity>
        ) : (
          <React.Fragment>
            {appliedCoupon.coupon !== '' && appliedCoupon.amount > 0 ? (
              <TouchableOpacity
                className="bg-cblue rswidth-w-23 rspadding-w-1 rounded-full items-center"
                onPress={() => selectedCoupon('', 0)}>
                <Text className="text-center rsfontSize-f-2 font-bold text-white">
                  Remove
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-cprimaryDark rswidth-w-23 rspadding-w-1 rounded-full items-center"
                onPress={() => applyCoupon(item.code, item.amount)}>
                <Text className="text-center rsfontSize-f-2 font-bold text-white">
                  Apply
                </Text>
              </TouchableOpacity>
            )}
          </React.Fragment>
        )}
        <View>
          <Text className="rsfontSize-f-2 text-cblue">{item.title}</Text>
          <Text className="rsfontSize-f-1.8 text-cblue">
            Coupon Code:
            <Text className="rsfontSize-f-1.8 text-lightgreen">
              {' '}
              {item.code}
            </Text>
          </Text>
          <View className="flex-row justify-between rsmarginTop-h-0.5">
            <TextPrice className="rsfontSize-f-1.6 text-toastInfo rsmarginRight-w-10 rsflexWrap-wrap">
              {item.amount}
            </TextPrice>
            <Text className="rsfontSize-f-1.6 text-cblue">
              Validity:{' '}
              <Text className="rsfontSize-f-1.6 text-lightgreen">
                {item.validity}
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <View className="bg-catBgColor rsheight-h-0.1 rswidth-w-90 rsmarginTop-h-2" />
    </View>
  );
};

const CheckoutCouponModal = ({
  modalOpen,
  setModalOpen,
  selectedCoupon,
  appliedCoupon,
  coupons,
}: CouponModalProps) => {
  const {Toast} = useContext();
  const {axiosCall} = useAxios();
  const [loading, setLoading] = useState<boolean>(false);

  const applyCoupon = async (coupon_code: string, amount: number) => {
    setLoading(true);
    const user = JSON.parse(await getFromAsyncStorage('user'));
    const {data, error} = await axiosCall('/applycoupon', {
      method: 'post',
      data: {
        coupon_code: coupon_code,
        user_id: user.id,
      },
    });
    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
      selectedCoupon('', 0);
    } else if (!error) {
      if (res.success === true) {
        selectedCoupon(coupon_code, amount);
        Toast('success', 'Success !', 'Coupon applied successfully !');
      } else {
        selectedCoupon('', 0);
        Toast('danger', 'Error !', res.message);
      }
    }
    setLoading(false);
  };

  return (
    <View className="rspaddingVertical-h-2 rsborderRadius-w-5">
      <Modal visible={modalOpen} transparent style={{borderRadius: wp(5)}}>
        <View className="flex-1 justify-center items-center">
          <View className="rswidth-w-90 bg-border rspadding-w-4.5 rsborderRadius-w-5">
            {loading ? (
              <Loader />
            ) : (
              <React.Fragment>
                <View className="flex-row justify-between">
                  <Text className="rsfontSize-f-2.5 text-cblue text-center rspaddingTop-h-2">
                    Apply Coupon
                  </Text>
                  <TouchableOpacity
                    className=""
                    onPress={() => setModalOpen(false)}>
                    <Text className="rsfontSize-f-2.5 text-cred text-center rspaddingTop-h-2">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  numColumns={1}
                  data={coupons}
                  renderItem={({item}) => (
                    <Card
                      item={item}
                      applyCoupon={applyCoupon}
                      selectedCoupon={selectedCoupon}
                      appliedCoupon={appliedCoupon}
                    />
                  )}
                  keyExtractor={() => rand().toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: hp(5),
                  }}
                />
              </React.Fragment>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckoutCouponModal;
