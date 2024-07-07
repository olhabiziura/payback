import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import api from '../api'; // Import your API module
import { useNavigation } from '@react-navigation/native'; // Import navigation
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import Animated, { Easing, FadeIn, SlideInUp } from 'react-native-reanimated';

const ExpenseDetailsPage = ({ route }) => {
  const { expenseId } = route.params;
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [expenseResponse, userResponse] = await Promise.all([
          api.get(`/api/expenses/${expenseId}/`),
          api.get(`/api/users/me/`)
        ]);

        const expenseData = expenseResponse.data;
        const userData = userResponse.data;

        setExpenseDetails(expenseData);
        setCurrentUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Failed to load expense details'); // Set error message
        setLoading(false);
      }
    };

    fetchDetails();
  }, [expenseId]);

  const handleUserPress = (userId) => {
    navigation.navigate('Profile', { user_id: userId });
  };

  const handlePayBackPress = (expenseId) => {
    navigation.navigate('Payment Page', { expenseId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        style={styles.headerContainer}
        navigation={navigation}
        goBack={true}
        person={true}
        home={true}
        bars={true}
        question={true}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loading} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Animated.View entering={FadeIn.duration(500).easing(Easing.ease)}>
              <Text style={styles.title}>Expense Details</Text>
              <View style={styles.card}>
                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.text}>{expenseDetails.name}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Amount:</Text>
                  <Text style={styles.text}>{expenseDetails.amount}</Text>
                </View>
                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Paid By:</Text>
                  <Text style={styles.text}>{expenseDetails.paidBy}</Text>
                </View>
              </View>
            </Animated.View>
            <Animated.View entering={SlideInUp.duration(500).easing(Easing.ease)}>
              <Text style={styles.subTitle}>Owes:</Text>
              <View style={styles.card}>
                <View style={styles.owesContainer}>
                  {expenseDetails.owes.map((owe, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (owe.registered) {
                          if (owe.user_id === currentUser.id) {
                            handlePayBackPress(expenseId);
                          } else {
                            handleUserPress(owe.user_id);
                          }
                        }
                      }}
                      activeOpacity={0.8}
                      style={[styles.oweItem, !owe.registered && styles.disabled]}
                    >
                      <Text style={[styles.text, styles.oweText, !owe.registered && styles.disabledText]}>
                        {owe.name}: {owe.amount}
                      </Text>
                      {owe.registered && (
                        <View style={styles.iconContainer}>
                          {owe.user_id === currentUser.id ? (
                            <TouchableOpacity onPress={() => handlePayBackPress(expenseId)} style={styles.payBackButton}>
                              <View style={styles.payBackButton}>
                                <Text style={styles.payBackText}>PayBack</Text>
                                <Ionicons name="arrow-forward" size={16} color="#007bff" style={styles.icon} />
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={() => handleUserPress(owe.user_id)} style={styles.iconButton}>
                              <Ionicons name="arrow-forward" size={16} color="#007bff" style={styles.icon} />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Animated.View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#343a40',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  text: {
    fontSize: 18,
    color: '#000',
    marginTop: 5,
  },
  owesContainer: {
    marginTop: 5,
  },
  oweItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007bff',
    marginBottom: 5,
  },
  oweItemText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oweText: {
    fontSize: 16,
    color: '#000',
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  icon: {
    marginLeft: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#777',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight-500 : -50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default ExpenseDetailsPage;
