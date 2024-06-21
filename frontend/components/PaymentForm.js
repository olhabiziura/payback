// PaymentForm.js

import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const PaymentForm = () => {
  const { confirmPayment } = useStripe();

  const [recipientIban, setRecipientIban] = useState('');
  const [amount, setAmount] = useState('');
  const [cardDetails, setCardDetails] = useState({
    complete: false,
    postalCode: '',
    value: '',
  });

  const handlePayment = async () => {
    try {
      const { clientSecret, error } = await axios.post(
        'https://your-backend-server.com/create-payment-intent',
        {
          amount: parseInt(amount),
          currency: 'eur',
        }
      );

      if (error) {
        console.error('Failed to create payment intent:', error.message);
        return;
      }

      const { paymentIntent, error: paymentError } = await confirmPayment({
        clientSecret,
        paymentMethod: {
          type: 'Card',
          card: cardDetails.value,
        },
      });

      if (paymentError) {
        console.error('Payment confirmation error:', paymentError.message);
        Alert.alert('Payment Failed', paymentError.message);
      } else if (paymentIntent) {
        console.log('Payment successful:', paymentIntent);
        Alert.alert('Payment Successful', 'Payment successfully processed.');
        // Optionally, handle navigation or other actions upon successful payment
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Recipient's IBAN"
        value={recipientIban}
        onChangeText={setRecipientIban}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Amount (in EUR)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: 'Card Number',
        }}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
      />
      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};

export default PaymentForm;
