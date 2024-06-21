import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import HeaderBar from '../components/HeaderBar';

const AddFriendPage = ({ navigation, route }) => {
  const { userId } = route.params; // Extracting userId from route params
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchFriends(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (searchQuery) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchFriends = async (userId) => {
    try {
      const response = await api.get(`/api/user-profile/${userId}/`);
      const profileData = response.data;
      setFriends(profileData.friends);
      console.log('Fetched friends:', profileData.friends);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const searchUsers = async () => {
    try {
      const response = await api.get(`/api/search-users/?query=${searchQuery}`);
      const data = response.data.slice(0, 5);
      setSearchResults(data);
      console.log('Search results:', data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const isFriend = (userId) => {
    return friends.some(friend => friend.id === userId);
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text>{item.username}</Text>
      {isFriend(item.id) ? (
        <Ionicons name="checkmark" size={24} color="green" />
      ) : (
        <Button title="Add" onPress={() => handleAddFriend(item.id)} />
      )}
    </View>
  );

  const handleAddFriend = async (friendId) => {
    try {
      const response = await api.post('/api/add-friend/', { friendId });

      if (response.status === 200) {
        console.log('Friend added successfully');
        fetchFriends(userId); // Refresh friends list after adding a new friend
      } else {
        console.error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        style={styles.header_container}
        navigation={navigation}
        goBack={true}
        person={true}
        home={true}
        bars={true}
        question={true}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search by username"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS === "IOS" ? StatusBar.currentHeight : -50,
  },
});

export default AddFriendPage;
