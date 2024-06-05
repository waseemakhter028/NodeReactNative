import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import CustomDrawer from './CustomDrawer';
import {
  AboutUsDrawer,
  AddressDrawer,
  ContactUsDrawer,
  CouponDrawer,
  HomeDrawer,
  ProfileDrawer,
} from './CustomDrawerItem';
import Colors from '../../constants/Colors';
import {fp, wp} from '../../helpers/responsive';
import AboutUsScreen from '../../screens/dashboard/AboutUs';
import AddressScreen from '../../screens/dashboard/Address';
import ContactUsScreen from '../../screens/dashboard/ContactUs';
import CouponScreen from '../../screens/dashboard/Coupon';
import HomeScreen from '../../screens/dashboard/Home';
import ProfileScreen from '../../screens/dashboard/Profile';

const Drawer = createDrawerNavigator();

const AppDrawer = () => {
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
          title: 'Profile',
          drawerIcon: ProfileDrawer,
        }}
      />
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerIcon: HomeDrawer,
        }}
      />
      <Drawer.Screen
        name="AddressDrawer"
        component={AddressScreen}
        options={{
          title: 'Address',
          drawerIcon: AddressDrawer,
        }}
      />
      <Drawer.Screen
        name="CouponDrawer"
        component={CouponScreen}
        options={{
          title: 'Coupon',
          drawerIcon: CouponDrawer,
        }}
      />
      <Drawer.Screen
        name="AboutUsDrawer"
        component={AboutUsScreen}
        options={{
          title: 'About Us',
          drawerIcon: AboutUsDrawer,
        }}
      />
      <Drawer.Screen
        name="ContactUsDrawer"
        component={ContactUsScreen}
        options={{
          title: 'Contact Us',
          drawerIcon: ContactUsDrawer,
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
