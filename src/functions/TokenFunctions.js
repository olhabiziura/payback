import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';

const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        console.log('Token retrieved successfully:', token);
        return token;
      } else {
        console.log('No token found');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  
  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token cleared successfully');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  
export default [storeToken, getToken,  clearToken];