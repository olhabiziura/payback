// AboutPage.js - page description of the PayBack

import React from 'react';
import { Image, View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import styles from '../assets/styles/MainContainer';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderBar from '../components/HeaderBar';

const AboutScreen = ({ navigation }) => {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <HeaderBar style = {styles.header_container} navigation={navigation} goBack = {true} person = {false} home = {true} bars ={false} question = {false}/>

      
      <View style={styles.container_main}>
        <Image
          source={require('/Users/ezgi/payback.last/assets/images/welcome_mascot_transparent.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>About Our App</Text>
        <Text style={styles.description}>
          Welcome to our app, the perfect solution for sharing expenses with friends!
        </Text>
        <Text style={styles.description}>
        Our app makes it easy to divide costs, track spending, and settle up quickly and fairly. Whether you're splitting rent with roommates, sharing vacation costs, or managing group gifts, our intuitive platform ensures everyone pays their fair share.
        </Text>
        <Text style={styles.description}>
        With features like real-time updates, expense tracking, and easy-to-use payment options, managing group expenses has never been simpler. Join us and experience hassle-free expense sharing with your friends!        </Text>
        <Text style={styles.subtitle}>Follow Us</Text>
        <View style={styles.socialButtons}>
          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            onPress={() => handleLinkPress('https://www.facebook.com')}
          >
            Facebook
          </Icon.Button>
          <Icon.Button
            name="twitter"
            backgroundColor="#1DA1F2"
            onPress={() => handleLinkPress('https://www.twitter.com')}
          >
            Twitter
          </Icon.Button>
          <Icon.Button
            name="instagram"
            backgroundColor="#E1306C"
            onPress={() => handleLinkPress('https://www.instagram.com')}
          >
            Instagram
          </Icon.Button>
        </View>
      </View>
    </View>
  );
};



export default AboutScreen;