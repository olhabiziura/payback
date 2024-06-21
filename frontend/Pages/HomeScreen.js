import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import styles from '../assets/styles/MainContainer';
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => (
  <View style={stylesb.container}>
    <HeaderBar
      style={stylesb.header_container}
      navigation={navigation}
      goBack={false}
      person={true}
      home={false}
      bars={true}
      question={true}
    />
    <View style={stylesb.container_main}>
      <View style={stylesb.welcomeContainer}>
        <Image source={require('../assets/images/welcome_mascot_transparent.png')} style={stylesb.imageMedium} />
        <Text style={stylesb.text}>Welcome!</Text>
      </View>
      <CustomButton
        title="See the graph summary"
        onPress={() => navigation.navigate('BarGraph')}
        titleColor="white"
        backgroundColor="grey"
        style={stylesb.customButton}
      />
      <CustomButton
        title="See the list of my groups"
        onPress={() => navigation.navigate('Groups')}
        titleColor="white"
        backgroundColor="grey"
        style={stylesb.customButton}
      />
      <CustomButton
        title="Go to Payment Page"
        onPress={() => navigation.navigate('Payment Page')}
        titleColor="white"
        backgroundColor="grey"
        style={stylesb.customButton}
      />
    </View>
  </View>
);

const CustomButton = ({ title, onPress, titleColor, style, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[stylesb.button, { backgroundColor }, style]}>
      <Text style={[stylesb.buttonText, { color: titleColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const stylesb = StyleSheet.create({
  container: {
    flex: 1,
  },
  header_container: {
    // Add styles for header container if needed
  },
  container_main: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  customButton: {
    width: '95%',
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 30,
    elevation: 10,
    marginVertical: 5, // Add margin between buttons
  },
  imageMedium: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
