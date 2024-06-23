import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import CartCard from '../../components/CartCard';
import DeleteModal from '../../components/DeleteModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import {getFromAsyncStorage, saveToAsyncStorage} from '../../helpers/common';
import {hp, wp} from '../../helpers/responsive';
import useAxios from '../../hooks/useAxios';
import {Image, Text, TextPrice, TouchableOpacity, View} from '../../storybook';
import {CartItemsProps, NavigationProps} from '../../types';

const CartScreen = () => {
  const {t} = useTranslation();
  const {Toast} = useContext();
  const {setCartCount, setIsCheckout, setCurrentRoute} = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItemsProps[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [deleteCartId, setDeleteCartId] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const navigation: NavigationProps = useNavigation();
  const {axiosCall} = useAxios();

  const reomveCartItem = async () => {
    setLoading(true);

    const {data, error} = await axiosCall('/carts/' + deleteCartId, {
      method: 'delete',
    });
    const res = data;
    if (error) {
      Toast('warning', t('common.warning'), error.message);
    } else if (!error) {
      if (res.success === true) {
        Toast('success', t('common.success'), t('cart.res.removed'), 2000);
        setDeleteCartId('');
        setDeleteModal(false);
        fetchUserCart();
      } else {
        Toast('danger', t('common.error'), res.message);
      }
    }
  };

  const handleDeleteItem = async (cartId: string) => {
    setDeleteCartId(cartId);
    setDeleteModal(true);
  };

  const updateCartItem = async (cartId: string, qty: number) => {
    const {data, error} = await axiosCall('/carts/' + cartId, {
      data: {quantity: qty},
      method: 'put',
    });
    const res = data;
    if (error) {
      Toast('warning', t('common.warning'), error.message);
    } else if (!error) {
      if (res.success === true) {
        Toast('success', t('common.success'), t('cart.res.updated'), 2000);
        setLoading(true);
        fetchUserCart();
      } else {
        Toast('danger', t('common.error'), res.message);
      }
    }
  };

  const fetchUserCart = useCallback(async () => {
    const user = JSON.parse(await getFromAsyncStorage('user'));
    const {data, error} = await axiosCall('/carts?user_id=' + user.id);
    const res = data;
    if (error) {
      Toast('warning', t('common.warning'), error.message);
    } else if (!error) {
      if (res.success === true) {
        await saveToAsyncStorage({
          cartCount: JSON.stringify(res.data.length),
        });
        setCartCount(res.data.length || 0);
        setCartItems(res.data);
        if (res.data.length > 0) {
          let sumSubTotal = res.data.reduce(function (
            accumulator: any,
            item: CartItemsProps,
          ) {
            return accumulator + item.quantity * item.product_id.price;
          },
          0);
          setSubtotal(sumSubTotal);
        }
      } else {
        Toast('danger', t('common.error'), res.message);
      }
    }
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Toast]);

  useEffect(() => {
    fetchUserCart();
    return () => setCurrentRoute('CartTab');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUserCart]);

  if (loading) {
    return <Loader />;
  }

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      <View>
        <Header isBack={true} />
      </View>
      {cartItems.length > 0 ? (
        <React.Fragment>
          {deleteModal && (
            <DeleteModal
              modalOpen={deleteModal}
              setModalOpen={setDeleteModal}
              handleDelete={reomveCartItem}
              message={t('cart.res.deleted')}
            />
          )}
          <FlatList
            data={cartItems}
            renderItem={({item}) => (
              <CartCard
                item={item}
                handleDelete={handleDeleteItem}
                handleUpdate={updateCartItem}
                Toast={Toast}
              />
            )}
            keyExtractor={(item: CartItemsProps) => item?.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{marginTop: hp(4.7), paddingBottom: hp(10)}}
          />
          {/* Price Container */}

          <View className="rsmarginTop-h-5.71 rsmarginBottom-h-2">
            <View
              className={`rsborderWidth-h-0.1 rsborderColor-${Colors.cinputCol} rsmarginVertical-h-1.18`}
            />
            <View className="flex-row justify-between rsmarginHorizontal-w-4.9 rsmarginVertical-h-1.18">
              <Text className="text-productTitle rsfontSize-f-2.2">
                {t('cart.label.total')}:
              </Text>
              <TextPrice className="text-cartText rsfontSize-f-2.2">
                {subtotal}
              </TextPrice>
            </View>
          </View>

          {/* button container */}
          <TouchableOpacity
            className="bg-cprimaryDark rspadding-w-3 rsborderRadius-w-3"
            onPress={() => {
              setIsCheckout(true);
              setTimeout(() => navigation.push('Checkout'), 100);
            }}>
            <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
              {t('cart.button.checkout')}
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ) : (
        <View className="flex-1 justify-center items-center">
          <View className="rsheight-h-50 rswidth-w-80">
            <Image
              source={require('../../../assets/images/emptycart.png')}
              className="rsheight-h-50 rswidth-w-80"
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            className="bg-lightgreen  rsheight-h-6 rswidth-w-85 rsborderRadius-w-4 items-center justify-center"
            onPress={() => navigation.push('Home')}>
            <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
              {t('cart.button.shop_now')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp(2.15),
    paddingHorizontal: wp(4),
  },
});
