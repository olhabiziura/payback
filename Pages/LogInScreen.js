import React, { useState } from 'react';
import { ScrollView, Image, View, Text, TextInput, Button, StyleSheet, Alert, Platform, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import styles from '../assets/styles/MainContainer';
import handleLogIn from '../src/functions/handleLogIn';
import { useAuth } from '../src/functions/status';

const LogInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useAuth();
 
  return (
    <View style={styles.safeArea}>
      <HeaderBar
        style={styles.header_container}
        navigation={navigation}
        goBack={false}
        person={false}
        home={false}
        bars={false}
        question={true}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container_main}>
              <Image source={require('../assets/images/mascot.png')} style={styles.imageMedium} />
              <Text style={styles.title}>Log In</Text>
              <TextInput
                style={styles.input}
                placeholder="Username/email"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Button title="Log In" onPress={() => handleLogIn(navigation, username, password, isAuthenticated, setIsAuthenticated)} />
              <Button title="Don't have an account yet?" onPress={() => navigation.navigate('Sign Up')} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};


export default LogInScreen;
