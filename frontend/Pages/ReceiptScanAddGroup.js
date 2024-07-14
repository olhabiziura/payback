import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import api from '../api';
import HeaderBar from '../components/HeaderBar';

const ReceiptScanAddGroup = ({ navigation, route }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [manualEntry, setManualEntry] = useState('');
  const [people, setPeople] = useState([]);
  const [friends, setFriends] = useState([]);

  const { data } = route.params || {};

  console.log(data)

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

  const handleAddGroup = async (data) => {
    if (groupName.trim() && people.length > 0) {
      try {
        const response = await api.post('/api/addgroup/', {
          name: groupName,
          members: people,
        });

        if (response.status === 200) {
          const groupId = response.data.id;

          try {
            const groupResponse = await api.get(`/api/groups/${groupId}/`);
            const groupdata = groupResponse.data;

            // Pass groupdata and data as route parameters
            navigation.navigate('ReceiptScan add expenses', { groupdata, data });
          } catch (error) {
            console.error('Error fetching group details:', error);
          }
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
      <HeaderBar style={styles.headerContainer} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
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

        <Button title="Add Person" onPress={handleAddPerson} disabled={!manualEntry.trim()} />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    // Add your header styles here if any
  },
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
});

export default ReceiptScanAddGroup;
