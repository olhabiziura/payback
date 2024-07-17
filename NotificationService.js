import { Alert, BackHandler, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import moment from 'moment';
import api from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: askStatus } = await Notifications.requestPermissionsAsync();
    status = askStatus;
    
    if (status !== 'granted') {
        // Show an alert explaining the importance of notifications
        Alert.alert(
          'Notification Permissions Required',
          'Notifications are crucial for this app. Please turn on your notifications.',
          [
            { text: 'Allow Notifications', onPress: () => {
               
                status = 'granted'; // Manually set status to granted
              }
            },
            { text: 'Do not allow', onPress: () => exitApp() },
          ],
          { cancelable: false }
        );
        return;
      }
    }
  // Get the token that uniquely identifies this device
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);
};

const scheduleNotification = async (expense) => {
  try {
    const registrationDate = moment(expense['date_of_registration']);
    //const notificationDate = registrationDate.clone().add(3, 'minutes').toDate(); // Convert to Date object
    const now = new Date();
    const notificationDate = new Date(now.getTime() + 7210000); // Example: Add 10 seconds
    if (notificationDate <= new Date()) {
      console.log('Notification date is in the past');
      return;
    }
    
    

    const notificationDateUTC = moment(notificationDate).utc().toDate();

    const schedulingOptions = {
      content: {
        title: 'Expense Reminder',
        body: `Reminder: You have an expense named ${expense.name} of ${expense.amount} to pay.`,
      },
      trigger: {
        date: notificationDateUTC, // Use the UTC date
      },
    };

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync(schedulingOptions);
    console.log('Notification scheduled for', notificationDateUTC);
  } catch (error) {
    console.error('Error scheduling notification for expense:', expense, error);
  }
};

const fetchExpensesAndScheduleNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.log('No token found. Unable to fetch expenses and schedule notifications.');
      return;
    }

    const response = await api.get('/api/user-owes/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    data.forEach(expense => scheduleNotification(expense));
  } catch (error) {
    console.error('Error fetching expenses or scheduling notifications:', error);
  }
};

const exitApp = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      Alert.alert(
        'Exit',
        'You cannot proceed unless you agree to notifications.',
        [
          { text: 'OK', onPress: () => registerForPushNotificationsAsync() },
        ],
        { cancelable: false }
      );
    }
  };
export { registerForPushNotificationsAsync, fetchExpensesAndScheduleNotifications };
