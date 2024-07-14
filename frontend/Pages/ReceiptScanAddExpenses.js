import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Platform, StatusBar } from 'react-native';
import api from '../api'; // Import your API module
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';

const ReceiptScanAddExpense = ({ navigation, route }) => {
  const { groupdata, data } = route.params || {};
  console.log(route.params)
  const groupId = groupdata.id;
  console.log("Data in expense page " + JSON.stringify(data.items));

  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [localExpenses, setLocalExpenses] = useState(data.items.map(expense => ({
    name: expense.description,
    amount: expense.amount,
    selectedMembers: []
  })));

  useEffect(() => {
    const fetchGroupAndUserDetails = async () => {
      try {
        // Fetch current user details
        const userResponse = await api.get(`/api/users/me/`); // Assuming this endpoint returns the current user
        const userData = userResponse.data;

        // Prepare member data
        if (groupdata.members) {
          const memberData = groupdata.members.map(member => {
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

  const toggleSelectMember = (expenseIndex, memberId) => {
    setLocalExpenses(prevExpenses => {
      const updatedExpenses = [...prevExpenses];
      const selectedMembers = updatedExpenses[expenseIndex].selectedMembers;

      if (selectedMembers.includes(memberId)) {
        updatedExpenses[expenseIndex].selectedMembers = selectedMembers.filter(id => id !== memberId);
      } else {
        updatedExpenses[expenseIndex].selectedMembers = [...selectedMembers, memberId];
      }

      return updatedExpenses;
    });
  };

  const selectAllMembers = (expenseIndex) => {
    setLocalExpenses(prevExpenses => {
      const updatedExpenses = [...prevExpenses];
      updatedExpenses[expenseIndex].selectedMembers = members.map(member => member.id);
      return updatedExpenses;
    });
  };

  const addExpenses = async () => {
    try {
      for (const expense of localExpenses) {
        const response = await api.post(`/api/groups/${groupId}/addExpense/`, {
          name: expense.name,
          amount: expense.amount,
          owes: expense.selectedMembers
        });

        if (response.status === 201) {
          // Update local expenses after successfully adding expense
          // Example: Assuming you have a state for all expenses, update it here
          // updateExpenses(prevExpenses => [...prevExpenses, response.data]); // Uncomment this line if you have an 'updateExpenses' function
          console.log('Expense added successfully:', response.data);
        } else {
          console.error('Failed to add expense:', expense);
        }
      }
      alert('All expenses were added successfully!');
      navigation.navigate("GroupDetails", { groupId });
    } catch (error) {
      console.error('Error adding expenses:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar style={styles.headerContainer} navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>New Expenses</Text>
        {localExpenses.map((expense, index) => (
          <View key={index} style={styles.expenseContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name of Expense"
              value={expense.name}
              onChangeText={(text) => {
                const updatedExpenses = [...localExpenses];
                updatedExpenses[index].name = text;
                setLocalExpenses(updatedExpenses);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={expense.amount.toString()}
              onChangeText={(text) => {
                const updatedExpenses = [...localExpenses];
                updatedExpenses[index].amount = text;
                setLocalExpenses(updatedExpenses);
              }}
              keyboardType="numeric"
            />
            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>Select Members:</Text>
              <TouchableOpacity onPress={() => selectAllMembers(index)}>
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
                    expense.selectedMembers.includes(item.id) && styles.selectedMemberContainer,
                  ]}
                  onPress={() => toggleSelectMember(index, item.id)}
                >
                  <Text style={[
                    styles.memberText,
                    expense.selectedMembers.includes(item.id) && styles.selectedMemberText,
                  ]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addExpenses}>
          <Text style={styles.addButtonText}>Add Expenses</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight-50 : 0,
  },
  headerContainer: {
    // Add your header styles here if any
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#F4F4F4',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#343a40',
    textAlign: 'center',
  },
  expenseContainer: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
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
    borderRadius: 15,
    marginBottom: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    alignItems: 'center',
  },
  selectedMemberContainer: {
    backgroundColor: 'grey',
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
    backgroundColor: 'grey',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 30,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReceiptScanAddExpense;
