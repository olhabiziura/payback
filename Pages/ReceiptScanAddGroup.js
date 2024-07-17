import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import api from '../api';
import HeaderBar from '../components/HeaderBar';

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
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar style={styles.headerContainer} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} title={'Add New Group'} />
        <View style={styles.container}>
          <Text style={styles.label}>Enter Group Name:</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Group Name"
            placeholderTextColor="#888"
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
            placeholderTextColor="#888"
          />
          
          <TouchableOpacity
            style={[styles.button, styles.addPersonButton]}
            onPress={handleAddPerson}
            disabled={!manualEntry.trim()}
          >
            <Text style={styles.buttonText}>Add Person</Text>
          </TouchableOpacity>

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

          <TouchableOpacity style={[styles.button, styles.addGroupButton]} onPress={handleAddGroup}>
            <Text style={styles.buttonText}>Add Group</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2471A3',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  friendList: {
    maxHeight: 150,
    marginBottom: 20,
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
    backgroundColor: '#2471A3',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addPersonButton: {
    backgroundColor: '#2471A3',
  },
  addGroupButton: {
    backgroundColor: '#2471A3',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddGroupScreen;
