
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import HeaderBar from '../components/HeaderBar';
import api from '../api';
const ReceiptScan = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState(null);
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

    if (!result.canceled) {
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
        alert('Receipt uploaded successfully!');
        // Handle the response as needed
        console.log('Response:', response.data); // Log the response to the console
        setData(response.data['items'])
        console.log(data)
        navigation.navigate('ReceiptScan choose group', {data})
      } catch (error) {
        console.error('Error uploading receipt:', error);
        setUploading(false);
        alert('Failed to upload receipt');
        const groupdata = {
            "id": 113,
            "name": "DisneyLand",
            "members": [
              {"id": 224, "name": "tsion"},
              {"id": 225, "name": "ezgi"},
              {"id": 226, "name": "olhabiziura"},
              {"id": 227, "name": "rossgeller"},
            ],
            "expenses": []
          };
        
          const data = {
            "currency": "EUR",
            "items": [
              {"amount": 4.45, "description": "MOJITO 14 ° 70CVI"},
              {"amount": 0.05, "description": "TOT. ALTRI SCONTI"},
              {"amount": 2.99, "description": "BELLINI APERITIVO 5VI"},
              {"amount": 1.09, "description": "PATATINE STICKVI"},
              {"amount": 1.35, "description": "PATATINE PAPRIKA200GVI"},
              {"amount": 2.19, "description": "LAMBRUSCO AMABILE IGVI"}
            ],
            "total": 12.07
          };
        
          console.log(data.items); // Check if items are correctly logged
        
          navigation.navigate('ReceiptScan add expenses', { groupdata, data });
      }
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
        <Text style={styles.description}>
          You are entering a scanner receipt feature! Take a picture of your receipt and we will create a group and add expenses for you! No need to enter it manually!
        </Text>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity onPress={confirmAndSend} style={styles.button}>
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
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight-50 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerContainer: {
    // Add your header styles here if any
  },
});

export default ReceiptScan;
