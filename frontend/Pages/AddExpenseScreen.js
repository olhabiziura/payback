import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Button } from 'react-native';
import api from '../api'; // Import your API module

const AddExpensePage = ({ route, navigation }) => {
  const { groupId, setExpenses } = route.params;
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchGroupAndUserDetails = async () => {
      try {
        // Fetch group members
        const groupResponse = await api.get(`/api/groups/${groupId}/`);
        const groupData = groupResponse.data;
        console.log(groupData)
        // Fetch current user details
        const userResponse = await api.get(`/api/users/me/`); // Assuming this endpoint returns the current user
        const userData = userResponse.data;

        // Prepare member data
        if (groupData.members) {
          const memberData = groupData.members.map(member => {
            if (member.name === userData.username) {
              return { id: member.id, name: `Me (${userData.username})` };
            }
            return { id: member.id, name: member.name };
          });
          setMembers(memberData);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching group and user details:', error);
      }
    };

    fetchGroupAndUserDetails();
  }, [groupId]);

  const toggleSelectMember = (memberId) => {
    setSelectedMembers(prevSelected => {
      if (prevSelected.includes(memberId)) {
        return prevSelected.filter(id => id !== memberId);
      } else {
        return [...prevSelected, memberId];
      }
    });
  };

  const selectAllMembers = () => {
    setSelectedMembers(members.map(member => member.id));
  };

  const addExpense = async () => {
    try {
      const response = await api.post(`/api/groups/${groupId}/addExpense/`, {
        name: expenseName,
        amount: expenseAmount,
        group_id: groupId,
        owes: selectedMembers
      });

      if (response.status === 201) {
        setExpenses(prevExpenses => [...prevExpenses, response.data]);
        navigation.goBack();
      } else {
        console.error('Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Name of Expense"
        value={expenseName}
        onChangeText={setExpenseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={expenseAmount}
        onChangeText={setExpenseAmount}
        keyboardType="numeric"
      />
      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>Select Members:</Text>
        <TouchableOpacity onPress={selectAllMembers}>
          <Text style={styles.selectAllButton}>Select All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={members}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.memberContainer,
              selectedMembers.includes(item.id) && styles.selectedMemberContainer,
            ]}
            onPress={() => toggleSelectMember(item.id)}
          >
            <Text style={[
              styles.memberText,
              selectedMembers.includes(item.id) && styles.selectedMemberText,
            ]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={addExpense}>
        <Text style={styles.addButtonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  subTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
  },
  selectAllButton: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  memberContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  selectedMemberContainer: {
    backgroundColor: '#7fbfff',
  },
  memberText: {
    fontSize: 16,
    color: '#343a40',
  },
  selectedMemberText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 25,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddExpensePage;
