import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import SlidingMenu from '../components/SlidingMenu';
import styles from '../assets/styles/MainContainer';
import api from '../api';

const HeaderBar = ({ navigation, goBack, person, home, bars, question, title, notifications }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [myId, setMyId] = useState(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

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
        {home && (
          <Appbar.Action
            icon={() => <Icon1 name="home-outline" size={24} />}
            onPress={() => navigation.navigate('BarGraph')}
          />
        )}
        {person && (
          <Appbar.Action
            icon={() => <Icon1 name="person-circle-outline" size={24} />}
            onPress={() => navigation.navigate('Profile', { user_id: myId })}
          />
        )}
        <View style={styles.flexContainer}>
          {/* Centered title */}
          <Appbar.Content title={title} titleStyle={styles.headerTitle} style={styles.centeredTitle} />
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
          {notifications && (
            <Appbar.Action
              icon={() => <Icon1 name="notifications-outline" size={24} />}
              onPress={() => navigation.navigate('Notifications')}
            />
          )}
        </View>
      </Appbar.Header>
      {isMenuVisible && <SlidingMenu isVisible={isMenuVisible} onClose={toggleMenu} navigation={navigation} />}
    </>
  );
};

export default HeaderBar;
