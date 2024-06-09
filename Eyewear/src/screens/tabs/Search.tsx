import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, Modal, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import RatingStar from '../../components/RatingStar';
import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {rand} from '../../helpers/common';
import {fp, hp, wp} from '../../helpers/responsive';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TextPrice,
  TouchableOpacity,
  View,
} from '../../storybook';
import {
  CategoriesProps,
  HomeProductsProps,
  HomeRatingProps,
  PaginationProps,
  ProductCardProps,
} from '../../types';

const SearchProductCard = ({item}: ProductCardProps) => {
  return (
    <View>
      <View className="flex-row rsgap-w-6">
        <View className="rsheight-h-15 rswidth-w-30">
          <Image
            source={{
              uri: process.env.IMAGE_URL + '/' + item.image,
            }}
            className="rsheight-h-15 rswidth-w-30"
            resizeMode="contain"
          />
        </View>
        <View className="rsmarginTop-h-0.5">
          <Text className="rsfontSize-f-2 text-productTitle">{item.name}</Text>
          {/* Rating Container*/}
          <View className="rsmarginTop-h-1">
            <View className="flex-row items-center rsgap-w-2">
              <Text className="rsfontSize-f-2 text-cprimaryDark font-bold">
                {item?.avgRating}
              </Text>
              <RatingStar
                rating={item?.avgRating !== undefined ? item.avgRating : 0}
                size={2.2}
                gap={1}
              />
              <Text className="rsfontSize-f-1.5 text-cprimaryDark font-bold">
                ({item?.reviewCount}{' '}
                {item.reviewCount !== undefined && item?.reviewCount > 1
                  ? 'reviews'
                  : 'review'}
                )
              </Text>
            </View>
          </View>
          <TextPrice className="rsmarginTop-h-3 rsfontSize-f-2.5 text-lightgreen">
            {item.price}
          </TextPrice>
        </View>
      </View>
      <View
        className={`rsborderWidth-h-0.03 rsborderColor-${Colors.cinputCol} rsmarginVertical-h-1.18`}
      />
    </View>
  );
};

