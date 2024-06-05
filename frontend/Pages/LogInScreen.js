import React, { useState, useContext } from 'react';
import { ScrollView, Image, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import styles from '../assets/styles/MainContainer';
import handleLogIn from '../src/functions/handleLogIn';
import { AuthContext } from '../AuthContext';
import { useAuth } from '../src/functions/status';

const LogInScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  console.log('before login '+isAuthenticated);

  return (
    <View style={styles.container}>
      <ScrollView>
      <HeaderBar style={styles.header_container} navigation={navigation} goBack={true} person={false} home={false} bars={false} question={true} />
      
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
    </View>
  );
};

export default LogInScreen;
