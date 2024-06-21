import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/MaterialIcons'; // Ensure this dependency is installed
import Icon2 from 'react-native-vector-icons/FontAwesome'; // Ensure this dependency is installed
import SlidingMenu from '../components/SlidingMenu'; // Adjust the path as needed
import styles from '../assets/styles/MainContainer'; // Ensure this path is correct
import api from '../api';

const HeaderBar = ({ navigation, goBack, person, home, bars, question }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [myId, setMyId] = useState(null)
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => { //
  }, [myId]); // Run this effect whenever myId changes
  
  const fetchUserData = async () => {
    try {
      const userResponse = await api.get(`/api/users/me/`);
      const userData = userResponse.data;
      setMyId(userData.id);
     
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Appbar.Header style={styles.header}>
        {goBack && (
          <Appbar.Action
            icon={() => <Icon1 name="arrow-back" size={24} />}
            onPress={() => navigation.goBack()}
          />
        )}
        {person && (
          <Appbar.Action
            icon={() => <Icon1 name="person" size={24} />}
            onPress={() => navigation.navigate('Profile', { user_id: myId})}
          />
        )}
        <View style={styles.rightActions}>
        {question && (
            <Appbar.Action
              icon={() => <Icon2 name="question" size={24} />}
              onPress={() => navigation.navigate('About')}
            />
          )}
          {home && (
            <Appbar.Action
              icon={() => <Icon1 name="home" size={24} />}
              onPress={() => navigation.navigate('Home Page')}
            />
          )}
          {bars && (
            <Appbar.Action
              icon={() => <Icon2 name="bars" size={24} />}
              onPress={toggleMenu}
            />
          )}
          
        </View>
      </Appbar.Header>
      {isMenuVisible && <SlidingMenu isVisible={isMenuVisible} onClose={toggleMenu} navigation={navigation} />}

    </>
  );
};

export default HeaderBar;

// Example styles if MainContainer does not contain them

