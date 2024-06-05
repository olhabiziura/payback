import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import React from 'react';

const handleLogIn = async (navigation, username, password, isAuthenticated, setIsAuthenticated) => {
  try {
    console.log("Entering handleLogIn function");

    const response = await api.post('api/login/', {
      username: username,
      password: password
    });

    const { access, refresh } = response.data;
    console.log('Login successful, received tokens:', { access, refresh });

    // Store tokens
    await AsyncStorage.setItem('token', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    
    // Set authentication to true
    setIsAuthenticated(true);
    console.log(isAuthenticated);

    // Navigate to the home screen after successful log-in
    navigation.navigate("Home Page");

  } catch (error) {
    console.error('Login error:', error);

    // Display detailed error message
    if (error.response && error.response.data) {
      const errors = error.response.data;
      let errorMessage = 'Login Error:\n';
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          errorMessage += `${key}: ${errors[key]}\n`;
        }
      }
      Alert.alert('Login Failed', errorMessage);
    } else {
      Alert.alert('Login Error', 'An unknown error occurred. Please try again.');
    }
  }
};

export default handleLogIn;
