import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AddAddress from './dashboard/AddAddress';
import CheckoutAddressModal from '../components/CheckoutAddressModal';
import CheckoutCouponModal from '../components/CheckoutCouponModal';
import Header from '../components/Header';
import Loader from '../components/Loader';
import NoData from '../components/NoData';
import NotesModal from '../components/NotesModal';
import Colors from '../constants/Colors';
import {useContext as useAppContext} from '../context/AppContext';
import {useContext} from '../context/ToastContext';
import {getFromAsyncStorage, rand} from '../helpers/common';
import {fp, hp, wp} from '../helpers/responsive';
import useAxios from '../hooks/useAxios';
import {
  ButtonWithLoader,
  Pressable,
  Text,
  TextPrice,
  TouchableOpacity,
  View,
} from '../storybook';
import {
  AddressProps,
  CartProps,
  CouponProps,
  NavigationProps,
  ProductItemProps,
  SelectedAddressProps,
  SelectedCouponProps,
  UserProps,
} from '../types';

const ProductListItem = ({item}: ProductItemProps) => {
  return (
    <View className="flex-row justify-between rspaddingHorizontal-w-2 rsmarginTop-h-2">
      <View className="flex-row rswidth-w-50 justify-between">
        <Text className="text-cartText rsfontSize-f-2">{item.name}</Text>
        <View className="flex-row justify-between rsgap-w-5">
          <Text className="text-cartText rsfontSize-f-2">x{item.quantity}</Text>
          <Text className="text-cartText rsfontSize-f-2">{item.price}</Text>
        </View>
      </View>
      <View>
        <TextPrice className="text-cartText rsfontSize-f-2">
          {item.quantity * item.price}
        </TextPrice>
      </View>
    </View>
  );
};
const Checkout = () => {
  const {Toast} = useContext();
  const {setIsCheckout} = useAppContext();
  const navigation: NavigationProps = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [orderPlaceLoader, setOrderPlaceLoader] = useState<boolean>(false);
  const {axiosCall} = useAxios();
  const [cart, setCart] = useState<CartProps[]>([]);
  const [addressData, setAddressData] = useState<AddressProps[]>([]);
  const [coupons, setCoupons] = useState<CouponProps[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [openAddressModal, setOpenAddressModal] = useState<boolean>(false);
  const [openSaveAddressModal, setOpenSaveAddressModal] =
    useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddressProps>({
    id: '',
    type: '',
  });
  const [openCouponModal, setOpenCouponModal] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<SelectedCouponProps>({
    coupon: '',
    amount: 0,
  });
  const [notesOpenModal, setNotesOpenModal] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const handleSaveAddress = async (addressInfo: AddressProps[]) => {
    setAddressData(addressInfo);
    setSelectedAddress({
      id: addressInfo[0].id,
      type: addressInfo[0].address_type,
    });
    setOpenSaveAddressModal(false);
  };

  const getCheckoutInfo = useCallback(async () => {
    const user = JSON.parse(await getFromAsyncStorage('user'));
    const {data, error} = await axiosCall(
      '/getcheckoutinfo?user_id=' + user.id,
    );
    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
    } else if (!error) {
      if (res.success === true) {
        setCart(res.data.cart);
        setCoupons(res.data.coupon);
        setDeliveryCharge(res.data.delivery_charge);
        setAddressData(res.data.address);
        if (res.data.cart.length > 0) {
          const sumTotal = res.data.cart.reduce(function (
            accumulator: any,
            item: CartProps,
          ) {
            return accumulator + item.quantity * item.price;
          },
          0);
          setTotal(sumTotal);
        }
      } else {
        Toast('danger', 'Error !', res.message);
      }
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedAddress = (address_type: string, addressId: string) => {
    setSelectedAddress({
      id: addressId,
      type: address_type,
    });
    setOpenAddressModal(false);
  };

  const handleSelectedCoupon = (coupon_code: string, amt: number) => {
    setSelectedCoupon({
      coupon: coupon_code,
      amount: amt,
    });
    setOpenCouponModal(false);
  };

  useEffect(() => {
    getCheckoutInfo();
    return () => setIsCheckout(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processRazorpayPayment = (user: UserProps) => {
    const grandTotal =
      Number(total) + Number(deliveryCharge) - Number(selectedCoupon.amount);
    const addressInfo = addressData.find(
      (item: AddressProps) => item.id === selectedAddress.id,
    );
    const description = `Order placed with user id ${user.id} Address: ${addressInfo?.street}, ${addressInfo?.address}, ${addressInfo?.city}, ${addressInfo?.state}, ${addressInfo?.zipcode}`;

    const options: any = {
      description: description,
      image: 'https://node-eyewear.vercel.app/products/applogo.png',
      currency: 'INR',
      key: process.env.RAZORPAY_API_KEY_ID ?? '',
      amount: grandTotal * 100,
      name: 'Eyewear',
      prefill: {
        email: user.email,
        contact: '',
        name: user.name,
      },
      theme: {color: Colors.razorPayTheme},
    };
    RazorpayCheckout.open(options)
      .then(async (paymentInfo: any) => {
        setOrderPlaceLoader(true);
        const orderData = {
          user_id: user.id,
          address_id: selectedAddress.id,
          notes: notes === '' ? 'No Notes' : notes,
          coupon_code: selectedCoupon.coupon,
          payment_method: 'razorpay',
          paymentId: paymentInfo.razorpay_payment_id,
        };
        const {data, error} = await axiosCall('/placeorder', {
          method: 'post',
          data: orderData,
        });
        const res = data;
        if (error) {
          Toast('warning', 'Warning !', error.message);
        } else if (!error) {
          if (res.success === true) {
            Toast('success', 'Success !', 'Order Placed successfully !');
            navigation.navigate('OrderTab');
          } else {
            Toast('danger', 'Error !', res.message);
          }
        }
        setOrderPlaceLoader(false);
      })
      .catch((error: any) => {
        setOrderPlaceLoader(false);
        Toast('danger', 'Error !', error.description);
      });
  };

  const placeOrder = async () => {
    if (selectedAddress.id === '' || selectedAddress.type === '') {
      Toast('danger', 'Error !', 'Please select address / add new address');
      return false;
    }

    const user = JSON.parse(await getFromAsyncStorage('user'));
    const grandTotal = Number(total) + Number(deliveryCharge);

    if (grandTotal < 50) {
      Toast('danger', 'Error !', 'Order amount should be greater than 50');
      return false;
    }

    setOrderPlaceLoader(true);

    if (grandTotal >= 50 && grandTotal > selectedCoupon.amount) {
      processRazorpayPayment(user);
    } else {
      const orderData = {
        user_id: user.id,
        address_id: selectedAddress.id,
        notes: notes === '' ? 'No Notes' : notes,
        coupon_code: selectedCoupon.coupon,
        payment_method: 'coupon',
      };
      const {data, error} = await axiosCall('/placeorder', {
        method: 'post',
        data: orderData,
      });
      const res = data;
      if (error) {
        Toast('warning', 'Warning !', error.message);
      } else if (!error) {
        if (res.success === true) {
          Toast('success', 'Success !', 'Order Placed successfully !');
          navigation.navigate('OrderTab');
        } else {
          Toast('danger', 'Error !', res.message);
        }
      }
    }
    setOrderPlaceLoader(false);
  };

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      <View>
        <Header isBack={true} />
      </View>

      <View className="rsmarginTop-h-4">
        <View className="rsheight-h-70">
          <Text className="rsfontSize-f-2.5 text-productTitle">Your Order</Text>
          <View
            className={`rsborderWidth-h-0.1 rsborderColor-${Colors.cinputCol} rsmarginVertical-h-1.18`}
          />
          <View className="flex-row justify-between rspaddingHorizontal-w-2">
            <Text className="rsfontSize-f-2 text-productTitle">Products</Text>
            <Text className="rsfontSize-f-2 text-productTitle">Total</Text>
          </View>
          {/* Products list */}
          <FlatList
            numColumns={1}
            ListFooterComponent={
              <React.Fragment>{loading && <Loader />}</React.Fragment>
            }
            ListEmptyComponent={
              <React.Fragment>
                {loading ? <Loader /> : <NoData />}
              </React.Fragment>
            }
            data={cart}
            renderItem={({item}) => <ProductListItem item={item} />}
            keyExtractor={() => rand().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                selectedCoupon.coupon !== '' && selectedCoupon.amount > 0
                  ? hp(1.5)
                  : hp(9.5),
            }}
          />
          {/* Price Container */}
          <View className="rsmarginTop-h-0.5">
            <View className="flex-row justify-between rsmarginHorizontal-w-1.9 rsmarginVertical-h-1.18">
              <Text className="text-cartText rsfontSize-f-2.2">Total:</Text>
              <TextPrice className="text-cartText rsfontSize-f-2.2">
                {total}
              </TextPrice>
            </View>
          </View>
          {/* coupon applied */}
          {coupons.length > 0 &&
            selectedCoupon.coupon !== '' &&
            selectedCoupon.amount > 0 && (
              <React.Fragment>
                <View
                  className={`rsborderWidth-h-0.1 rsborderColor-${Colors.cinputCol} rsmarginVertical-h-1.18`}
                />
                <View className="">
                  <View className="flex-row justify-between rsmarginHorizontal-w-1.9 rsmarginVertical-h-1.18">
                    <Text className="text-cartText rsfontSize-f-2.2">
                      Coupon Applied:
                    </Text>

                    <View className="flex-row">
                      <Text className="text-cartText rsfontSize-f-2.2">-</Text>
                      <TextPrice className="text-cartText rsfontSize-f-2.2">
                        {selectedCoupon.amount}
                      </TextPrice>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            )}
          {/* delivery charge */}
          <View
            className={`rsborderWidth-h-0.1 rsborderColor-${Colors.cinputCol} rsmarginVertical-h-1.18`}
          />
          <View className="">
            <View className="flex-row justify-between rsmarginHorizontal-w-1.9 rsmarginVertical-h-1.18">
              <Text className="text-cartText rsfontSize-f-2.2">
                Delivery Charge:
              </Text>
              <TextPrice className="text-cartText rsfontSize-f-2.2">
                {deliveryCharge}
              </TextPrice>
            </View>
          </View>
          <View
            className={`rsborderWidth-h-0.1 rsborderColor-${Colors.cinputCol} rsmarginVertical-h-1.18`}
          />
          <View className="flex-row justify-between rsmarginHorizontal-w-1.9 rsmarginVertical-h-1">
            <Text className="text-cartText rsfontSize-f-2.2">Grand Total:</Text>
            <TextPrice className="text-productTitle rsfontSize-f-2.2 rsfontWeight-700">
              {Number(total) +
                Number(deliveryCharge) -
                Number(selectedCoupon.amount) >
              0
                ? Number(total) +
                  Number(deliveryCharge) -
                  Number(selectedCoupon.amount)
                : 0}
            </TextPrice>
          </View>
          <View
            className={`rsborderWidth-h-0.1 rsborderColor-${Colors.cinputCol} rsmarginVertical-h-1.18`}
          />
          {/* select address */}
          {addressData.length > 0 ? (
            <React.Fragment>
              <TouchableOpacity
                className="bg-border rounded-full rsheight-h-6 rsmarginVertical-h-1 rspaddingHorizontal-w-6 flex-row justify-between items-center"
                onPress={() => setOpenAddressModal(true)}>
                <Text className="rsfontSize-f-2 text-cblue">
                  {!selectedAddress.type
                    ? 'Select Address'
                    : selectedAddress.type}
                </Text>
                <Fontisto name="angle-down" size={fp(2)} color={Colors.cblue} />
              </TouchableOpacity>

              {openAddressModal && (
                <CheckoutAddressModal
                  modalOpen={openAddressModal}
                  selectedAddress={handleSelectedAddress}
                  address={addressData}
                />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TouchableOpacity
                className="bg-cblue rsmarginVertical-h-1 rswidth-w-35 rsheight-h-4.5 rounded-full items-center justify-center"
                onPress={() => setOpenSaveAddressModal(true)}>
                <Text className="text-center rsfontSize-f-2 font-bold text-white">
                  Add Address
                </Text>
              </TouchableOpacity>

              {openSaveAddressModal && (
                <AddAddress
                  modalOpen={openSaveAddressModal}
                  setModalOpen={setOpenSaveAddressModal}
                  selectedAddress={undefined}
                  handleCheckout={handleSaveAddress}
                />
              )}
            </React.Fragment>
          )}

          {/* Apply Discount */}
          {coupons.length > 0 && (
            <React.Fragment>
              <View className="rspaddingHorizontal-w-2">
                <Pressable
                  className="rspaddingTop-h-1"
                  onPress={() => setOpenCouponModal(true)}>
                  <Text className="rsfontSize-f-2 text-cblue">
                    Apply Discount
                  </Text>
                </Pressable>
                {selectedCoupon.coupon !== '' && selectedCoupon.amount > 0 && (
                  <View className="flex-row rsgap-w-3">
                    <Text className="rsfontSize-f-1.5 text-lightgreen">
                      You have got ₹{selectedCoupon.amount} off
                    </Text>
                    <Pressable
                      onPress={() =>
                        setSelectedCoupon({coupon: '', amount: 0})
                      }>
                      <MaterialIcons
                        name="highlight-remove"
                        size={fp(2)}
                        color={Colors.lightgreen}
                      />
                    </Pressable>
                  </View>
                )}
              </View>

              {openCouponModal && (
                <CheckoutCouponModal
                  modalOpen={openCouponModal}
                  setModalOpen={setOpenCouponModal}
                  selectedCoupon={handleSelectedCoupon}
                  appliedCoupon={selectedCoupon}
                  coupons={coupons}
                />
              )}
            </React.Fragment>
          )}

          {/* Add Notes */}
          <Pressable
            className="rspaddingTop-h-1 rspaddingHorizontal-w-2"
            onPress={() => setNotesOpenModal(true)}>
            <Text className="rsfontSize-f-2 text-cblue">
              Add Notes {notes !== '' ? ': ' + notes : ''}
            </Text>
          </Pressable>
          {notesOpenModal && (
            <NotesModal
              modalOpen={notesOpenModal}
              setModalOpen={setNotesOpenModal}
              notes={notes}
              setNotes={setNotes}
              Toast={Toast}
            />
          )}
        </View>

        {/* place order button*/}
        <View className="rspaddingTop-h-2 justify-end rsheight-h-9.5">
          <ButtonWithLoader
            loading={orderPlaceLoader}
            className="bg-cprimaryDark rspadding-w-3 rsborderRadius-w-3"
            onPress={placeOrder}>
            <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
              Place Order
            </Text>
          </ButtonWithLoader>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp(2.15),
    paddingHorizontal: wp(4),
  },
});
