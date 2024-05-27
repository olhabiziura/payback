import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import styles from '../assets/styles/MainContainer';
import { Button } from 'react-native-paper';


const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <HeaderBar style = {styles.header_container}
      navigation={navigation} 
      goBack={false} 
      person={true} 
      home={false} 
      bars={true} 
      question={true} 
    />
    <View style={styles.container_main}>
      <Text style={styles.text}>This is the home page </Text>
      <Button  style={ {alignItems: 'center',
       
       paddingVertical: 12,
       paddingHorizontal: 100,
       borderRadius: 100,
       elevation: 10,
       backgroundColor: 'white',
         }}
        title="Go to Bar Screen"
        onPress={() => navigation.navigate('BarGraph')}
      />
    </View>
  </View>
);


export default HomeScreen;
