import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import HomePage from './Pages/HomePage';
import HomeScreen from './Pages/HomeScreen';
import ProfileScreen from './Pages/ProfileScreen';
import AboutScreen from './Pages/AboutScreen';

import SignUpScreen from './Pages/SignUpScreen';
import LogInScreen from './Pages/LogInScreen';
import AfterSignUpScreen from './Pages/AfterSignUpScreen';

import BarGraphScreen from './Pages/BarGraphScreen';
import BarGraphGroup from './Pages/BarGraphGroup';

import GroupExpensesScreen from './Pages/GroupExpensesScreen';
import AddGroupScreen from './Pages/AddGroupScreen';
import GroupDetailsPage from './Pages/GroupScreen';
import MembersPage from './Pages/MembersScreen';
import AddExpensePage from './Pages/AddExpenseScreen';
import AddFriendPage from './Pages/AddFriendScreen';
import ExpenseDetailsPage from './Pages/ExpenseScreen';
import SpinWheelGame from './Pages/SpeenWheel';


import ReceiptScan from './Pages/ReceiptScanScreen';
import ReceiptScanGroup from './Pages/ReceiptScanGroup';
import ReceiptScanAddGroup from './Pages/ReceiptScanAddGroup';
import ReceiptScanAddExpense from './Pages/ReceiptScanAddExpenses';

import Notifications from 'expo';
import moment from 'moment';
import api from './api';
import { registerForPushNotificationsAsync, fetchExpensesAndScheduleNotifications } from './NotificationService';

import PaymentForm from './Pages/PayPage';



const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [token, setToken] = useState(null); // State to store the token
  const [refreshing, setRefreshing] = useState(false);




  {/*
    useEffect(() => {
      const subscription = Notifications.addNotificationReceivedListener(handleNotification);
      
      return () => {
        subscription.remove(); // Clean up listener on component unmount
      };
    }, []);
  
    const handleNotification = (notification) => {
      console.log('Notification received in foreground:', notification);
      // Handle the notification data programmatically here
    };
  
  */}

  useEffect(() => {
    const resetToken = async () => {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        console.log('Token removed');
      } catch (error) {
        console.error('Error removing token:', error);
      }
    };

    resetToken(); // Reset the token on app start
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        // Check token expiration
        const tokenExpireTime = decodeToken(storedToken).exp * 1000; // Convert to milliseconds
        const currentTime = new Date().getTime();

        if (tokenExpireTime < currentTime) {
          // Token is expired, refresh it
          await refreshAccessToken();
        }

        setToken(storedToken); // Set the token in state
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

 
 
    

  if (loading) {
    return <View style={styles.container} />; // Loading indicator or splash screen
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <>
          <Stack.Screen name="Log In" component={LogInScreen} />
          <Stack.Screen name="Sign Up" component={SignUpScreen} />
          <Stack.Screen name="After Sign Up" component={AfterSignUpScreen} />
          
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Home Page" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Groups" component={GroupExpensesScreen} />

          <Stack.Screen name="BarGraph" component={BarGraphScreen} />
          <Stack.Screen name="BarGraph for group" component={BarGraphGroup} />

          <Stack.Screen name="AddGroup" component={AddGroupScreen} />
          <Stack.Screen name="GroupDetails" component={GroupDetailsPage} />
          <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsPage} />
          <Stack.Screen name="MembersPage" component={MembersPage} />
          <Stack.Screen name="AddExpensePage" component={AddExpensePage} />
          <Stack.Screen name="AddFriends" component={AddFriendPage} />
          <Stack.Screen name="SpinWheel" component={SpinWheelGame} />
          <Stack.Screen name="Payment Page" component={PaymentForm} />

          <Stack.Screen name="Receipt Scan" component={ReceiptScan} />
          <Stack.Screen name="ReceiptScan choose group" component={ReceiptScanGroup} />
          <Stack.Screen name="ReceiptScan add group" component={ReceiptScanAddGroup} />
          <Stack.Screen name="ReceiptScan add expenses" component={ReceiptScanAddExpense} />

        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
