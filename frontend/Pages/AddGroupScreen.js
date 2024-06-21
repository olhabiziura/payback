import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import api from '../api';
import { Platform, StatusBar } from "react-native";
const AddGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [manualEntry, setManualEntry] = useState('');
  const [people, setPeople] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get('/api/friends/');
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);
  const handleAddPerson_list = (friend) => {
    // Check if the person with the provided ID is already in the list
    if (!people.some(person => person.id === friend.id)) {
      const newPerson = { name: friend.name, id: friend.id };
      setPeople([...people, newPerson]);
    }
  };
  const handleAddPerson = () => {
    if (manualEntry.trim() !== '') {
      const newPerson = { name: manualEntry.trim(), id: null };
      setPeople([...people, newPerson]);
      setManualEntry('');
    }
  };

  const handleRemovePerson = (index) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const handleAddGroup = async () => {
    if (groupName.trim() && people.length > 0) {
      try {
        const response = await api.post('/api/addgroup/', {
          name: groupName,
          members: people,
        });
        if (response.status === 200) {
          navigation.navigate('Groups');
        } else {
          console.error('Failed to add group');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Group Name:</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
      />

      <Text style={styles.label}>Choose a friend:</Text>
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAddPerson_list(item)}>
            <View style={styles.friendItem}>
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.friendList}
      />

      <Text style={styles.label}>Type a name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type a name..."
        value={manualEntry}
        onChangeText={setManualEntry}
      />

      <Button title="Add Person" onPress={() => handleAddPerson({ name: manualEntry })} disabled={!manualEntry.trim()} />

      <FlatList
        data={people}
        renderItem={({ item, index }) => (
          <View style={styles.personContainer}>
            <Text style={styles.person}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemovePerson(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
        <Text style={styles.addButtonText}>Add Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  friendList: {
    maxHeight: 150,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  person: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'red',
  },
  addButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
  },
});

export default AddGroupScreen;
