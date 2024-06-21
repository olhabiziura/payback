import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import api from '../api'; // Import your API module
import { useNavigation } from '@react-navigation/native'; // Import navigation
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';

const ExpenseDetailsPage = ({ route }) => {
  const { expenseId } = route.params;
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar style={styles.header_container} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar style={styles.header_container} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />

      <View style={styles.container}>
        {expenseDetails ? (
          <>
            <Text style={styles.title}>Expense Details</Text>
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
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Owes:</Text>
              <View style={styles.owesContainer}>
                {expenseDetails.owes.map((owe, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => owe.registered && handleUserPress(owe.user_id)}
                    activeOpacity={0.8}
                    style={[styles.oweItem, !owe.registered && styles.disabled]}
                  >
                    <Text style={[styles.text, styles.oweText, !owe.registered && styles.disabledText]}>
                      {owe.name}: {owe.amount}
                    </Text>
                    {owe.registered && currentUser && (
                      <View style={styles.iconContainer}>
                        {owe.user_id === currentUser.id && (
                          <TouchableOpacity onPress={() => handlePayBackPress(expenseId)} style={styles.payBackButton}>
                            <Text style={styles.payBackText}>PayBack</Text>
                          </TouchableOpacity>
                        )}
                        <Ionicons name="arrow-forward" size={16} color="#007bff" style={styles.icon} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  detailContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  text: {
    fontSize: 18,
    color: '#000',
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
    marginBottom: 10,
  },
  oweText: {
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payBackButton: {
    marginRight: 10,
  },
  payBackText: {
    fontSize: 16,
    color: '#007bff',
  },
  icon: {
    marginLeft: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: 'black',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS === 'IOS' ? StatusBar.currentHeight : -50,
  },
});

export default ExpenseDetailsPage;
