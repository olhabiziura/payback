import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import ReceiptScan from './ReceiptScanScreen';

const ReceiptScanGroup = ({ navigation, route }) => {
    const { data } = route.params || {};


  const handleAddToExisting = () => {
    // Navigate to the screen where the user can select an existing group
    navigation.navigate('AddToExistingGroup');
  };

  const handleCreateNewOne = () => {
    // Navigate to the screen where the user can create a new group
    navigation.navigate('ReceiptScan add group', {data});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar style={styles.headerContainer} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
      <View style={styles.container}>
        <Text style={styles.text}>Do you want to add these expenses to an already existing group or create a new one?</Text>
        <TouchableOpacity style={styles.button} onPress={handleAddToExisting}>
          <Text style={styles.buttonText}>Add to an Existing Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCreateNewOne}>
          <Text style={styles.buttonText}>Create a New One</Text>
        </TouchableOpacity>
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
  headerContainer: {
    // Add your header styles here if any
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#343a40',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ReceiptScanGroup;
