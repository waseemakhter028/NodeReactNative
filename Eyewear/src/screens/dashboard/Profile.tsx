import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import ProfileChangePassword from './components/ProfileChangePassword';
import ProfileChangePhoto from './components/ProfileChangePhoto';
import Header from '../../components/Header';
import Colors from '../../constants/Colors';
import {useContext as useAppContext} from '../../context/AppContext';
import {wp} from '../../helpers/responsive';
import {Text, TouchableOpacity, View} from '../../storybook';
import {NavigationProps} from '../../types';

const ProfileScreen = () => {
  const {isOpenDrawer, setIsOpenDrawer} = useAppContext();
  const navigation: NavigationProps = useNavigation();
  const [isPhotoActiveTab, setIsPhotoActiveTab] = useState<boolean>(true);

  useEffect(() => {
    if (isOpenDrawer) {
      navigation.openDrawer();
    }
    return () => {
      setIsOpenDrawer(false);
    };
  }, [isOpenDrawer, setIsOpenDrawer, navigation]);

  return (
    <LinearGradient
      colors={[Colors.botLinearOne, Colors.botLinearTwo]}
      style={styles.container}>
      {/* header section */}
      <View className="rspaddingTop-h-2">
        <Header isFromDrawer={true} />
      </View>
      <View className="rsmarginTop-h-2.5">
        <Text className="rsfontSize-f-3 text-productTitle">Profile</Text>
        <View className="bg-cprimaryDark rsmarginVertical-h-2 rsheight-h-7 rswidth-w-90 rsborderRadius-w-3 items-center justify-center flex-row">
          <TouchableOpacity
            className={`${
              isPhotoActiveTab ? 'bg-white' : 'bg-cprimaryDark'
            }  rsheight-h-5.5 rswidth-w-44 rsborderRadius-w-3 items-center justify-center rsmarginLeft-w-1.5`}
            onPress={() => {
              setIsPhotoActiveTab(true);
            }}>
            <Text
              className={`rsfontSize-f-2 ${
                isPhotoActiveTab ? 'text-cprimaryDark' : 'text-white'
              } text-center rsfontWeight-700`}>
              Change Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${
              !isPhotoActiveTab ? 'bg-white' : 'bg-cprimaryDark'
            } rsheight-h-5.5 rswidth-w-42 rsborderRadius-w-3 items-center justify-center rsmarginRight-w-1.5`}
            onPress={() => {
              setIsPhotoActiveTab(false);
            }}>
            <Text
              className={`rsfontSize-f-2  ${
                !isPhotoActiveTab ? 'text-cprimaryDark' : 'text-white'
              } text-center rsfontWeight-700`}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
        {isPhotoActiveTab ? <ProfileChangePhoto /> : <ProfileChangePassword />}
      </View>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
});
