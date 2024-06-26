import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';

import CustomDrawer from './CustomDrawer';
import {
  AboutUsDrawer,
  AddressDrawer,
  ContactUsDrawer,
  CouponDrawer,
  HomeDrawer,
  LanguageDrawer,
  ProfileDrawer,
} from './CustomDrawerItem';
import Colors from '../../constants/Colors';
import {fp, wp} from '../../helpers/responsive';
import AboutUsScreen from '../../screens/dashboard/AboutUs';
import AddressScreen from '../../screens/dashboard/Address';
import ContactUsScreen from '../../screens/dashboard/ContactUs';
import CouponScreen from '../../screens/dashboard/Coupon';
import HomeScreen from '../../screens/dashboard/Home';
import LanguageScreen from '../../screens/dashboard/Language';
import ProfileScreen from '../../screens/dashboard/Profile';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
  const {t} = useTranslation();
  return (
    <Drawer.Navigator
      initialRouteName="ProfileDrawer"
      drawerContent={CustomDrawer}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.white,
        drawerActiveBackgroundColor: Colors.cprimaryDark,
        drawerInactiveTintColor: Colors.gray,
        drawerInactiveBackgroundColor: Colors.white,
        drawerLabelStyle: {
          marginLeft: wp(-4),
          fontWeight: '700',
          fontSize: fp(1.8),
        },
      }}>
      <Drawer.Screen
        name="ProfileDrawer"
        component={ProfileScreen}
        options={{
          title: t('drawer.profile'),
          drawerIcon: ProfileDrawer,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeScreen}
        options={{
          title: t('drawer.home'),
          drawerIcon: HomeDrawer,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AddressDrawer"
        component={AddressScreen}
        options={{
          title: t('drawer.address'),
          drawerIcon: AddressDrawer,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="CouponDrawer"
        component={CouponScreen}
        options={{
          title: t('drawer.coupon'),
          drawerIcon: CouponDrawer,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AboutUsDrawer"
        component={AboutUsScreen}
        options={{
          title: t('drawer.aboutus'),
          drawerIcon: AboutUsDrawer,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="ContactUsDrawer"
        component={ContactUsScreen}
        options={{
          title: t('drawer.contactus'),
          drawerIcon: ContactUsDrawer,
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="LanguageDrawer"
        component={LanguageScreen}
        options={{
          title: t('drawer.language'),
          drawerIcon: LanguageDrawer,
          unmountOnBlur: true,
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
