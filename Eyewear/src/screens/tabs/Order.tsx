import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';

import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import {
  getFromAsyncStorage,
  orderStatusByNumber,
  rand,
  statusButtonColor,
} from '../../helpers/common';
import genterateInvoiceHtml from '../../helpers/invoicesHtml';
import {fp, hp, wp} from '../../helpers/responsive';
import useAxios from '../../hooks/useAxios';
import {
  Image,
  Pressable,
  Text,
  TextPrice,
  TouchableOpacity,
  View,
} from '../../storybook';
import {
  OrderCardProps,
  OrderPaginationProps,
  OrderProps,
  PaginationProps,
} from '../../types';

const OrderCard = ({item, Toast}: OrderCardProps) => {
  const {axiosCall} = useAxios();
  const [loadingId, setLoadingId] = useState<string>('');

  const generatePDF = async () => {
    setLoadingId(item.id);
    try {
      const {data, error} = await axiosCall(
        'orderinvoiceinfo?order_id=' + item.id,
      );
      const res = data;
      if (error) {
        Toast('warning', 'Warning !', error.message);
      } else if (!error) {
        if (res.success === true) {
          const html = genterateInvoiceHtml(res.data);

          const fileName =
            item.order_id + '_' + Math.floor(Math.random() * 100000 + 999999);
          const options = {
            html,
            fileName: fileName,
            directory: 'Downloads',
            base64: true,
          };
          const file = await RNHTMLtoPDF.convert(options);

          if (file.filePath !== undefined && file.base64) {
            const filePath = RNFS.DownloadDirectoryPath + `/${fileName}.pdf`;
            RNFS.writeFile(filePath, file.base64, 'base64')
              .then(() => {
                Toast(
                  'success',
                  'Success !',
                  `PDF saved to ${file.filePath}`,
                  4000,
                );
              })
              .catch(() => {
                Toast('danger', 'Error !', 'Sorry unable to genrate pdf');
              });
          }
        } else {
          Toast('danger', 'Error !', res.message);
        }
      }
    } catch (error: any) {
      Toast('danger', 'Error !', error.message);
    } finally {
      setLoadingId('');
    }
  };
  return (
    <View className="rsmarginTop-h-2">
      <View className="flex-row rsgap-w-5">
        <View className="rsheight-h-10 rswidth-w-20">
          <Image
            source={{
              uri: process.env.IMAGE_URL + '/' + item.product.image,
            }}
            className="rsheight-h-10 rswidth-w-20"
            resizeMode="contain"
          />
        </View>
        {/* right content*/}
        <View>
          <View className="flex-row rsgap-w-8 items-center">
            <Text className="rsfontSize-f-1.6 text-productPrice">
              Order ID: {item.order_id}
            </Text>
            <Pressable
              className={`rsbackgroundColor-${statusButtonColor(
                item.status.toString(),
              )} rswidth-w-20 rspadding-w-1 rsborderRadius-w-1`}>
              <Text className="text-center rsfontSize-f-1.6 font-bold text-white">
                {orderStatusByNumber(item.status.toString())}
              </Text>
            </Pressable>
          </View>
          {/* notes */}
          <Text className="rsfontSize-f-1.6 text-productTitle">
            {item.notes}
          </Text>
          {/* price size and color */}
          <View className="rsmarginTop-h-1">
            <View className="flex-row items-center justify-between">
              <View className="flex-row rsgap-w-4">
                <View className="rsheight-w-6 rswidth-w-6 rsborderRadius-w-3 bg-white justify-center items-center">
                  <Text className="rsfontSize-f-1.6 rsfontWeight-500 text-cprimaryDark">
                    {item.productOrders.size}
                  </Text>
                </View>
                <View
                  className={`rsheight-w-5 rswidth-w-5 rsborderRadius-w-2.5 rsbackgroundColor-${item.productOrders.color}`}
                />
                <Pressable
                  className="rsheight-w-6 rswidth-w-6 rsborderRadius-w-3 bg-white justify-center items-center"
                  onPress={generatePDF}>
                  <Text className="rsfontSize-f-1.6 rsfontWeight-500 text-cprimaryDark">
                    {loadingId === item.id ? (
                      <ActivityIndicator
                        size="small"
                        color={Colors.cprimaryDark}
                      />
                    ) : (
                      <Feather
                        name="printer"
                        size={fp(1.6)}
                        color={Colors.cprimaryDark}
                      />
                    )}
                  </Text>
                </Pressable>
              </View>
              <TextPrice className="rsfontSize-f-1.6 text-cprimaryDark">
                {item.productOrders.price}
              </TextPrice>
            </View>
          </View>
        </View>
      </View>
      <View className="bg-catBgColor rsheight-h-0.1 rswidth-w-90 rsmarginTop-h-2" />
    </View>
  );
};

