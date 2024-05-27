import React, { useState } from 'react';
import {Image, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';


  const handleSignUp = (navigation, username,email,password, repeatPassword) => {
    if (password== repeatPassword && password!=''){
    Alert.alert('Sign Up', `Username: ${username}, Email: ${email}, Password: ${password}`);
    // Navigate to the home screen after successful sign-up
    navigation.navigate('Home Page');
    }
    else{
      Alert.alert('Password doesn\'t match or is empty. \n Please, try again.')
    }
  };

  export default handleSignUp;