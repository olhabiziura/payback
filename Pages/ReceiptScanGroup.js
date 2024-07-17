import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';

const ReceiptScanGroup = ({ navigation, route }) => {
  const { data } = route.params || {};

  const handleAddToExisting = () => {
    navigation.navigate('AddToExistingGroup');
  };

  const handleCreateNewOne = () => {
    navigation.navigate('ReceiptScan add group', { data });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar style={styles.headerContainer} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
      <View style={styles.container}>
        <Text style={styles.title}>Choose Action</Text>
        <Text style={styles.text}>Select one of the options below to manage your expenses:</Text>
        
        {/* Option 1: Add to Existing Group */}
        <TouchableOpacity style={[styles.button, styles.existingButton]} onPress={handleAddToExisting}>
          <Text style={styles.buttonText}>Add to Existing Group</Text>
          <Text style={styles.buttonSubtitle}>Add your receipt expenses to an existing group</Text>
        </TouchableOpacity>
        
        {/* Option 2: Create New Group */}
        <TouchableOpacity style={[styles.button, styles.createNewButton]} onPress={handleCreateNewOne}>
          <Text style={styles.buttonText}>Create New Group</Text>
          <Text style={styles.buttonSubtitle}>Create a new group and add your receipt expenses</Text>
        </TouchableOpacity>
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
  headerContainer: {
    // Add your header styles here if any
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#343a40',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    maxWidth: 300,
  },
  existingButton: {
    backgroundColor: '#2471A3', 
  },
  createNewButton: {
    backgroundColor: '#ff5733', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonSubtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default ReceiptScanGroup;
