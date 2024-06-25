import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {useContext} from '../../context/AppContext';
import ForgotPasswordScreen from '../../screens/auth/ForgotPassword';
import LoginScreen from '../../screens/auth/Login';
import SignUpScreen from '../../screens/auth/SignUp';
import SignUpVerifyScreen from '../../screens/auth/SignUpVerify';
import Checkout from '../../screens/Checkout';
import DisplayOrderPdf from '../../screens/DisplayOrderPdf';
import ProductDetailScreen from '../../screens/ProductDetails';
import WelcomeScreen from '../../screens/Welcome';
import Drawer from '../drawer';
import Tabs from '../tabs';

const Stack = createStackNavigator();

const AppStack = () => {
  const {isLogin, signUpVerify, isCheckout} = useContext();
  return (
    <Stack.Navigator
      initialRouteName={isLogin ? 'Home' : 'Welcome'}
      screenOptions={{headerShown: false}}>
      {isLogin ? (
        <React.Fragment>
          <Stack.Screen name="Home" component={Tabs} />
          <Stack.Screen name="Dashboard" component={Drawer} />
          <Stack.Screen name="ProductDetails" component={ProductDetailScreen} />
          {isCheckout && <Stack.Screen name="Checkout" component={Checkout} />}
          <Stack.Screen name="DisplayOrderPdf" component={DisplayOrderPdf} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          {signUpVerify.verify && (
            <Stack.Screen name="SignUpVerify" component={SignUpVerifyScreen} />
          )}
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
};

export default AppStack;
