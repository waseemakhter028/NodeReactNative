import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import Colors from '../constants/Colors';
import OrderStatus from '../constants/OrderStatus';

export const saveToAsyncStorage = async (data: any) => {
  try {
    for (const key in data) {
      await AsyncStorage.setItem(key, JSON.stringify(data[key]));
    }
  } catch (e) {
    throw new Error('AsynStorage Save Error===' + e);
  }
};

export const getFromAsyncStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return undefined;
  } catch (e) {
    throw new Error('AsynStorage Get Error===' + e);
  }
};

export const removeFromAsyncStorage = async (data: any) => {
  try {
    for (const key of data) {
      await AsyncStorage.removeItem(key);
    }
  } catch (e) {
    throw new Error('AsynStorage Remove Error===' + e);
  }
};

export const orderStatusByNumber = (status: string) => {
  let orderStatus = '';
  switch (Number(status)) {
    case 1:
      orderStatus = 'Placed';
      break;
    case 2:
      orderStatus = 'Confirmed';
      break;
    case 3:
      orderStatus = 'Shipped';
      break;
    case 4:
      orderStatus = 'Delivered';
      break;
    default:
      orderStatus = 'Placed';
      break;
  }
  return orderStatus;
};

export const statusColor = (status: string) => {
  let color = '';
  switch (status) {
    case OrderStatus.order_placed:
      color = Colors.cred;
      break;
    case OrderStatus.order_confirmed:
      color = Colors.lightgreen;
      break;
    case OrderStatus.order_shipped:
      color = Colors.cblue;
      break;
    case OrderStatus.order_delivered:
      color = Colors.cprimaryDark;
      break;
    default:
      color = Colors.cprimaryDark;
      break;
  }
  return color;
};

export const statusButtonColor = (status: string) => {
  let color = '';
  switch (Number(status)) {
    case 1:
      color = Colors.bgAmber;
      break;
    case 2:
      color = Colors.lightgreen;
      break;
    case 3:
      color = Colors.cblue;
      break;
    case 4:
      color = Colors.cprimaryDark;
      break;
    default:
      color = Colors.cprimaryDark;
      break;
  }
  return color;
};

const getHrWeekMonYr = (d: number, w: number, m: number, y: number) => {
  let format = '';
  if (d > 0 && w === 0) {
    format = d + ' ' + (d > 1 ? 'days' : 'day');
  } else if (w > 0 && m === 0) {
    format = w + ' ' + (w > 1 ? 'weeks' : 'week');
  } else if (m > 0 && y === 0) {
    format = m + ' ' + (m > 1 ? 'months' : 'month');
  } else if (y > 0) {
    format = y + ' ' + (y > 1 ? 'years' : 'year');
  }
  return format;
};

export const showNotifiDate = (getDate: Date) => {
  const notifiDate = moment.utc(getDate).local();

  const curDate = moment.utc(moment()).local();
  let format = '';
  const s = curDate.diff(notifiDate, 'seconds');
  const i = curDate.diff(notifiDate, 'minutes');
  const h = curDate.diff(notifiDate, 'hours');
  const d = curDate.diff(notifiDate, 'days');
  const w = curDate.diff(notifiDate, 'weeks');
  const m = curDate.diff(notifiDate, 'months');
  const y = curDate.diff(notifiDate, 'years');

  if (s > 0 && i === 0) {
    format = s + ' ' + (s > 1 ? 'seconds' : 'second');
  } else if (i > 0 && h === 0) {
    format = i + ' ' + (i > 1 ? 'minutes' : 'minute');
  } else if (h > 0 && d === 0) {
    format = h + ' ' + (h > 1 ? 'hours' : 'hour');
  } else {
    format += getHrWeekMonYr(d, w, m, y);
  }

  format += ' ago';

  return format;
};

export const rand = (min = 1000000000, max = 9999999999) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
