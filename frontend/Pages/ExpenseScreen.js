import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import api from '../api'; // Import your API module
import { useNavigation } from '@react-navigation/native'; // Import navigation

const ExpenseDetailsPage = ({ route }) => {
  const { expenseId } = route.params;
  const [expenseDetails, setExpenseDetails] = useState(null);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const fetchExpenseDetails = async () => {
      try {
        const response = await api.get(`/api/expenses/${expenseId}/`);
        const data = response.data;
        setExpenseDetails(data);
      } catch (error) {
        console.error('Error fetching expense details:', error);
      }
    };

    fetchExpenseDetails();
  }, [expenseId]);

  const handleUserPress = (userId) => {
    navigation.navigate('Profile', { user_id: userId });
  };

  return (
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
                  {owe.registered && (
                    <Ionicons name="arrow-forward" size={16} color="#007bff" style={styles.icon} />
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
  },
  oweText: {
    fontSize: 16,
    color: 'red', // Change text color to black
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
});

export default ExpenseDetailsPage;
