import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AddAddress from './AddAddress';
import DeleteModal from '../../components/DeleteModal';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import NoData from '../../components/NoData';
import Colors from '../../constants/Colors';
import {useContext} from '../../context/ToastContext';
import {getFromAsyncStorage, rand} from '../../helpers/common';
import {fp, hp, wp} from '../../helpers/responsive';
import useAxios from '../../hooks/useAxios';
import {Pressable, Text, View} from '../../storybook';
import {AddressCardProps, AddressProps} from '../../types';

const AddressCard = ({
  item,
  updateAddress,
  deleteAddress,
}: AddressCardProps) => {
  return (
    <View className="rsmarginTop-h-2">
      <View className="flex-row items-center rsgap-w-5">
        <MaterialIcons
          name="location-pin"
          size={fp(5)}
          color={Colors.cprimaryDark}
        />
        <View>
          <Text className="rsfontSize-f-2 text-productTitle">
            {item.address_type}
          </Text>
          <Text className="rsfontSize-f-1.6 text-productPrice rsmarginRight-w-10 rsflexWrap-wrap">
            {item.street}, {item.address}, {item.landmark},
          </Text>
          <Text className="rsfontSize-f-1.6 text-productPrice rsmarginRight-w-10 rsflexWrap-wrap">
            {item.city}, {item.state}, {item.zipcode}, {item.country}
          </Text>
          <View className="flex-row  rsmarginTop-h-2 rsgap-w-5">
            <Pressable onPress={() => updateAddress(item)}>
              <MaterialIcons
                name="edit-square"
                size={fp(3)}
                color={Colors.cblue}
              />
            </Pressable>
            <Pressable onPress={() => deleteAddress(item._id)}>
              <MaterialIcons name="delete" size={fp(3)} color={Colors.cred} />
            </Pressable>
          </View>
        </View>
      </View>
      <View className="bg-catBgColor rsheight-h-0.1 rswidth-w-90 rsmarginTop-h-2" />
    </View>
  );
};

const AddressScreen = () => {
  const {Toast} = useContext();
  const [openAddressModal, setOpenAddressModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressData, setAddressData] = useState<AddressProps[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<
    AddressProps | undefined
  >(undefined);
  const [deleteAddressId, setDeleteAddressId] = useState<string>('');
  const {axiosCall} = useAxios();

  const handleShowDeleteModal = async (addressId: string) => {
    setDeleteModal(true);
    setDeleteAddressId(addressId);
  };

  const handleUpdateAddress = async (item: AddressProps) => {
    setSelectedAddress(item);
    setOpenAddressModal(true);
  };

  const deleteAddress = async () => {
    setAddressData([]);
    setLoading(true);

    const {data, error} = await axiosCall('/address/' + deleteAddressId, {
      method: 'delete',
    });
    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
    } else if (!error) {
      if (res.success === true) {
        Toast('success', 'Success !', 'Address deleted Successfully !', 2000);
        setDeleteAddressId('');
        setDeleteModal(false);
        setAddressData(res.data);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    }

    setLoading(false);
  };

  const fetchAddress = useCallback(async () => {
    setAddressData([]);
    setLoading(true);
    const user = JSON.parse(await getFromAsyncStorage('user'));

    const {data, error} = await axiosCall('/address?user_id=' + user.id);
    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
    } else if (!error) {
      if (res.success === true) {
        setAddressData(res.data);
      } else {
        Toast('danger', 'Error !', res.message);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Toast]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);
  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header isFromDrawer={true} />
      </View>
      <View className="rsmarginTop-h-2.5">
        <Text className="rsfontSize-f-3 text-productTitle">Manage Address</Text>
        {/* Address List */}
        <Pressable
          className="bg-cprimaryDark rsmarginTop-h-2 rswidth-w-32 rspadding-w-1.5 rounded-full"
          onPress={() => {
            setSelectedAddress(undefined);
            setOpenAddressModal(!openAddressModal);
          }}>
          <Text className="text-center rsfontSize-f-2 font-bold text-white">
            Add Address
          </Text>
        </Pressable>
        {openAddressModal && (
          <AddAddress
            modalOpen={openAddressModal}
            setModalOpen={setOpenAddressModal}
            selectedAddress={selectedAddress}
            handleCheckout={undefined}
          />
        )}
        {deleteModal && (
          <DeleteModal
            modalOpen={deleteModal}
            setModalOpen={setDeleteModal}
            handleDelete={deleteAddress}
            message="Are you sure delete this address ?"
          />
        )}
        <View className="rsmarginTop-h-2.5">
          <FlatList
            numColumns={1}
            data={addressData}
            renderItem={({item}) => (
              <AddressCard
                item={item}
                updateAddress={handleUpdateAddress}
                deleteAddress={handleShowDeleteModal}
              />
            )}
            keyExtractor={() => rand().toString()}
            ListFooterComponent={
              <React.Fragment>{loading && <Loader />}</React.Fragment>
            }
            ListEmptyComponent={
              <React.Fragment>
                {loading ? <Loader /> : <NoData />}
              </React.Fragment>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(30)}}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
