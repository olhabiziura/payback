import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, StatusBar, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api';  // Assuming you have an api.js file for API requests

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await api.get(`/api/users/me/`);
        const userData = userResponse.data;
        setMyId(userData.id);
        setName(userData.name);
        setSurname(userData.surname);
        if (userData.name === "" || userData.surname === "") {
          navigation.navigate('After Sign Up');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [setName, setSurname]);

  const handlePress = (screen) => {
    setLoading(true);
    navigation.navigate(screen);
    setTimeout(() => setLoading(false), 1000); // Simulate loading time
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <HeaderBar
        style={styles.header_container}
        navigation={navigation}
        goBack={false}
        person={true}
        home={false}
        bars={true}
        question={true}
      />
      <View style={styles.container_main}>
        <Text style={styles.text}>Welcome To Payback!</Text>
        <Image source={require('../assets/images/happy_mascot.png')} style={styles.imageHome} />
        <CustomButton
          title="Check Balance"
          onPress={() => handlePress('BarGraph')}
          titleColor="black"
          backgroundColor="#f0f0f0"
          icon="cash-outline"
        />
        <CustomButton
          title="Group Expenses"
          onPress={() => handlePress('Groups')}
          titleColor="black"
          backgroundColor="#f0f0f0"
          icon="people-outline"
        />
        <CustomButton
          title="Payment Page"
          onPress={() => navigation.navigate('Payment Page')}
          titleColor="black"
          backgroundColor="#f0f0f0"
          icon="card-outline"
        />
        {loading && <ActivityIndicator size="large" color="#000000" style={styles.loader} />}
      </View>
    </View>
  );
};

const CustomButton = ({ title, onPress, titleColor, backgroundColor, icon }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, { toValue: 0.9, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleValue, { toValue: 1, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity onPress={() => {
      animateButton();
      onPress();
    }} activeOpacity={0.8}>
      <Animated.View style={[styles.button, { backgroundColor, transform: [{ scale: scaleValue }] }]}>
        <View style={styles.buttonContent}>
          <Icon name={icon} size={24} color={titleColor} style={styles.icon} />
          <Text style={[styles.buttonText, { color: titleColor }]}>{title}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header_container: {
    backgroundColor: 'white',
  },
  container_main: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'flex-start',
    fontFamily: 'System',
  },
  imageHome: {
    width: 250,
    height: 250,
    marginBottom: 20,
    marginTop: 30,
    borderRadius: 20,
  },
  button: {
    width: 280,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'System',
  },
  loader: {
    marginTop: 20,
  },
});

export default HomeScreen;
