import React, { useState } from 'react';
import { ScrollView, Image, View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import styles from '../assets/styles/MainContainer';
import handleSignUp from '../src/functions/handleSignUp';
import { useAuth } from '../src/functions/status';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <SafeAreaView style = {styles.safeArea}>
      <HeaderBar 
            style={styles.header_container} 
            navigation={navigation} 
            goBack={true} 
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
            <Text style={styles.title}>Sign Up</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Repeat password"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry
            />
            
            <Button 
              title="Sign Up" 
              onPress={() => handleSignUp(navigation, username, email, password, repeatPassword, isAuthenticated, setIsAuthenticated)} 
            />

            <Button 
              title="Already have an account?" 
              onPress={() => navigation.navigate('Log In')} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
  },
});

export default SignUpScreen;
