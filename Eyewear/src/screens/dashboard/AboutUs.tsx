import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import TopProducts from '../../components/TopProducts';
import Colors from '../../constants/Colors';
import {useContext} from '../../context/ToastContext';
import axios from '../../helpers/axios';
import {hp, wp} from '../../helpers/responsive';
import {Text, View} from '../../storybook';
import {ItemProps} from '../../types';

const AboutUsScreen = () => {
  const {Toast} = useContext();
  const [products, setProducts] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchTopRatedProducts = useCallback(async () => {
    try {
      const info = await axios.get('/topratedproducts');
      const res = info.data;
      if (res.success === true) {
        setProducts(res.data);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    } catch (e: any) {
      Toast('warning', 'Warning !', e.message);
    } finally {
      setLoading(false);
    }
  }, [Toast]);

  useEffect(() => {
    fetchTopRatedProducts();
  }, [fetchTopRatedProducts]);

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
      <View className="rspaddingTop-h-3">
        <Text className="rsfontSize-f-2.5 text-productTitle rsfontWeight-500 text-center">
          About Us
        </Text>
        <ScrollView contentContainerStyle={{paddingBottom: hp(20)}}>
          <Text className="rsfontSize-f-1.8 text-productPrice rsfontWeight-500 rsmarginTop-h-2">
            Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula
            elementum sed sit amet dui. Curabitur non nulla sit amet nisl tempus
            convallis quis ac lectus. Mauris blandit aliquet elit, eget
            tincidunt nibh pulvinar a. Vivamus magna justo, lacinia eget
            consectetur sed, convallis at tellus. Sed porttitor lectus nibh.
            Donec sollicitudin molestie malesuada. Curabitur non nulla sit amet
            nisl tempus convallis quis ac lectus. Proin eget tortor risus. Donec
            rutrum congue leo eget malesuada. Curabitur non nulla sit amet nisl
            tempus convallis quis ac lectus. Donec sollicitudin molestie
            malesuada. Nulla quis lorem ut libero malesuada feugiat. Curabitur
            arcu erat, accumsan id imperdiet et, porttitor at sem. The corner
            window forms a place within a place that is a resting point within
            the large space. The study area is located at the back with a view
            of the vast nature. Together with the other buildings, a congruent
            story has been managed in which the whole has a reinforcing effect
            on the components. The use of materials seeks connection to the main
            house, the adjacent stables
          </Text>
          {/* Related Products */}
          <View className="rsmarginTop-h-10">
            <View className="items-center">
              <Text className="rsfontSize-f-2.5 text-productTitle rsfontWeight-500">
                Top Rated Products
              </Text>
              <View className="bg-cprimaryDark rsheight-h-0.5 rswidth-w-49" />
            </View>
            <TopProducts data={products} />
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
