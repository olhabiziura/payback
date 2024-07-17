import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import HeaderBar from '../components/HeaderBar';
import api from '../api';

const ReceiptScan = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
      Alert.alert("Permission Denied", "You've refused to allow this app to access your camera or media library!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const confirmAndSend = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('receipt', {
      uri: image,
      name: 'receipt.jpg',
      type: 'image/jpeg',
    });

    try {
      setUploading(true);
      const response = await api.post('/scan-receipt/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploading(false);
      Alert.alert('Receipt uploaded successfully!');
      navigation.navigate('ReceiptScan choose group', { data: response.data.items });
    } catch (error) {
      console.error('Error uploading receipt:', error);
      setUploading(false);
      Alert.alert('Failed to upload receipt');
      // Mock data to navigate to next screen for demo purposes
      const groupdata = {
        id: 113,
        name: 'DisneyLand',
        members: [
          { id: 224, name: 'tsion' },
          { id: 225, name: 'ezgi' },
          { id: 226, name: 'olhabiziura' },
          { id: 227, name: 'rossgeller' },
        ],
        expenses: []
      };
      const data = {
        currency: 'EUR',
        items: [
          { amount: 4.45, description: 'MOJITO 14 ° 70CVI' },
          { amount: 0.05, description: 'TOT. ALTRI SCONTI' },
          { amount: 2.99, description: 'BELLINI APERITIVO 5VI' },
          { amount: 1.09, description: 'PATATINE STICKVI' },
          { amount: 1.35, description: 'PATATINE PAPRIKA200GVI' },
          { amount: 2.19, description: 'LAMBRUSCO AMABILE IGVI' }
        ],
        total: 12.07
      };
      navigation.navigate('ReceiptScan add expenses', { groupdata, data });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} title={'Receipt Scanner'} />
      <View style={styles.container}>
        <Text style={styles.description}>
          Welcome to the receipt scanner feature! Take a picture of your receipt and we'll handle the rest.
        </Text>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity onPress={confirmAndSend} style={[styles.button, styles.confirmButton]}>
              <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Confirm and Send'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS === 'IOS' ? StatusBar.currentHeight : -50,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#2471A3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#28a745', // Green color for confirmation
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default ReceiptScan;
