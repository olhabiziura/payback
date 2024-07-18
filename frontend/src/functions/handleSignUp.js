import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import React from 'react';
import handleLogIn from './handleLogIn';
import {  registerForPushNotificationsAsync,fetchExpensesAndScheduleNotifications } from '../../NotificationService';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';

import axios from 'axios';
const handleSignUp = async (navigation, username, email, password, repeatPassword, isAuthenticated, setIsAuthenticated) => {
  if (password === repeatPassword && password !== '') {
    try {
      console.log("Entering handleSignUp function");
      
      // Log the request data for debugging
      console.log("Sending data:", { username, email, password });
      
      const response = await api.post('api/register/', {
        username: username,
        email: email,
        password: password,
      });

        // Native Notify Indie Push Registration Code
       registerIndieID('put your unique user ID here as a string', 22426, 'VocpCXxZk1RDjvw07p3mXF');
    // End of Native Notify Code
      console.log('Registration is successful');

      registerForPushNotificationsAsync();
      fetchExpensesAndScheduleNotifications();
      //navigation.navigate('After Sign Up')
      handleLogIn(navigation,username,password,isAuthenticated,setIsAuthenticated);
      

    } catch (error) {
      console.error('Registration error:', error);

      // Display detailed error message
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let errorMessage = 'Registration Error:\n';
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessage += `${key}: ${errors[key]}\n`;
          }
        }
        Alert.alert(errorMessage);
      } else {
        Alert.alert('Registration Error', 'An unknown error occurred. Please try again.');
      }
    }

  } else {
    Alert.alert('Password doesn\'t match or is empty. Please, try again.');
  }
};

export default handleSignUp;
