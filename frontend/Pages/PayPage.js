import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Platform, StatusBar } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import api from '../api'; // Assuming this is correctly importing your Axios instance
import { StripeWrapper } from '../config/stripeConfig';
import HeaderBar from '../components/HeaderBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, Easing } from 'react-native-reanimated'; // Correctly importing Animated

const PaymentForm = ({ navigation, route }) => {
  const { confirmPayment } = useStripe();

  const { expenseDetails, userDetails } = route.params || {};

  const [recipientIban, setRecipientIban] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [cardDetails, setCardDetails] = useState(null);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userDetails?.user_id ) {
        return;
      }

      try {
        const response = await api.get(`/api/user-profile/${userDetails.user_id}/`);
        const profileData = response.data;

        setName(profileData.user.first_name);
        setSurname(profileData.user.last_name);
        setPaymentDetails(profileData.iban);

        setRecipientIban(profileData.iban);
        setRecipientName(`${profileData.user.first_name} ${profileData.user.last_name}`);
        setAmount(expenseDetails.amount.toString());
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userDetails, expenseDetails]);

  const handlePayment = async () => {
    try {
      if (!cardDetails?.complete) {
        Alert.alert('Incomplete Card Details', 'Please complete the card details.');
        return;
      }

      const { data, error } = await api.post('/process-payment-and-payout/', {
        amount: parseFloat(amount),
        currency: 'eur',
        iban: recipientIban,
        name: recipientName,
        cardDetails: cardDetails,
      });

      if (error) {
        console.error('Failed to process payment and payout:', error.message);
        return;
      }

      if (data.status === 'success') {
        Alert.alert('Payment and Payout Successful', 'Payment and payout successfully processed.');
      } else {
        Alert.alert('Payment and Payout Failed', data.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StripeWrapper>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                  <View style={styles.detailContainer}>
                    <Text style={styles.separator}>~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~</Text>
                    <Text style={styles.title1}>Enter your card details or use stored information to quickly and easily PayBack your debts!</Text>
                  </View>
                </View>
                <View style={styles.formContainer}>
                  <Text style={styles.header}>Pay for {expenseDetails?.name}</Text>
                  <TextInput
                    placeholder="Recipient's IBAN"
                    value={recipientIban}
                    onChangeText={setRecipientIban}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Recipient's Name"
                    value={recipientName}
                    onChangeText={setRecipientName}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Amount (in EUR)"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                      number: 'Card Number',
                    }}
                    onCardChange={(details) => setCardDetails(details)}
                    style={styles.cardField}
                  />
                  <Button title="Pay and Payout" onPress={handlePayment} color="#2471A3" />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </StripeWrapper>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
    padding: 0,
    marginTop: -100,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2471A3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  cardField: {
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2471A3',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
    marginBottom: 20,
  },
  detailContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  separator: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: '#ccc',
  },
  title1: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
});

export default PaymentForm;
