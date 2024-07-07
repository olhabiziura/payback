import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [animValue] = useState(new Animated.Value(0));
  const [sortBy, setSortBy] = useState('default'); // 'default' or 'alphabetical'

  useFocusEffect(
    useCallback(() => {
      const fetchGroups = async () => {
        try {
          const fetchedGroups = await userGroups();
          setGroups(fetchedGroups);
        } catch (error) {
          console.error('Failed to fetch groups:', error);
          Alert.alert('Error', 'Failed to fetch groups. Please try again later.');
        }
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
      if (selectedGroups.length === 0) {
        Alert.alert('No Groups Selected', 'Please select groups to delete.');
        return;
      }
      
      const response = await api.post('/delete-groups/', {
        groupIds: selectedGroups
      });
      
      if (response.status === 200) {
        const remainingGroups = groups.filter(group => !selectedGroups.includes(group.id));
        setGroups(remainingGroups);
        setEditMode(false);
      } else {
        console.error('Failed to delete groups');
        Alert.alert('Error', 'Failed to delete groups. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  const toggleSort = () => {
    const newSortBy = sortBy === 'default' ? 'alphabetical' : 'default';
    setSortBy(newSortBy);
  };

  let sortedGroups = [...groups];
  if (sortBy === 'alphabetical') {
    sortedGroups.sort((a, b) => a.name.localeCompare(b.name));
  }

  const filteredGroups = sortedGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
    // Add more filter conditions here if needed
  );

  return (
    <View style={styles.container}>
      
      <HeaderBar
        style={styles.header_container}
        navigation={navigation}
        goBack={true}
        person={true}
        home={false}
        bars={true}
        question={false}
        title={ 'Group Expenses'}
        
      />
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity onPress={toggleSort} style={styles.iconButton}>
          <AntDesign name={sortBy === 'default' ? 'arrowdown' : 'arrowup'} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditPress} style={styles.iconButton}>
          <MaterialIcons name={editMode ? 'done' : 'edit'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      
      <ScrollView>
      <View style={styles.editContainer}>
        
        {editMode && (
          <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton}>
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
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
                <AntDesign name="right" size={20} color="#888" />
              </TouchableOpacity>
            ))}
         
      </ScrollView>
      <TouchableOpacity
        style={[styles.addButton, { opacity: animValue, backgroundColor: 'black' }]}
        onPress={() => {
          //animateButton();
          navigation.navigate('AddGroup', { addGroup });
        }}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header_container:{
    Text: 'Expenses',
    alignSelf: 'center',
    justifyContent: 'center'
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: 10,
  },
  iconButton: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#e7e7e7',
    elevation: 2,
    marginHorizontal: 20,
    width: '90%'
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  editContainer: {
    padding:20,
    left: 150,
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
    paddingHorizontal: 25,
    backgroundColor: 'red',
    borderRadius: 15,
    
  },
});

export default GroupExpensesScreen;