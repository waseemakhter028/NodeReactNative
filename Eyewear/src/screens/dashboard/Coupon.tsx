import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import Colors from '../../constants/Colors';
import {useContext} from '../../context/ToastContext';
import {rand} from '../../helpers/common';
import {fp, hp, wp} from '../../helpers/responsive';
import useAxios from '../../hooks/useAxios';
import {Text, TextPrice, View} from '../../storybook';
import {CouponCardProps, CouponProps} from '../../types';

const CouponCard = ({item}: CouponCardProps) => {
  return (
    <View className="bg-cinputBg rsmarginTop-h-2 rsheight-h-17 rspaddingVertical-h-3 rsborderRadius-w-3">
      <View className="flex-row rsgap-w-5">
        <View className="rsheight-h-5 rswidth-w-15 items-center justify-center opacity-4">
          <MaterialIcons
            name="discount"
            size={fp(4)}
            color={Colors.lightgreen}
          />
        </View>
        <View className="rswidth-w-40 flex-row justify-between rsgap-w-20">
          <Text className="rsfontSize-f-2 font-bold text-cblue">
            {item.title}
          </Text>
          <TextPrice className="rsfontSize-f-2 rsfontWeight-600 text-productTitle">
            {item.amount}
          </TextPrice>
        </View>
        <View className="rsposition-absolute  rsmarginTop-h-4 rsmarginLeft-w-19.5 flex-row">
          <Text className="text-cprimaryDark rsfontSize-f-1.8 rsfontWeight-600">
            Coupon Code:{' '}
            <Text className="text-lightgreen rsfontSize-f-1.8 rsfontWeight-600">
              {item.code}
            </Text>
          </Text>
        </View>
        <View className="rsposition-absolute  rsmarginTop-h-9 rsmarginLeft-w-50 flex-row">
          <Text className="text-cblue rsfontSize-f-1.8 rsfontWeight-600">
            Validity:{' '}
            <Text className="text-cprimaryDark rsfontSize-f-1.8 rsfontWeight-600">
              {item.validity}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const CouponScreen = () => {
  const {Toast} = useContext();
  const {axiosCall} = useAxios();
  const [loading, setLoading] = useState<boolean>(true);
  const [coupons, setCoupons] = useState<CouponProps[]>([]);

  const fetchCoupons = async () => {
    const {data, error} = await axiosCall('/coupons');

    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
    } else if (!error) {
      if (res.success === true) {
        setCoupons(res.data);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header isFromDrawer={true} />
      </View>
      <View className="rsmarginTop-h-2.5">
        <Text className="rsfontSize-f-3 text-productTitle">
          Available Coupons
        </Text>

        <FlatList
          numColumns={1}
          ListFooterComponent={
            <React.Fragment>{loading && <Loader />}</React.Fragment>
          }
          ListEmptyComponent={
            <React.Fragment>{loading ? <Loader /> : <NoData />}</React.Fragment>
          }
          data={coupons}
          renderItem={({item}) => <CouponCard item={item} />}
          keyExtractor={() => rand().toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: hp(21),
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default CouponScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
