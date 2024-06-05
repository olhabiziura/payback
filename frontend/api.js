import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({

  baseURL: //'http://192.168.1.235:8000'
  'http://192.168.1.77:8000/',  // Replace with your local IP address
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    
    if (token && !config.url.includes('/login/') && !config.url.includes('/register/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
