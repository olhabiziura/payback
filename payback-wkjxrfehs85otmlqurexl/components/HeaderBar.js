import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon1 from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this dependency
import Icon2 from 'react-native-vector-icons/FontAwesome'; // Make sure to install this dependency
import SlidingMenu from '../components/SlidingMenu'; // Adjust the path as needed
import styles from '../assets/styles/MainContainer';

const HeaderBar = ({ navigation, goBack, person, home, bars, question }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

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
            onPress={() => navigation.navigate('Profile')}
          />
        )}
        <View style={styles.rightActions}>
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
          {question && (
            <Appbar.Action
              icon={() => <Icon2 name="question" size={24} />}
              onPress={() => navigation.navigate('About')}
            />
          )}
        </View>
      </Appbar.Header>
      <SlidingMenu isVisible={isMenuVisible} onClose={toggleMenu} />
    </>
  );
};


export default HeaderBar;
