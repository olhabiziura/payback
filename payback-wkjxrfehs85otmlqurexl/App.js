import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import  HomeScreen  from './Pages/HomeScreen';
import ProfileScreen  from './Pages/ProfileScreen';
import AboutScreen from './Pages/AboutScreen';
import SignUpScreen from './Pages/SignUpScreen';
import LogInScreen from './Pages/LogInScreen';
import BarGraphScreen from './Pages/BarGraphScreen';

import axios from 'axios';
import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen name="Sign Up" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Log In" component={LogInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home Page" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BarGraph" component={BarGraphScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
