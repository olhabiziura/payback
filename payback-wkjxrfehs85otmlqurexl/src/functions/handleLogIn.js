import React, { useState } from 'react';
import {Image, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';



  const handleLogIn = (navigation, username,password) => {
    // Add your sign-up logic heres
    Alert.alert('Log In', `Username: ${username}, Password: ${password}`);
    // Navigate to the home screen after successful sign-up
    navigation.navigate('Home Page');
  };

export default handleLogIn;