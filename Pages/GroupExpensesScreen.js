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
  Modal,
  Alert,
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import userGroups from '../src/functions/fetchUserGroups';
import api from '../api';
import HeaderBar from '../components/HeaderBar';

const GroupExpensesScreen = () => {
  const [groups, setGroups] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' or 'alphabetical'
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const navigation = useNavigation();

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

  const handleShowModal = () => {
    navigation.navigate('AddGroup'); // Navigate to 'AddGroup' screen
  };

  const addGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Group Name Required', 'Please enter a group name.');
      return;
    }
    const newGroup = {
      id: groups.length + 1, // Replace with actual ID generated from API
      name: newGroupName,
      description: newGroupDescription,
    };
    setGroups([...groups, newGroup]);
    setModalVisible(false);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  const toggleSort = () => {
    const newSortBy = sortBy === 'default' ? 'group_id' : 'default';
    setSortBy(newSortBy);
  };
  
  let sortedGroups = [...groups];
  
  if (sortBy === 'default') {
    sortedGroups.sort((a, b) => b.id - a.id); // Assuming `id` is the identifier for groups
  } else if (sortBy === 'group_id') {
    sortedGroups.sort((a, b) => a.id - b.id); // Reverse order if needed
  }
  
  const filteredGroups = sortedGroups.filter(group => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase()); // Filter based on search query
  });
  


  return (
    <View style={styles.container}>
      <HeaderBar navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} title={'Groups'} />
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
        {filteredGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.groupContainer,
              selectedGroups.includes(group.id) && styles.selectedGroup,
            ]}
            onPress={() => handleGroupPress(group.id)}
          >
            <Text style={styles.groupName}>{group.name}</Text>
            {editMode && selectedGroups.includes(group.id) && (
              <AntDesign name="checkcircle" size={24} color="green" />
            )}
            <AntDesign name="right" size={20} color="#888" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={handleShowModal}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Group</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Group Description"
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addGroup}
              >
                <Text style={styles.buttonText}>Add Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  },
  selectedGroup: {
    backgroundColor: '#d1e7dd',
  },
  groupName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fabButton: {
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: 'red',
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  addButton: {
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GroupExpensesScreen;
