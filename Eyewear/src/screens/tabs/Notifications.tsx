import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Header from '../../components/Header';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import Colors from '../../constants/Colors';
import OrderStatus from '../../constants/OrderStatus';
import {useContext as useAppContext} from '../../context/AppContext';
import {useContext} from '../../context/ToastContext';
import {rand, showNotifiDate, statusColor} from '../../helpers/common';
import {fp, hp, wp} from '../../helpers/responsive';
import useAxios from '../../hooks/useAxios';
import {Text, View} from '../../storybook';
import {
  NotificationsCardProps,
  NotificationsIconProps,
  NotificationsPaginationProps,
  NotificationsProps,
} from '../../types/index';

const RenderIcon = ({status}: NotificationsIconProps) => {
  if (status === OrderStatus.order_placed) {
    return <FontAwesome name="first-order" size={fp(3)} color={Colors.cred} />;
  } else if (status === OrderStatus.order_confirmed) {
    return (
      <MaterialIcons
        name="confirmation-num"
        size={fp(3)}
        color={Colors.lightgreen}
      />
    );
  } else if (status === OrderStatus.order_shipped) {
    return (
      <MaterialIcons name="local-shipping" size={fp(3)} color={Colors.cblue} />
    );
  } else {
    return (
      <MaterialIcons
        name="delivery-dining"
        size={fp(3)}
        color={Colors.cprimaryLight}
      />
    );
  }
};

const NoticationCard = ({data}: NotificationsCardProps) => {
  const {t} = useTranslation();
  const description = data.body.split(' ');
  return (
    <View className="bg-cinputBg rsmarginTop-h-2 rsheight-h-10 justify-center rsborderRadius-w-3">
      <View className="flex-row rsgap-w-5">
        <View className="rsheight-h-5 rswidth-w-15 items-center justify-center opacity-4">
          <RenderIcon status={data.title} />
        </View>
        <View className="rswidth-w-40">
          <Text
            className={`rsfontSize-f-2 font-bold rscolor-${statusColor(
              data.title,
            )}`}>
            {t(`notification.status.${data.title}`)}
          </Text>
        </View>
        <Text className="rsfontSize-f-1.5 rsfontWeight-600 text-cblue text-end">
          {showNotifiDate(data.createdAt)}
        </Text>
        <View className="rsposition-absolute  rsmarginTop-h-4 rsmarginLeft-w-19 flex-row">
          <Text className="text-productPrice rsfontSize-f-1.5 rsfontWeight-600">
            {t('notification.description', {orderId: description[2]})}
            {t(`common.status.${description[5]}`)}
          </Text>
          <View className="rsheight-h-1 rswidth-h-1 rsborderRadius-h-0.5 bg-cblue rsmarginTop-h-0.5 rsmarginLeft-w-2" />
        </View>
      </View>
    </View>
  );
};
const Notificaions = () => {
  const {t} = useTranslation();
  const {setCurrentRoute} = useAppContext();
  const {Toast} = useContext();
  const [notificationsData, setNotificationsData] = useState<
    NotificationsProps[]
  >([]);
  const [pages, setPages] = useState<NotificationsPaginationProps>({
    total: 0,
    limit: 0,
    lastPage: 0,
    page: 0,
    slNo: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prev: 0,
    next: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const {axiosCall} = useAxios();

  const fetchNotificaions = async (page = 1) => {
    setLoading(true);

    const {data, error} = await axiosCall('/notifications?page=' + page);

    const res = data;
    if (error) {
      Toast('warning', t('common.warning'), error.message);
    } else if (!error) {
      if (res.success === true) {
        const peg = {
          total: res.data.itemCount,
          limit: res.data.limit,
          lastPage: res.data.last_page,
          page: res.data.currentPage,
          slNo: res.data.slNo,
          hasPrevPage: res.data.hasPrevPage,
          hasNextPage: res.data.hasNextPage,
          prev: res.data.prev,
          next: res.data.next,
        };
        setPages(peg);
        setNotificationsData([...notificationsData, ...res.data.data]);
      } else {
        Toast('danger', t('common.error'), res.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotificaions();

    return () => setCurrentRoute('NotificationTab');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header isBack={true} />
      </View>
      {/* content */}
      <View className="rsmarginTop-h-2.5">
        <Text className="rsfontSize-f-3 text-productTitle">
          {t('notification.title')}
        </Text>
        <FlatList
          numColumns={1}
          data={notificationsData}
          renderItem={({item}) => <NoticationCard data={item} />}
          keyExtractor={() => rand().toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <React.Fragment>{loading && <Loader />}</React.Fragment>
          }
          ListEmptyComponent={
            <React.Fragment>{loading ? <Loader /> : <NoData />}</React.Fragment>
          }
          onEndReached={() => {
            if (pages?.total > 3 && pages?.page < pages?.lastPage) {
              fetchNotificaions(pages?.page + 1);
            }
          }}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{paddingBottom: hp(15)}}
        />
      </View>
      {/* product list */}
    </LinearGradient>
  );
};

export default Notificaions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
