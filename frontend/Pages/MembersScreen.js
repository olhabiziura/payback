import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import api from '../api'; // Import your API module
import { Platform, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
const MembersPage = ({ route, navigation }) => {
  const { groupId } = route.params;  
  const [groupData, setGroupData] = useState(null);
  const [memberNames, setMemberNames] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/api/groups/${groupId}/`);
        const data = response.data;
        setGroupData(data);
        if (data.members) {
          const memberNames = data.members.map(member => member.name);
          setMemberNames(memberNames);
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const updateMembers = async (updatedMembers) => {
    try {
      const response = await api.put(`/api/groups/${groupId}/members/`, { members: updatedMembers });
      if (response.status === 200) {
        setMemberNames(updatedMembers);
      } else {
        console.error('Failed to update members');
      }
    } catch (error) {
      console.error('Error updating members:', error);
    }
  };

  const addMember = () => {
    if (newMember.trim()) {
      setMemberNames([...memberNames, newMember.trim()]);
      setNewMember('');
    }
  };

  const removeMember = (name) => {
    setMemberNames(memberNames.filter(member => member !== name));
  };

  const toggleEditing = async () => {
    if (isEditing) {
      // Save changes when done editing
      await updateMembers(memberNames);
    }
    setIsEditing(!isEditing);
  };

  return (
    <SafeAreaView style = {styles.safeArea}>
    <HeaderBar style = {styles.header_container} navigation={navigation} goBack = {true} person = {true} home = {true} bars ={true} question = {true}/>

    <View style={styles.container}>
      {groupData ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Members</Text>
            <Button title={isEditing ? "Done" : "Edit"} onPress={toggleEditing} />
          </View>
          <FlatList
            data={memberNames}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.memberContainer}>
                <Text style={styles.memberText}>{item}</Text>
                {isEditing && (
                  <TouchableOpacity onPress={() => removeMember(item)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          {isEditing && (
            <View style={styles.addMemberContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter member name"
                value={newMember}
                onChangeText={setNewMember}
              />
              <Button title="Add Member" onPress={addMember} />
            </View>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  memberText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ff5c5c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
  addMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 60,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
  },
});

export default MembersPage;
