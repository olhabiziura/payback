import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import userGroups from '../src/functions/fetchUserGroups';
import HeaderBar from '../components/HeaderBar';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api';

const GroupExpensesScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchGroups = async () => {
        const fetchedGroups = await userGroups();
        setGroups(fetchedGroups);
      };
      fetchGroups();
    }, [])
  );

  const handleGroupPress = (groupId) => {
    if (editMode) {
      if (selectedGroups.includes(groupId)) {
        setSelectedGroups(selectedGroups.filter(id => id !== groupId));
      } else {
        setSelectedGroups([...selectedGroups, groupId]);
      }
    } else {
      navigation.navigate('GroupDetails', { groupId: groupId });
    }
  };

  const handleEditPress = () => {
    setEditMode(!editMode);
    setSelectedGroups([]);
  };

  const handleDeletePress = async () => {
    try {
      // Send an HTTP POST request to your backend API
      const response = await api.post('/delete-groups/', {
        groupIds: selectedGroups // Send the array of selected group IDs in the request body
      });
      
      // Check if the request was successful
      if (response.status === 200) {
        console.log('Groups deleted successfully');
        
        // Update the state to remove the deleted groups from the UI
        const remainingGroups = groups.filter(group => !selectedGroups.includes(group.id));
        setGroups(remainingGroups);
  
        // Exit the edit mode
        setEditMode(false);
      } else {
        console.error('Failed to delete groups');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        style={styles.header_container}
        navigation={navigation}
        goBack={true}
        person={true}
        home={true}
        bars={true}
        question={true}
      />
      <View style={styles.editContainer}>
        <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
          <Text style={styles.editButtonText}>{editMode ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
        {editMode && (
          <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton}>
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.container_main}>
        <ScrollView>
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupContainer}
              onPress={() => handleGroupPress(group.id)}
            >
              <Text style={styles.groupName}>{group.name}</Text>
              {editMode && (
                <CheckBox
                  value={selectedGroups.includes(group.id)}
                  onValueChange={() => handleGroupPress(group.id)}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddGroup', { addGroup })}
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  container_main: {
    flex: 1,
    marginTop: 20,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  editContainer: {
    //position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default GroupExpensesScreen;
