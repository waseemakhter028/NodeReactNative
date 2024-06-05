import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {
  CartTab,
  HomeTab,
  NotificationTab,
  OrderTab,
  SearchTab,
} from './CustomTabs';
import Colors from '../../constants/Colors';
import {useContext} from '../../context/AppContext';
import {fp, hp, wp} from '../../helpers/responsive';
import HomeScreen from '../../screens/Home';
import CartScreen from '../../screens/tabs/Cart';
import NotificaionScreen from '../../screens/tabs/Notifications';
import OrderScreen from '../../screens/tabs/Order';
import SearchScreen from '../../screens/tabs/Search';
import {StatusBar} from '../../storybook';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  const {cartCount} = useContext();
  return (
    <React.Fragment>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.botLinearOne}
      />
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: Colors.cinputCol,
          tabBarStyle: {
            backgroundColor: Colors.cprimaryDark,
            marginBottom: hp(2),
            height: hp(7),
            borderRadius: hp(5),
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: wp(2),
          },
        }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{
            tabBarIcon: HomeTab,
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="NotificationTab"
          component={NotificaionScreen}
          options={{
            tabBarIcon: NotificationTab,
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchScreen}
          options={{
            tabBarIcon: SearchTab,
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartScreen}
          options={{
            tabBarBadge: cartCount,
            tabBarBadgeStyle: {
              backgroundColor: Colors.lightgreen,
              color: Colors.white,
              marginLeft: wp(2),
              marginBottom: hp(10),
              fontSize: fp(1.3),
            },
            tabBarIcon: CartTab,
            unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="OrderTab"
          component={OrderScreen}
          options={{
            tabBarIcon: OrderTab,
            unmountOnBlur: true,
          }}
        />
      </Tab.Navigator>
    </React.Fragment>
  );
};

export default Tabs;
