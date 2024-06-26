import React, {useEffect} from 'react';
import {Share} from 'react-native';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';
import Roles from '../../constants/Social';
import {useContext} from '../../context/AppContext';
import {useContext as useToastContext} from '../../context/ToastContext';
import {removeFromAsyncStorage} from '../../helpers/common';
import {fp} from '../../helpers/responsive';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from '../../storybook';
import {NavigationProps} from '../../types';

const CustomDrawer = (props: any) => {
  const {t} = useTranslation();
  const {user, setIsLogin} = useContext();
  const {Toast} = useToastContext();
  const navigation: NavigationProps = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_CLIENT_ID,
      forceCodeForRefreshToken: true,
      offlineAccess: true,
    });
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        title: 'App link',
        message:
          'Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=nic.goi.eyewear&hl=en',
        url: 'https://play.google.com/store/apps/details?id=nic.goi.eyewear&hl=en',
      });
    } catch (error) {}
  };
  const handleLogout = async () => {
    await removeFromAsyncStorage(['user', 'token', 'cartCount']);
    if (user.login_type === 1) {
      try {
        // Revoke access token and sign out from Google Sign-in
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (err: any) {
        Toast('danger', t('common.error'), err.message);
      }
    }
    setIsLogin(false);
    Toast('info', 'Success !', ' Logged Out Successfully', 2000);
    setTimeout(() => {
      navigation.push('Login');
    }, 100);
  };

  const getImage = () => {
    if (Roles.includes(user.login_type)) {
      // if user login with social login
      return {uri: user?.image};
    } else if (
      !Roles.includes(user.login_type) &&
      user &&
      user?.image !== null
    ) {
      // normal user login
      return {uri: process.env.USER_IMAGE_URL + '/' + user?.image};
    } else {
      return require('../../../assets/images/avatar.jpg');
    }
  };

  return (
    <View className="flex-1">
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: Colors.cprimaryDark}}>
        <ImageBackground
          source={require('../../../assets/images/drawer.jpg')}
          className=" rsheight-h-19">
          <View className="rspaddingHorizontal-w-4 rspaddingTop-h-7">
            <Image
              source={getImage()}
              className="rsheight-h-6 rswidth-h-6 rsborderRadius-h-3"
            />
            <Text className="rsfontSize-f-2 font-bold text-white capitalize">
              {user.name}
            </Text>
          </View>
        </ImageBackground>
        <View className="bg-white rspaddingTop-h-2">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      {/* bottom view */}
      <View className="rspaddingVertical-h-4">
        <View
          className={`rswidth-w-68 rsborderWidth-h-0.05 rsborderColor-${Colors.gray}`}
        />
        <View className="rspaddingTop-h-2 rspaddingHorizontal-w-5">
          <TouchableOpacity className="flex-row rsgap-w-4" onPress={onShare}>
            <AntDesign name="sharealt" size={fp(3)} color={Colors.gray} />
            <Text className={`rsfontSize-f-2.2 rscolor-${Colors.gray}`}>
              {t('drawer.tellfriend')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row rsgap-w-4 rspaddingTop-h-5"
            onPress={handleLogout}>
            <AntDesign name="logout" size={fp(3)} color={Colors.gray} />
            <Text className={`rsfontSize-f-2.2 rscolor-${Colors.gray}`}>
              {t('drawer.signout')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CustomDrawer;
