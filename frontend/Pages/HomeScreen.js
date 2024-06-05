import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import styles from '../assets/styles/MainContainer';
import { Button } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';


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
      <Text style={stylesb.text}>Home</Text>
      <CustomButton
        title="Go to Bar Screen"
        onPress={() => navigation.navigate('BarGraph')}
        titleColor="white" 
        backgroundColor= "black"
        style={stylesb.customButton}
      />
      <CustomButton
        title="Go to Groups Screen"
        onPress={() => navigation.navigate('Groups')}
        titleColor="white" 
        backgroundColor= "black"
        style={stylesb.customButton}
      />
    </View>
  </View>
);

const CustomButton = ({ title, onPress, titleColor, style, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[stylesb.button,{ backgroundColor }, style]}>
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
  text: {
    fontSize: 24,
    justifyContent: 'center',
    alignContent: 'space-evenly',
    marginBottom: 20,
    padding : '20',
  },
  customButton: {
    paddingVertical: 20, // Increased padding
    paddingHorizontal: 100, // Increased padding
    borderRadius: 100,
    elevation: 10,
  },
});

export default HomeScreen;