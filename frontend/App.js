import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, AuthContext } from './AuthContext';
import { StyleSheet, Text, View, Image } from 'react-native';

import HomeScreen from './Pages/HomeScreen';
import ProfileScreen from './Pages/ProfileScreen';
import AboutScreen from './Pages/AboutScreen';
import SignUpScreen from './Pages/SignUpScreen';
import LogInScreen from './Pages/LogInScreen';
import BarGraphScreen from './Pages/BarGraphScreen';
import GroupExpensesScreen from './Pages/GroupExpensesScreen';
import AddGroupScreen from './Pages/AddGroupScreen';
import GroupDetailsPage from './Pages/GroupScreen';
import MembersPage from './Pages/MembersScreen';
import AddExpensePage from './Pages/AddExpenseScreen';
import {useAuth } from './src/functions/status';//checks the suthentication status
import AddFriendPage from './Pages/AddFriendScreen';
import ExpenseDetailsPage from './Pages/ExpenseScreen';
import SpinWheelGame from './Pages/SpeenWheel';

const Stack = createStackNavigator();


const resetToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    console.log('Token removed');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

const refreshAccessToken = async () => {
  try {
    // Retrieve the refresh token from storage
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    // Make a request to the server to refresh the access token
    const response = await api.post('/api/refresh-token', { refreshToken });

    // If the refresh token is valid, update the access token
    if (response.status === 200) {
      const { accessToken } = response.data;

      // Store the new access token
      await AsyncStorage.setItem('token', accessToken);
      console.log('Access token refreshed');
    } else {
      // Handle error: Unable to refresh token
      console.error('Unable to refresh access token');
    }
  } catch (error) {
    // Handle error: Network error, server error, etc.
    console.error('Error refreshing access token:', error);
  }
};

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetToken(); // Reset the token on app start
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Check token expiration
        const tokenExpireTime = decodeToken(token).exp * 1000; // Convert to milliseconds
        const currentTime = new Date().getTime();

        if (tokenExpireTime < currentTime) {
          // Token is expired, refresh it
          await refreshAccessToken();
        }

        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return null; // You can return a loading spinner here
  }
  //console.log(isAuthenticated);

  return (
    
      <NavigationContainer>
        <Stack.Navigator>
          
            <>
              <Stack.Screen name="Sign Up" component={SignUpScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Log In" component={LogInScreen} options={{ headerShown: false }} />
              <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Home Page" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Groups" component={GroupExpensesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="BarGraph" component={BarGraphScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AddGroup" component={AddGroupScreen} />
              <Stack.Screen name="GroupDetails" component={GroupDetailsPage} />
              <Stack.Screen name="ExpenseDetails" component={ExpenseDetailsPage} />
              <Stack.Screen name="MembersPage" component={MembersPage} />
              <Stack.Screen name="AddExpensePage" component={AddExpensePage} />
              <Stack.Screen name="AddFriends" component={AddFriendPage} />
              <Stack.Screen name="SpinWheel" component={SpinWheelGame} />
            </>
          
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