const Order = () => {
  const {setCurrentRoute} = useAppContext();
  const {Toast} = useContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const [pastOrders, setPastOrders] = useState<OrderProps[]>([]);
  const [pages, setPages] = useState<OrderPaginationProps>({
    page: 0,
    limit: 0,
    total: 0,
    lastPage: 0,
  });
  const [activeTab, setActiveTab] = useState<boolean>(true);
  const [status, setStatus] = useState<number>(1); // 1 == active orders and  4 === past order
  const {axiosCall} = useAxios();

  const fetchOrders = useCallback(
    async (pageNumber = 1) => {
      setLoading(true);
      const user = JSON.parse(await getFromAsyncStorage('user'));
      const {data, error} = await axiosCall(
        `/orders?page=${pageNumber}&user_id=${user.id}&status=${status}`,
      );
      const res = data;
      if (error) {
        Toast('warning', 'Warning !', error.message);
      } else if (!error) {
        if (res.success === true) {
          const peg: PaginationProps = {
            page: res.data.pagedata.current_page,
            limit: res.data.pagedata.per_page,
            total: res.data.pagedata.total,
            lastPage: res.data.pagedata.last_page,
          };
          setPages(peg);
          switch (activeTab) {
            case true: // case for set active orders
              setPastOrders([]);
              setOrders((prevState: OrderProps[]) => [
                ...prevState,
                ...res.data.data,
              ]);
              break;

            case false: // case for set past orders
              setOrders([]);
              setPastOrders((prevState: OrderProps[]) => [
                ...prevState,
                ...res.data.data,
              ]);
              break;

            default:
              setPastOrders([]);
              setOrders([]);
              break;
          }
        } else {
          Toast('danger', 'Error !', res.message);
        }
      }
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab, status],
  );

  useEffect(() => {
    fetchOrders();
    return () => setCurrentRoute('OrderTab');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, status]);
  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header isBack={true} />
      </View>
      <View className="rsmarginTop-h-2.5">
        <Text className="rsfontSize-f-3 text-productTitle">Orders</Text>
        <View className="bg-cprimaryDark rsmarginVertical-h-2 rsheight-h-7 rswidth-w-90 rsborderRadius-w-3 items-center justify-center flex-row">
          <TouchableOpacity
            className={`${
              activeTab ? 'bg-white' : 'bg-cprimaryDark'
            }  rsheight-h-5.5 rswidth-w-44 rsborderRadius-w-3 items-center justify-center rsmarginLeft-w-1.5`}
            onPress={() => {
              setActiveTab(true);
              setStatus(1);
            }}>
            <Text
              className={`rsfontSize-f-2 ${
                activeTab ? 'text-cprimaryDark' : 'text-white'
              } text-center rsfontWeight-700`}>
              Active Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${
              !activeTab ? 'bg-white' : 'bg-cprimaryDark'
            } rsheight-h-5.5 rswidth-w-42 rsborderRadius-w-3 items-center justify-center rsmarginRight-w-1.5`}
            onPress={() => {
              setActiveTab(false);
              setStatus(4);
            }}>
            <Text
              className={`rsfontSize-f-2  ${
                !activeTab ? 'text-cprimaryDark' : 'text-white'
              } text-center rsfontWeight-700`}>
              Past Orders
            </Text>
          </TouchableOpacity>
        </View>
        {/* Orders List */}
        <FlatList
          numColumns={1}
          data={activeTab ? orders : pastOrders}
          ListFooterComponent={
            <React.Fragment>{loading && <Loader />}</React.Fragment>
          }
          ListEmptyComponent={
            <React.Fragment>{loading ? <Loader /> : <NoData />}</React.Fragment>
          }
          renderItem={({item}) => <OrderCard item={item} Toast={Toast} />}
          keyExtractor={() => rand().toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (pages?.total > 3 && pages?.page < pages?.lastPage) {
              setStatus(activeTab ? 1 : 4);
              fetchOrders(pages?.page + 1);
            }
          }}
          extraData={activeTab ? orders : pastOrders}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{paddingBottom: hp(30)}}
        />
      </View>
    </LinearGradient>
  );
};

export default Order;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
