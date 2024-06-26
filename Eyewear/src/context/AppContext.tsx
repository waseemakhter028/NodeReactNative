import React, {
  createContext,
  ReactNode,
  useContext as ReactUseContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {useTranslation} from 'react-i18next';

import {getFromAsyncStorage, saveToAsyncStorage} from '../helpers/common';

// Define a type for the context value
interface MyContextType {
  user: object;
  setUser: (open: object) => void;
  isOpenDrawer: boolean;
  setIsOpenDrawer: (open: boolean) => void;
  isLogin: boolean;
  setIsLogin: (login: boolean) => void;
  signUpVerify: object;
  setSignUpVerify: any;
  cartCount: number;
  setCartCount: (count: number) => void;
  isCheckout: boolean;
  setIsCheckout: (isCheckout: boolean) => void;
  currentRoute: string;
  setCurrentRoute: (routeName: string) => void;
  isConnected: boolean;
  setIsConnected: (connection: boolean) => void;
}

// Create the context with a default value (can be null initially)
const AppContext = createContext<MyContextType | null>(null);

// Define a provider component
export const AppContextProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const {i18n} = useTranslation();
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<any>('');
  const [signUpVerify, setSignUpVerify] = useState<object>({
    verify: false,
    email: '',
  });
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCheckout, setIsCheckout] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const checkAlreadyLogin = async () => {
    const token = await getFromAsyncStorage('token');
    const language = await getFromAsyncStorage('language');
    // setting app language
    if (language && language !== undefined) {
      i18n.changeLanguage(language);
    } else {
      // setting default app language
      await saveToAsyncStorage({
        language: 'en',
      });
      i18n.changeLanguage('en');
    }

    if (token && token !== undefined) {
      setIsLogin(true);
      const loginUser = await getFromAsyncStorage('user');
      if (loginUser && loginUser !== undefined) {
        setUser(JSON.parse(loginUser));
      }
    }
  };

  useEffect(() => {
    checkAlreadyLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: MyContextType = useMemo(
    () => ({
      isOpenDrawer,
      setIsOpenDrawer,
      isLogin,
      setIsLogin,
      user,
      setUser,
      signUpVerify,
      setSignUpVerify,
      cartCount,
      setCartCount,
      isCheckout,
      setIsCheckout,
      currentRoute,
      setCurrentRoute,
      isConnected,
      setIsConnected,
    }),
    [
      isOpenDrawer,
      setIsOpenDrawer,
      isLogin,
      setIsLogin,
      user,
      setUser,
      signUpVerify,
      setSignUpVerify,
      cartCount,
      setCartCount,
      isCheckout,
      setIsCheckout,
      currentRoute,
      setCurrentRoute,
      isConnected,
      setIsConnected,
    ],
  );

  // Return the provider with the context value
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook to consume the context
export const useContext = (): any => {
  const context = ReactUseContext(AppContext);
  if (!context) {
    throw new Error('useContext must be used within a AppContextProvider');
  }
  return context;
};
