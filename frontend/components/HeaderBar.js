import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/Ionicons'; // Use Ionicons for iOS-like icons
import Icon2 from 'react-native-vector-icons/Ionicons'; // Use Ionicons for iOS-like icons
import SlidingMenu from '../components/SlidingMenu'; // Adjust the path as needed
import styles from '../assets/styles/MainContainer'; // Ensure this path is correct
import api from '../api';

const HeaderBar = ({ navigation, goBack, person, home, bars, question, title }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [myId, setMyId] = useState(null);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Fetch user data
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
      <Appbar.Header style={[styles.header, Platform.OS === 'ios' ? styles.iosHeader : styles.androidHeader]}>
        {goBack && (
          <Appbar.Action
            icon={() => <Icon1 name="arrow-back" size={24} />}
            onPress={() => navigation.goBack()}
          />
        )}
        {person && (
          <Appbar.Action
            icon={() => <Icon1 name="person-circle-outline" size={24} />}
            onPress={() => navigation.navigate('Profile', { user_id: myId })}
          />
        )}
        <View style={styles.flexContainer}>
          <Appbar.Content title={title} titleStyle={styles.headerTitle} />
        </View>
        <View style={styles.rightActions}>
          {question && (
            <Appbar.Action
              icon={() => <Icon2 name="help-circle-outline" size={24} />}
              onPress={() => navigation.navigate('About')}
            />
          )}
          {bars && (
            <Appbar.Action
              icon={() => <Icon2 name="menu-outline" size={24} />}
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
