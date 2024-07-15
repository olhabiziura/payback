import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import * as ImagePicker from 'expo-image-picker';
import api from '../api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import styles from '../assets/styles/MainContainer';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
const ProfileScreen = ({ navigation, route, requester_id }) => {
  const[username, setUsername] = useState('')
  const [name, setName] = useState('John');
  const [surname, setSurname] = useState('Doe');
  const [paymentDetails, setPaymentDetails] = useState('IBAN: 123456789');
  const [profilePicture, setProfilePicture] = useState(null);
  const [email, setEmail] = useState(null);
  const [friends, setFriends] = useState([]);
  const [amountOwed, setAmountOwed] = useState(0);
  const [amountOwedToYou, setAmountOwedToYou] = useState(0);
  const [myId, setMyId] = useState(null);
  const { user_id } = route.params;
  const authenticatedUserId = myId;

  const fetchUserData = async () => {
    try {
      const userResponse = await api.get(`/api/users/me/`);
      const userData = userResponse.data;
      setMyId(userData.id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchProfileData(user_id);
  }, [user_id]);

  const fetchProfileData = async (userId) => {
    try {
      const response = await api.get(`/api/user-profile/${userId}/`);
      const profileData = response.data;
      setProfilePicture(profileData.profile_picture);
      setName(profileData.user.name);
      setUsername(profileData.user.username);
      setSurname(profileData.user.surname);
      setPaymentDetails(profileData.iban);
      setEmail(profileData.user.email);
      setFriends(profileData.friends);
      setAmountOwed(profileData.amountOwed);
      setAmountOwedToYou(profileData.amountOwedToYou);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    setImage(profilePicture);
    setOriginalImage(profilePicture);
  }, [profilePicture]);

  navigation.addListener('focus', () => {
    fetchProfileData(user_id);
  });

  const [isEditable, setIsEditable] = useState(false);
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Profile', { user_id: item.id })}>
      <View style={styles.friendItem}>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleEditProfile = () => {
    setIsEditable(true);
    setOriginalImage(image);
  };

  const handleDoneEditing = async () => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: image,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('iban', paymentDetails);
      formData.append('email', email);

      const response = await api.post('/api/update-profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setIsEditable(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelEditing = () => {
    setImage(originalImage);
    setIsEditable(false);
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
        // Native Notify Indie Push Registration Code
        console.log(username, "there should be the username")
        unregisterIndieDevice(username, 22472, 'WZOyPqf6yGb8GudffQu8ZH');
        // End of Native Notify Code
    // Implement your logout logic here
    // For example, clear authentication tokens, navigate to the login screen, etc.
    navigation.navigate('Log In'); // Assuming 'Login' is the name of your login screen
  };

  return (
    <SafeAreaView style={stylesprofile.safeArea}>
      <HeaderBar
        style={styles.header_container}
        navigation={navigation}
        goBack={true}
        person={false}
        home={true}
        bars={true}
        question={true}
      />
      <View style={stylesprofile.container_main}>
        <ScrollView contentContainerStyle={stylesprofile.container_main}>
          <View style={stylesprofile.img}>
            {image && <Image source={{ uri: image }} style={stylesprofile.tempprofilepic} />}
            {isEditable && <Button title="Pick an image from camera roll" onPress={pickImage} />}
          </View>
          <View style={stylesprofile.titleContainer}>
            {authenticatedUserId === user_id ? (
              <>
                {isEditable ? (
                  <View style={stylesprofile.buttonContainer}>
                    <Button title="Done" onPress={handleDoneEditing} />
                    <Button title="Cancel" onPress={handleCancelEditing} />
                  </View>
                ) : (
                  <Button title="Edit" onPress={handleEditProfile} />
                )}
              </>
            ) : null}
          </View>
          <TextInput
            style={stylesprofile.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            editable={isEditable}
          />
          <TextInput
            style={stylesprofile.input}
            placeholder="Surname"
            value={surname}
            onChangeText={setSurname}
            editable={isEditable}
          />
          <TextInput
            style={stylesprofile.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            editable={isEditable}
          />
          <TextInput
            style={stylesprofile.input}
            placeholder="Payment Details"
            value={paymentDetails}
            onChangeText={setPaymentDetails}
            editable={isEditable}
          />
          <View style={stylesprofile.friendsContainer}>
            <Text style={stylesprofile.subTitle}>
              {authenticatedUserId === user_id ? 'My Friends' : `Friends of ${name}`}
            </Text>
            {authenticatedUserId === user_id ? (
              <>
                <TouchableOpacity onPress={() => navigation.navigate('AddFriends', { userId: user_id })}>
                  <Feather name="plus-circle" size={24} color="blue" marginRight={40} />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            style={stylesprofile.friendsList}
          />
          {authenticatedUserId !== user_id && (
            <View style={stylesprofile.amountsContainer}>
              <Text style={stylesprofile.amountText}>You owe to {name}: {amountOwed}</Text>
              <Text style={stylesprofile.amountText}>{name} owes you: {amountOwedToYou}</Text>
            </View>
          )}
          {authenticatedUserId === user_id && (
            <Button title="Logout" onPress={handleLogout} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const stylesprofile = StyleSheet.create({
  expenseItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseDescription: {
    fontSize: 16,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDate: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
    height: 40,
  },
  friendsList: {
    marginBottom: 20,
    width: '90%',
  },
  input: {
    height: '5%',
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 2,
    marginBottom: 15,
    paddingHorizontal: 0,
    textAlign: 'center',
    borderRadius: 15,
    paddingRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  img: {
    marginBottom: 20,
    alignItems: 'center',
    paddingRight: 30,
  },
  tempprofilepic: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginTop: 10,
  },
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountsContainer: {
    marginTop: 20,
  },
  amountText: {
    fontSize: 16,
    marginVertical: 5,
  },
  container_main: {
    flexGrow: 1,
    height: '90%',
    width: 425,
    paddingLeft: 10,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingTop: Platform.OS == "IOS" ? StatusBar.currentHeight : -50,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
});

export default ProfileScreen;
