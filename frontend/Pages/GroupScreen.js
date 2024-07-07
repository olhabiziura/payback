import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, FlatList, Platform, ScrollView, selectedTab} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for icons
import api from '../api'; // Import your API module
import HeaderBar from '../components/HeaderBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const GroupDetailsPage = ({ route }) => {
  const { groupId } = route.params;
  const [groupData, setGroupData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await api.get(`/api/groups/${groupId}/`);
        const data = response.data;
        setGroupData(data);
        if (data.expenses) {
          setExpenses(data.expenses);
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);


  const handleExpensePress = (expenseId) => {
      navigation.navigate('ExpenseDetails', {expenseId: expenseId  });
  };

  const updateGroupDetails = async () => {
    try {
      const response = await api.put(`/api/groups/${groupId}/`, groupData);
      if (response.status === 200) {
        setIsEditing(false);
      } else {
        console.error('Failed to update group details');
      }
    } catch (error) {
      console.error('Error updating group details:', error);
    }
  };

  const toggleEditing = async () => {
    if (isEditing) {
      await updateGroupDetails();
    }
    setIsEditing(!isEditing);
  };

  const addExpense = () => {
    navigation.navigate('AddExpensePage', { groupId, setExpenses });
  };

  return (
    <SafeAreaView style = {styles.safeArea}>
    <HeaderBar style = {styles.header_container} navigation={navigation} goBack = {true} person = {true} home = {true} bars ={true} question = {true}/>

    <View style={styles.container}>
      {groupData ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{groupData.name}</Text>
            <Button title={isEditing ? "Done" : "Edit"} onPress={toggleEditing} />
          </View>
          <Text style={styles.text}>Group ID: {groupId}</Text>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={groupData.name}
                onChangeText={(text) => setGroupData({ ...groupData, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Group Description"
                value={groupData.description}
                onChangeText={(text) => setGroupData({ ...groupData, description: text })}
              />
            </>
          ) : (
            <>
              <Text style={styles.text}>Group Name: {groupData.name}</Text>
              <Text style={styles.text}>Group Description: {groupData.description}</Text>
            </>
          )}
           <View style={styles.expenseHeader}>
          <Text style={styles.subTitle}>History of expenses:</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('BarGraph for group', { groupID: groupId, groupName:groupData.name })}>
                <FontAwesome name="bar-chart" size={24} color="black" />
          </TouchableOpacity>
          </View>
               
       
          <FlatList
            data={expenses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.expenseContainer}
                onPress={() => handleExpensePress(item.id)}
              >
                <Text style={styles.expenseText}>{item.name}</Text>
                <Text style={styles.expenseText}>{item.amount}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addExpense}
          >
            <Ionicons name="add" size={30} color="black" />
            
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.membersButton}
            onPress={() => navigation.navigate('MembersPage', { groupId })}
          >
            <AntDesign name="team" size={24} color="black" />
          </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: 'bold',
    borderColor: 'white',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  expenseContainer: {
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
  expenseText: {
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  membersButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expenseText: {
    fontSize: 16,
  },
  horizontalMenu: {
    marginBottom: 10,
    flexDirection: 'row',
    alignContent: 'center',
  },
  pickerContainer: {
    
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    //flexDirection: 'row',
    height: 50,
    width: '100%',
  },
});

export default GroupDetailsPage;
