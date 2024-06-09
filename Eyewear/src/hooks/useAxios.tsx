import {useNavigation} from '@react-navigation/native';

import {useContext as useAppContext} from '../context/AppContext';
import {useContext} from '../context/ToastContext';
import axios from '../helpers/axios';
import {
  getFromAsyncStorage,
  removeFromAsyncStorage,
  saveToAsyncStorage,
} from '../helpers/common';
import {NavigationProps} from '../types';

const useAxios = () => {
  const {setIsLogin} = useAppContext();
  const {Toast} = useContext();
  const navigation: NavigationProps = useNavigation();

  const handleLogout = async () => {
    await removeFromAsyncStorage(['user', 'token', 'cartCount']);
    setIsLogin(false);
    Toast('info', 'Expired !', 'Session expired. login again!', 2000);
    setTimeout(() => {
      navigation.push('Login');
    }, 100);
  };

  const resfreshToken = async () => {
    const user = JSON.parse(await getFromAsyncStorage('user'));
    const info = await axios.post('/refreshtoken', {
      user_id: user.id,
    });
    const res = info.data;
    try {
      if (res.success === true) {
        await saveToAsyncStorage({
          user: JSON.stringify(res.data),
          token: JSON.stringify(res.data.api_token),
        });
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const axiosCall = async (url: string, options: any = null) => {
    try {
      let response = await axios(url, options);
      if (response.data.status === 403) {
        await resfreshToken();
        response = await axios(url, options);
      }
      return {data: response.data, error: undefined};
    } catch (err: any) {
      return {data: null, error: err};
    }
  };

  return {axiosCall};
};

export default useAxios;
