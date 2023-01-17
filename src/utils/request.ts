import Axios from 'axios';
import { toast } from '~components/Toast';

const { SNOWPACK_PUBLIC_API_URL } = import.meta.env;

const instance = Axios.create({
  baseURL: SNOWPACK_PUBLIC_API_URL,
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { code, data, message } = response.data;

    if (code) {
      toast({ message: JSON.stringify(message), type: 'error' });
      throw new Error();
    }

    return data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    toast({ type: 'error', message: error.message });
    return Promise.reject(error);
  }
);

export default instance;
