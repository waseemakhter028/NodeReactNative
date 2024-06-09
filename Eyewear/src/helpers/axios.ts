import axios from 'axios';
import moment from 'moment';

import {getFromAsyncStorage} from './common';

// Create a new instance of Axios
const customAxios = axios.create({
  baseURL: process.env.API_URL, // Set your base URL
  timeout: 50000, // Set a timeout for requests (in milliseconds)
  // Sample data to include in all requests
  data: null,
});

// Add interceptors for request and response
customAxios.interceptors.request.use(
  async config => {
    config.headers.set(
      'Content-Type',
      config.url === '/uploadimage'
        ? 'multipart/form-data'
        : 'application/json',
    );

    config.headers.set(
      'Authorization',
      (await getFromAsyncStorage('token'))
        ? JSON.parse(await getFromAsyncStorage('token'))
        : '',
    );
    config.headers.set('Accept-Language', 'en');
    config.headers.set('timezone', moment.tz.guess(true));
    return config;
  },
  error => {
    // Handle request errors
    return Promise.reject(error);
  },
);

customAxios.interceptors.response.use(
  async response => {
    return response;
  },
  error => {
    // Handle response errors
    return Promise.reject(error);
  },
);

export default customAxios;
