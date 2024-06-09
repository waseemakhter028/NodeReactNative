import React, {
  createContext,
  ReactNode,
  useContext as ReactUseContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {getFromAsyncStorage} from '../helpers/common';

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
}

// Create the context with a default value (can be null initially)
const AppContext = createContext<MyContextType | null>(null);

// Define a provider component
export const AppContextProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
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

  const checkAlreadyLogin = async () => {
    const token = await getFromAsyncStorage('token');
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
    ],
  );

  // Return the provider with the context value
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook to consume the context
export const useContext = (): any => {
  const context = ReactUseContext(AppContext);
  if (!context) {
    throw new Error('useContext must be used within a CartContextProvider');
  }
  return context;
};