const Search = () => {
  const {Toast} = useContext();
  const {setCurrentRoute} = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<HomeProductsProps[]>([]);
  const [pages, setPages] = useState<PaginationProps>({
    page: 0,
    limit: 0,
    total: 0,
    lastPage: 0,
  });
  const [openPriceModal, setOpenPriceModal] = useState<boolean>(false);
  const [priceOrder, setPriceOrder] = useState<string | null>('');
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoriesProps[]>([]);
  const [openReviewModal, setOpenReviewModal] = useState<boolean>(false);
  const [reviews, setReviews] = useState<string[]>([]);
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = async (filterValue: string) => {
    setSearchValue(filterValue);
    if (filterValue !== '') {
      const result: HomeProductsProps[] = products.filter(
        (option: HomeProductsProps) =>
          option.name
            .toLowerCase()
            .startsWith(filterValue.toLocaleLowerCase()) ||
          option.price.toString().startsWith(filterValue.toLocaleLowerCase()),
      );
      setIsClearAll(true);
      fetchProducts(1, true, false, result, true);
    } else {
      Keyboard.dismiss();
      setIsClearAll(false);
      fetchProducts(1, true, false);
    }
  };

  const fetchCategories = async () => {
    try {
      const info = await axios.get('/category');
      const res = info.data;
      if (res.success === true) {
        setCategoriesData(res.data);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    } catch (e: any) {
      Toast('warning', 'Warning !', e.message);
    }
  };

  const fetchProducts = async (
    pageNumber = 1 as number,
    reset = false as boolean,
    clearAll = false as boolean,
    searchData = [] as HomeProductsProps[],
    search = false as boolean,
  ) => {
    if (searchData.length > 0 || search) {
      setProducts(searchData);
      setPages({
        page: 0,
        limit: 0,
        total: 0,
        lastPage: 0,
      });
      return false;
    }
    setLoading(true);
    try {
      let filterData: HomeRatingProps = {
        price: priceOrder,
        categories: categories,
        rating: reviews,
      };
      if (clearAll) {
        filterData = {
          price: null,
          categories: [],
          rating: [],
        };
        setIsClearAll(false);
      }
      const info = await axios.post(
        '/products?page=' + pageNumber,
        JSON.stringify(filterData),
      );
      const res = info.data;
      if (res.success === true) {
        const peg: PaginationProps = {
          page: res.data.page,
          limit: res.data.limit,
          total: res.data.total,
          lastPage: res.data.lastPage,
        };
        setPages(peg);
        if (!reset) {
          setProducts([...products, ...res.data.docs]);
        } else {
          setProducts(res.data.docs);
        }
        if (
          !isClearAll &&
          (priceOrder !== '' || categories.length > 0 || reviews.length > 0)
        ) {
          setIsClearAll(true);
        }
      } else {
        Toast('danger', 'Error !', res.message);
      }
    } catch (e: any) {
      Toast('warning', 'Warning !', e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleClear = () => {
    setSearchValue('');
    setPriceOrder('');
    setCategories([]);
    setReviews([]);
    setIsClearAll(false);
    setProducts([]);
    fetchProducts(1, true, true);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    return () => setCurrentRoute('SearchTab');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {}, [categories, priceOrder, reviews, isClearAll]);

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header />
      </View>
      <View className="rspaddingTop-h-3">
        {/* search box */}
        <View className="bg-white rsborderRadius-w-2 rsheight-h-6 rsfontSize-f-2.5 rspaddingHorizontal-w-5 placeholder-cinputCol  items-center flex-row">
          <Fontisto name="search" color={Colors.cinputCol} size={fp(3)} />
          <TextInput
            placeholder="Search ..."
            value={searchValue}
            placeholderTextColor={Colors.cinputCol}
            className="bg-white rsborderRadius-w-2 rsheight-h-6 rsfontSize-f-2.5 rspaddingHorizontal-w-5 placeholder-cinputCol"
            onChangeText={(text: string) => handleSearch(text)}
          />
        </View>
        {/* filter list */}
        <View className="rsmarginVertical-h-2 flex-row rsgap-w-5">
          <Pressable
            className={`rsborderWidth-h-0.1 ${
              priceOrder !== '' ? 'border-cprimaryDark' : 'border-cblue'
            } bg-cinputBg rounded-full items-center justify-center rsheight-h-3 rswidth-w-15`}
            onPress={() => setOpenPriceModal(true)}>
            <Text
              className={`rsfontSize-f-1.5 ${
                priceOrder !== '' ? 'text-cprimaryDark' : 'text-cblue'
              }`}>
              Price
            </Text>
          </Pressable>
          <Pressable
            className={`rsborderWidth-h-0.1 ${
              categories.length > 0 ? 'border-cprimaryDark' : 'border-cblue'
            } bg-cinputBg rounded-full items-center justify-center rsheight-h-3 rswidth-w-22`}
            onPress={() => setOpenCategoryModal(true)}>
            <Text
              className={`rsfontSize-f-1.5 ${
                categories.length > 0 ? 'text-cprimaryDark' : 'text-cblue'
              }`}>
              Categories
            </Text>
          </Pressable>
          <Pressable
            className={`rsborderWidth-h-0.1 ${
              reviews.length > 0 ? 'border-cprimaryDark' : 'border-cblue'
            } bg-cinputBg rounded-full items-center justify-center rsheight-h-3 rswidth-w-18`}>
            <Text
              className={`rsfontSize-f-1.5 ${
                reviews.length > 0 ? 'text-cprimaryDark' : 'text-cblue'
              }`}
              onPress={() => setOpenReviewModal(true)}>
              Reviews
            </Text>
          </Pressable>
          {isClearAll && (
            <TouchableOpacity
              className="rsborderWidth-h-0.1 border-cprimaryDark bg-cinputBg rounded-full items-center justify-center rsheight-h-3 rswidth-w-18"
              onPress={() => handleClear()}>
              <Text className="rsfontSize-f-1.5 text-cprimaryDark">
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* product list */}
        <FlatList
          numColumns={1}
          extraData={loading}
          ListFooterComponent={
            <React.Fragment>{loading && <Loader />}</React.Fragment>
          }
          ListEmptyComponent={
            <React.Fragment>{loading ? <Loader /> : <NoData />}</React.Fragment>
          }
          data={products}
          renderItem={({item}) => <SearchProductCard item={item} />}
          keyExtractor={() => rand().toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (pages?.total > 6 && pages?.page < pages?.lastPage) {
              fetchProducts(pages?.page + 1);
            }
          }}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{
            paddingBottom: hp(21),
          }}
        />
      </View>
      {/* price modal */}
      <View className="rspaddingVertical-h-2 rsborderRadius-w-5">
        <Modal
          visible={openPriceModal}
          transparent
          style={{borderRadius: wp(5)}}>
          <View className="flex-1  items-center">
            <View className="rswidth-w-100 rsheight-h-90 bg-white rspadding-w-4.5 rsborderRadius-w-5">
              <Text className="rsfontSize-f-3 text-productTitle text-center rspaddingTop-h-2">
                Price
              </Text>
              <View className="rsmarginTop-h-10 items-center">
                {/* all */}
                <View className="flex-row rsgap-w-3 rswidth-w-50">
                  <TouchableOpacity
                    className={`rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22 ${
                      priceOrder === null &&
                      'rsborderColor-' + Colors.cprimaryDark
                    } ${priceOrder === null && 'rsborderWidth-h-0.2'}`}
                    onPress={() => setPriceOrder(null)}>
                    <View
                      className={`rsheight-h-4 rswidth-h-4 rsborderRadius-h-2 ${
                        priceOrder === null ? 'bg-cprimaryDark' : 'bg-cinputCol'
                      }`}
                    />
                  </TouchableOpacity>
                  <Text className="rsfontSize-f-2.5 text-productTitle rsmarginTop-h-1">
                    All
                  </Text>
                </View>
                {/* low to high */}
                <View className="flex-row rsgap-w-3 rswidth-w-50 rsmarginTop-h-2">
                  <TouchableOpacity
                    className={`rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22 ${
                      priceOrder === 'ASC' &&
                      'rsborderColor-' + Colors.cprimaryDark
                    } ${priceOrder === 'ASC' && 'rsborderWidth-h-0.2'}`}
                    onPress={() => setPriceOrder('ASC')}>
                    <View
                      className={`rsheight-h-4 rswidth-h-4 rsborderRadius-h-2 ${
                        priceOrder === 'ASC'
                          ? 'bg-cprimaryDark'
                          : 'bg-cinputCol'
                      }`}
                    />
                  </TouchableOpacity>
                  <Text className="rsfontSize-f-2.5 text-productTitle rsmarginTop-h-1">
                    Low To High
                  </Text>
                </View>
                {/* high to low */}
                <View className="flex-row rsgap-w-3 rswidth-w-50 rsmarginTop-h-2">
                  <TouchableOpacity
                    className={`rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22 ${
                      priceOrder === 'DESC' &&
                      'rsborderColor-' + Colors.cprimaryDark
                    } ${priceOrder === 'DESC' && 'rsborderWidth-h-0.2'}`}
                    onPress={() => setPriceOrder('DESC')}>
                    <View
                      className={`rsheight-h-4 rswidth-h-4 rsborderRadius-h-2 ${
                        priceOrder === 'DESC'
                          ? 'bg-cprimaryDark'
                          : 'bg-cinputCol'
                      }`}
                    />
                  </TouchableOpacity>
                  <Text className="rsfontSize-f-2.5 text-productTitle rsmarginTop-h-1">
                    High To Low
                  </Text>
                </View>
                {/* button section*/}
                <View className="items-end justify-end rsheight-h-48">
                  <View className="flex-row rsgap-w-6 rsmarginLeft-w-20">
                    <Pressable
                      className="bg-cblue rswidth-w-32
                       rspadding-w-2 rounded-full items-center justify-center"
                      onPress={() => {
                        setOpenPriceModal(false);
                      }}>
                      <Text className="text-center rsfontSize-f-2 font-bold text-white">
                        Close
                      </Text>
                    </Pressable>
                    <Pressable
                      className="bg-cprimaryDark rswidth-w-32
                       rspadding-w-2 rs rounded-full items-center justify-center"
                      onPress={() => {
                        setOpenPriceModal(false);
                        setProducts([]);
                        fetchProducts(1, true);
                      }}>
                      <Text className="text-center rsfontSize-f-2 font-bold text-white">
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* category modal */}
      <View className="rspaddingVertical-h-2 rsborderRadius-w-5">
        <Modal
          visible={openCategoryModal}
          transparent
          style={{borderRadius: wp(5)}}>
          <View className="flex-1  items-center">
            <View className="rswidth-w-100 rsheight-h-90 bg-white rspadding-w-4.5 rsborderRadius-w-5">
              <Text className="rsfontSize-f-3 text-productTitle text-center rspaddingTop-h-2">
                Categories
              </Text>
              <View className="rsmarginTop-h-10 items-center">
                {/* list category */}
                {categoriesData.map(item => (
                  <View
                    className="flex-row rsgap-w-3 rswidth-w-50"
                    key={rand()}>
                    {categories.includes(item.id) ? (
                      <TouchableOpacity
                        className="rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22"
                        onPress={() => {
                          const cat = categories.filter(
                            category => category !== item.id,
                          );
                          setCategories(cat);
                        }}>
                        <MaterialCommunityIcons
                          name="checkbox-intermediate"
                          color={Colors.cprimaryDark}
                          size={fp(3.5)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        className="rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22"
                        onPress={() => setCategories([...categories, item.id])}>
                        <MaterialCommunityIcons
                          name="checkbox-blank-outline"
                          color={Colors.cinputCol}
                          size={fp(3.5)}
                        />
                      </TouchableOpacity>
                    )}
                    <Text className="rsfontSize-f-2.5 text-productTitle rsmarginTop-h-1">
                      {item.name}
                    </Text>
                  </View>
                ))}
                {/* button section*/}
                <View className="items-end justify-end rsheight-h-52">
                  <View className="flex-row rsgap-w-6 rsmarginLeft-w-20">
                    <Pressable
                      className="bg-cblue rswidth-w-32
                       rspadding-w-2 rounded-full items-center justify-center"
                      onPress={() => {
                        setOpenCategoryModal(false);
                      }}>
                      <Text className="text-center rsfontSize-f-2 font-bold text-white">
                        Close
                      </Text>
                    </Pressable>
                    <Pressable
                      className="bg-cprimaryDark rswidth-w-32
                       rspadding-w-2 rs rounded-full items-center justify-center"
                      onPress={() => {
                        setOpenCategoryModal(false);
                        setProducts([]);
                        fetchProducts(1, true);
                      }}>
                      <Text className="text-center rsfontSize-f-2 font-bold text-white">
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* reviews modal */}
      <View className="rspaddingVertical-h-2 rsborderRadius-w-5">
        <Modal
          visible={openReviewModal}
          transparent
          style={{borderRadius: wp(5)}}>
          <View className="flex-1  items-center">
            <View className="rswidth-w-100 rsheight-h-90 bg-white rspadding-w-4.5 rsborderRadius-w-5">
              <Text className="rsfontSize-f-3 text-productTitle text-center rspaddingTop-h-2">
                Customer Reviews
              </Text>
              <View className="rsmarginTop-h-10 items-center">
                {/* list category */}
                {['5', '4', '3', '2', '1'].map(item => (
                  <View
                    className="flex-row rsgap-w-3 rswidth-w-65"
                    key={rand()}>
                    {reviews.includes(item) ? (
                      <TouchableOpacity
                        className="rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22"
                        onPress={() => {
                          const review = reviews.filter(
                            rating => rating !== item,
                          );
                          setReviews(review);
                        }}>
                        <MaterialCommunityIcons
                          name="checkbox-intermediate"
                          color={Colors.cprimaryDark}
                          size={fp(3.5)}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        className="rsheight-h-5.65 rswidth-h-5.65 rsborderRadius-h-2.82 items-center justify-center rsmarginHorizontal-w-1.22"
                        onPress={() => setReviews([...reviews, item])}>
                        <MaterialCommunityIcons
                          name="checkbox-blank-outline"
                          color={Colors.cinputCol}
                          size={fp(3.5)}
                        />
                      </TouchableOpacity>
                    )}
                    <View className="rsmarginTop-h-1">
                      <RatingStar
                        rating={Number(item)}
                        size={3}
                        gap={2}
                        showStarRatingWise={true}
                      />
                    </View>
                    <Text className="rsfontSize-f-2.5 text-productTitle rsmarginTop-h-1">
                      {item}.0
                    </Text>
                  </View>
                ))}
                {/* button section*/}
                <View className="items-end justify-end rsheight-h-40">
                  <View className="flex-row rsgap-w-6 rsmarginLeft-w-20">
                    <Pressable
                      className="bg-cblue rswidth-w-32
                       rspadding-w-2 rounded-full items-center justify-center"
                      onPress={() => {
                        setOpenReviewModal(false);
                      }}>
                      <Text className="text-center rsfontSize-f-2 font-bold text-white">
                        Close
                      </Text>
                    </Pressable>
                    <Pressable
                      className="bg-cprimaryDark rswidth-w-32
                       rspadding-w-2 rs rounded-full items-center justify-center"
                      onPress={() => {
                        setOpenReviewModal(false);
                        setProducts([]);
                        fetchProducts(1, true);
                      }}>
                      <Text className="text-center rsfontSize-f-2 font-bold text-white">
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
