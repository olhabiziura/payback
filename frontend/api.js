import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({

  baseURL: //'http://192.168.0.110:8000'
  //'http://192.168.1.235:8000'
  //'http://192.168.1.77:8000/',
  //'http://10.37.224.202:8000'
  //'http://192.168.1.227:8000'
 //'http://172.20.10.4:8000'
 'http://192.168.254.226:8000'
  
    // Replace with your local IP address
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessToken();
      return api(originalRequest); // Retry original request with new token
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    const response = await axios.post(
      'https://your-api-base-url.com/api/token/refresh/',
      { refresh: refreshToken }
    );
    const newToken = response.data.access;
    await AsyncStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    throw error;
  }
};

export default api;
