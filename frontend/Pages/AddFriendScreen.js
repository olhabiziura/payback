import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import the tick icon
import api from '../api';

const AddFriendPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      const response = await api.get(`/api/search-users/?query=${searchQuery}`);
      const data = response.data.slice(0, 5); // Only get the first 5 results
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text>{item.username}</Text>
      {addedFriends.includes(item.id) ? (
        <MaterialIcons name="done" size={24} color="green" />
      ) : (
        <Button title="Add" onPress={() => handleAddFriend(item.id)} />
      )}
    </View>
  );

  const handleAddFriend = async (userId) => {
    try {
      // Make an API call to add the user as a friend
      const response = await api.post('/api/add-friend/', {
        friendId: userId, // ID of the user you want to add as a friend
      });
  
      if (response.status === 200) {
        // Friend added successfully
        console.log('Friend added successfully');
        // Update the addedFriends state to include the newly added friend
        setAddedFriends([...addedFriends, userId]);
      } else {
        // Handle error
        console.error('Failed to add friend');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
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
        keyExtractor={(item) => item.id}
      />
    </View>
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
});

export default AddFriendPage;
