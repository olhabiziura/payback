// ChosenNamePopup.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ChosenNamePopup = ({ chosenName, onClose }) => {
  return (
    <View style={styles.popupContainer}>
      <View style={styles.popup}>
        <Text style={styles.popupText}>Chosen Name: <Text style={styles.boldText}>{chosenName}</Text></Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: 100, // Adjust this value as needed to position under the header
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    width: 300,
    height: 150
  },
  popupText: {
    fontSize: 20,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ChosenNamePopup;