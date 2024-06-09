import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';

import Categories from '../components/Categories';
import Header from '../components/Header';
import ImageCarousel from '../components/ImageCarousel';
import Loader from '../components/Loader';
import NoData from '../components/NoData';
import ProductCard from '../components/ProductCard';
import Colors from '../constants/Colors';
import {useContext as useAppContext} from '../context/AppContext';
import {useContext} from '../context/ToastContext';
import axios from '../helpers/axios';
import {getFromAsyncStorage, rand} from '../helpers/common';
import {fp, hp, wp} from '../helpers/responsive';
import {TextInput, View} from '../storybook';
import {HomeProductsProps, HomeRatingProps, PaginationProps} from '../types';

const HomeScreen = () => {
  const {setCartCount, setCurrentRoute} = useAppContext();
  const {Toast} = useContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<HomeProductsProps[]>([]);
  const [pages, setPages] = useState<PaginationProps>({
    page: 0,
    limit: 0,
    total: 0,
    lastPage: 0,
  });
  const [isLiked, setIsLiked] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const fetchProducts = async (
    pageNumber = 1 as number,
    categories = [] as string[],
    reset = false as boolean,
  ) => {
    if (searchValue === '') {
      setLoading(true);
      try {
        const filterData: HomeRatingProps = {
          price: null,
          categories: categories || [],
          rating: [],
        };
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
          setCartCount(await getFromAsyncStorage('cartCount'));
        } else {
          Toast('danger', 'Error !', res.message);
        }
      } catch (e: any) {
        Toast('warning', 'Warning !', e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (filterValue: string) => {
    setProducts([]);
    setSearchValue(filterValue);
    if (filterValue !== '') {
      const result: HomeProductsProps[] = products.filter(
        (option: HomeProductsProps) =>
          option.name
            .toLowerCase()
            .startsWith(filterValue.toLocaleLowerCase()) ||
          option.price.toString().startsWith(filterValue.toLocaleLowerCase()),
      );
      setProducts(result);
    } else {
      Keyboard.dismiss();
      fetchProducts(1, [], true);
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => setCurrentRoute('HomeTab');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header />
      </View>
      {/* content */}
      <View className="rspaddingTop-h-3">
        {/* product list */}
        <View className="bg-white rsborderRadius-w-2 rsheight-h-6 rsfontSize-f-2.5 rspaddingHorizontal-w-5 placeholder-cinputCol  items-center flex-row">
          <Fontisto name="search" color={Colors.cinputCol} size={fp(3)} />
          <TextInput
            placeholder="Search ..."
            placeholderTextColor={Colors.cinputCol}
            className="bg-white rsborderRadius-w-2 rsheight-h-6 rsfontSize-f-2.5 rspaddingHorizontal-w-5 placeholder-cinputCol"
            onChangeText={(text: string) => handleSearch(text)}
          />
        </View>
        <FlatList
          numColumns={2}
          ListHeaderComponent={
            <React.Fragment>
              {/* Carousel */}
              <View className="rspaddingTop-h-2">
                <ImageCarousel />
              </View>
              {/* Categories */}
              <View className="rspaddingTop-h-2">
                <Categories filterProductByCategory={fetchProducts} />
              </View>
            </React.Fragment>
          }
          ListFooterComponent={
            <React.Fragment>{loading && <Loader />}</React.Fragment>
          }
          ListEmptyComponent={
            <React.Fragment>{loading ? <Loader /> : <NoData />}</React.Fragment>
          }
          data={products}
          renderItem={({item}) => (
            <ProductCard
              item={item}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
            />
          )}
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
          columnWrapperStyle={{gap: wp(5)}}
        />
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
