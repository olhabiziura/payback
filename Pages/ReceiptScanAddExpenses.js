import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Platform, StatusBar } from 'react-native';
import api from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';

const ReceiptScanAddExpense = ({ navigation, route }) => {
  const { groupdata, data } = route.params || {};
  const [members, setMembers] = useState([]);
  const [localExpenses, setLocalExpenses] = useState([]);

  useEffect(() => {
    if (data && data.items) {
      setLocalExpenses(data.items.map(expense => ({
        name: expense.description,
        amount: expense.amount.toString(),
        selectedMembers: [],
      })));
    }

    const fetchGroupAndUserDetails = async () => {
      try {
        const userResponse = await api.get(`/api/users/me/`);
        const userData = userResponse.data;

        if (groupdata.members) {
          const memberData = groupdata.members.map(member => ({
            id: member.id,
            name: member.name === userData.username ? `Me (${userData.username})` : member.name,
          }));
          setMembers(memberData);
        }
      } catch (error) {
        console.error('Error fetching group and user details:', error);
      }
    };

    fetchGroupAndUserDetails();
  }, [groupdata, data]);

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
        const response = await api.post(`/api/groups/${groupdata.id}/addExpense/`, {
          name: expense.name,
          amount: parseFloat(expense.amount),
          owes: expense.selectedMembers,
        });

        if (response.status === 201) {
          console.log('Expense added successfully:', response.data);
        } else {
          console.error('Failed to add expense:', expense);
        }
      }
      alert('All expenses were added successfully!');
      navigation.navigate('GroupDetails', { groupId: groupdata.id });
    } catch (error) {
      console.error('Error adding expenses:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar navigation={navigation} goBack={true} person={true} home={true} bars={true} question={true}/>
      <ScrollView contentContainerStyle={styles.container}>
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
              value={expense.amount}
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
    paddingTop: Platform.OS === 'IOS' ? StatusBar.currentHeight : -50,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  expenseContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
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
    fontSize: 18,
    color: '#343a40',
  },
  selectAllButton: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  memberContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedMemberContainer: {
    backgroundColor: '#007bff',
  },
  memberText: {
    fontSize: 16,
    color: '#343a40',
  },
  selectedMemberText: {
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReceiptScanAddExpense;
