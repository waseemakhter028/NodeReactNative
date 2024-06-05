import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../components/Header';
import Loader from '../components/Loader';
import ProductInfoAndReviews from '../components/ProductInfoAndReviews';
import RatingStar from '../components/RatingStar';
import RelatedProducts from '../components/TopProducts';
import Colors from '../constants/Colors';
import {useContext} from '../context/ToastContext';
import axios from '../helpers/axios';
import {getFromAsyncStorage} from '../helpers/common';
import {hp} from '../helpers/responsive';
import useAxios from '../hooks/useAxios';
import {
  Image,
  Pressable,
  Text,
  TextPrice,
  TouchableOpacity,
  View,
} from '../storybook';
import {
  ExtraProps,
  NavigationProps,
  ProductProps,
  RelatedProductProps,
  ReviewProps,
  RouteProps,
} from '../types';

const sizes = ['S', 'M', 'L', 'XL'];
const colors = [
  '#91A1B0',
  '#B11D1D',
  '#1F44A3',
  '#9F632A',
  '#1D752B',
  '#000000',
];

const ProductDetailScreen = () => {
  const {Toast} = useContext();
  const route: RouteProps = useRoute();
  const navigation: NavigationProps = useNavigation();
  const product = route.params.item;
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string>(sizes[1]);
  const [selectedColor, setSelectedColor] = useState<string>(colors[1]);
  const [productDetail, setProductDetail] = useState<ProductProps>({
    _id: '',
    image: '',
    name: '',
    price: 0,
    category: '',
    information: '',
    qty: 0,
  });
  const [extra, setExtra] = useState<ExtraProps>({
    top_information: '',
    reviewsCount: 0,
    avg_rating: 0,
    isCart: false,
  });
  const [relatedProducts, setRelatedProducts] = useState<RelatedProductProps[]>(
    [],
  );
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const {axiosCall} = useAxios();

  const handleAddToCart = async () => {
    const user = JSON.parse(await getFromAsyncStorage('user'));
    const {data, error} = await axiosCall('/carts', {
      method: 'post',
      data: {
        user_id: user.id,
        quantity: 1,
        product_id: product.id,
        size: selectedSize,
        color: selectedColor,
      },
    });
    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
    } else if (!error) {
      if (res.success === true) {
        Toast('success', 'Success !', 'Item added cart successfully !!');
        navigation.navigate('CartTab');
      } else {
        Toast('danger', 'Error !', res.message);
      }
    }
  };

  const fetchProductDeatils = useCallback(async () => {
    try {
      const user = JSON.parse(await getFromAsyncStorage('user'));
      const info = await axios.get(
        `/productdetail?product_id=${product.id}&user_id=${user.id}`,
      );
      const res = info.data;
      if (res.success === true) {
        setProductDetail(res.data.product);
        setExtra(res.data.extra);
        setRelatedProducts(res.data.relatedProducts);
        setReviews(res.data.reviews);
      } else if (res.status === 405 && res.message === 'product not found') {
        navigation.push('Home');
      } else {
        Toast('danger', 'Error !', res.message);
      }
    } catch (e: any) {
      Toast('warning', 'Warning !', e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProductDeatils();
  }, [fetchProductDeatils]);

  if (loading) {
    return <Loader />;
  }

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      className="flex-1">
      <View className="rspadding-w-5">
        <Header isBack={true} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(10)}}>
        <View className="flex-1 rswidth-w-100 rsheight-h-49">
          <Image
            source={{
              uri: process.env.IMAGE_URL + '/' + productDetail?.image,
            }}
            className="flex-1 rswidth-undefined rsheight-undefined"
            resizeMode="contain"
          />
        </View>
        <View className="flex-row justify-between rsmarginHorizontal-w-5 rsmarginVertical-h-2.35">
          <Text className="rsfontSize-f-2.5 text-productTitle rsfontWeight-500">
            {productDetail?.name}
          </Text>
          <TextPrice className="rsfontSize-f-2.5 text-lightgreen rsfontWeight-700">
            {productDetail?.price}
          </TextPrice>
        </View>
        {/* Rating Container*/}
        <View className="rsmarginHorizontal-w-5 rspaddingBottom-h-2.35">
          <View className="flex-row items-center rsgap-w-2">
            <Text className="rsfontSize-f-2.5 text-cprimaryDark font-bold">
              {extra?.avg_rating}
            </Text>
            <RatingStar rating={3} size={3} gap={1.5} />
            <Text className="rsfontSize-f-2.5 text-cprimaryDark font-bold">
              ({extra?.reviewsCount}{' '}
              {extra?.reviewsCount > 1 ? 'reviews' : 'review'})
            </Text>
          </View>
        </View>
        {/* size container */}
        <Text className="rsfontSize-f-2 text-productTitle rsfontWeight-500 rsmarginHorizontal-w-4.9">
          Size
        </Text>
        <View className="flex-row marginHorizontal-w-4.9">
          {sizes.map((size: string) => (
            <TouchableOpacity
              className="rsheight-h-4.25 rswidth-h-4.25 rsborderRadius-h-2.13 bg-white justify-center items-center rsmarginHorizontal-w-2.4 rsmarginTop-h-1.18"
              key={size}
              onPress={() => setSelectedSize(size)}>
              <Text
                className={`rsfontSize-f-2 rsfontWeight-600 ${
                  selectedSize === size
                    ? 'text-cprimaryDark'
                    : 'text-productPrice'
                }`}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* size container */}
        <Text className="rsfontSize-f-2 text-productTitle rsfontWeight-500 rsmarginHorizontal-w-4.9 rsmarginTop-h-1.18">
          Colors
        </Text>
        <View className="flex-row rsmarginHorizontal-w-2 items-center">
          {colors.map((color: string) => (
            <TouchableOpacity
              onPress={() => setSelectedColor(color)}
              key={color}
              className={`rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22 ${
                selectedColor === color && 'rsborderColor-' + color
              } ${selectedColor === color && 'rsborderWidth-h-0.2'}`}>
              <View
                className={`rsheight-h-4.25 rswidth-h-4.25 rsborderRadius-h-2.13 rsbackgroundColor-${color}`}
              />
            </TouchableOpacity>
          ))}
        </View>
        {/* Availalbility Container */}
        <View className="flex-row justify-between rsmarginTop-h-3 rsmarginHorizontal-w-4.9">
          <Text className="rsfontSize-f-2 text-productTitle rsfontWeight-500">
            Availability
          </Text>
          <Pressable
            className={`${
              productDetail?.qty > 0
                ? 'bg-lightgreen rswidth-w-23'
                : 'bg-cred rswidth-w-32'
            }  rspadding-w-1 rounded-full`}>
            <Text className="text-center rsfontSize-f-2 font-bold text-white">
              {productDetail?.qty > 0 ? 'In Stock' : 'Out Of Stock'}
            </Text>
          </Pressable>
        </View>
        {/*  Information and Reviews */}
        <View className="rsmarginTop-h-6 rsmarginHorizontal-w-4.9">
          <ProductInfoAndReviews
            information={productDetail?.information}
            reviews={reviews}
          />
        </View>
        {/* Related Products */}
        <View className="rsmarginTop-h-10 rsmarginHorizontal-w-4.9">
          <View className="items-center">
            <Text className="rsfontSize-f-2.5 text-productTitle rsfontWeight-500">
              Related Products
            </Text>
            <View className="bg-cprimaryDark rsheight-h-0.5 rswidth-w-43" />
          </View>
          <RelatedProducts data={relatedProducts} />
        </View>
      </ScrollView>
      {/* button container */}
      <View className="rspaddingHorizontal-w-2 rspaddingBottom-h-0.5">
        {extra?.isCart ? (
          <TouchableOpacity
            className="bg-cprimaryDark rspadding-w-3 rsborderRadius-w-4"
            onPress={() => navigation.navigate('CartTab')}>
            <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
              Go To Cart
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-cprimaryDark rspadding-w-3 rsborderRadius-w-4"
            onPress={handleAddToCart}>
            <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
              Add To Cart
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

export default ProductDetailScreen;
