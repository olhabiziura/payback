import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import useProfile from '../src/functions/fetchProfile';
import styles from '../assets/styles/MainContainer';

const ProfileScreen = ({ navigation }) => {
  const [
    name, setName,
    surname, setSurname,
    paymentDetails, setPaymentDetails,
    friends, setFriends,
    expenses, setExpenses,
  ] = useProfile();

  const [sortOption, setSortOption] = useState('date');
  const [isEditable, setIsEditable] = useState(false);

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedExpenses;
    if (option === 'alphabetically') {
      sortedExpenses = [...expenses].sort((a, b) => a.description.localeCompare(b.description));
    } else if (option === 'date') {
      sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === 'amount') {
      sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
    }
    setExpenses(sortedExpenses);
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.expenseDescription}>{item.description}</Text>
      <Text style={styles.expenseAmount}>${item.amount}</Text>
      <Text style={styles.expenseDate}>{item.date}</Text>
    </View>
  );

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Text>{item.name}</Text>
    </View>
  );

  const handleEditProfile = () => {
    setIsEditable(true);
  };

  const handleDoneEditing = () => {
    setIsEditable(false);
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        style={styles.header_container}
        navigation={navigation}
        goBack={true}
        person={false}
        home={false}
        bars={true}
        question={true}
      />
      <View style={styles.container_main}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile</Text>
          {isEditable ? (
            <Button title="Done" onPress={handleDoneEditing} />
          ) : (
            <Button title="Edit" onPress={handleEditProfile} />
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
          editable={isEditable}
        />
        <TextInput
          style={styles.input}
          placeholder="Payment Details"
          value={paymentDetails}
          onChangeText={setPaymentDetails}
          editable={isEditable}
        />
        <Text style={styles.subTitle}>Group Expenses</Text>
        <View style={styles.sortPicker}>
          <Text>Sort by: </Text>
          <Picker
            selectedValue={sortOption}
            onValueChange={(itemValue) => handleSortChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Date" value="date" />
            <Picker.Item label="Alphabetically" value="alphabetically" />
            <Picker.Item label="Amount" value="amount" />
          </Picker>
        </View>
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
          style={styles.expensesList}
        />
        <Text style={styles.subTitle}>Friends</Text>
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          style={styles.friendsList}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

