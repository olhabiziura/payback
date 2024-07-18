import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,ScrollView,Platform,StatusBar, SafeAreaView } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import api from '../api'; // Assuming this is correctly importing your Axios instance
import { StripeWrapper } from '../config/stripeConfig';
import HeaderBar from '../components/HeaderBar';
const PaymentForm = ({ navigation }) => {
    
    const { confirmPayment } = useStripe();

  const [recipientIban, setRecipientIban] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [cardDetails, setCardDetails] = useState(null);
 
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
    <View style = {styles.safeArea}>

    <StripeWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.header}>Payment Form</Text>
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
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
    marginTop: '-30%',
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
});

export default PaymentForm;