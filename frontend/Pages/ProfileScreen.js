import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';
import useProfile from '../src/functions/fetchProfile';
import styles from '../assets/styles/MainContainer';
import * as ImagePicker from 'expo-image-picker';
import api from '../api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';


const ProfileScreen = ({ navigation, route }) => {
  const [name, setName] = useState('John');
  const [surname, setSurname] = useState('Doe');
  const [paymentDetails, setPaymentDetails] = useState('IBAN: 123456789');
  const [profilePicture, setProfilePicture] = useState(null); // Initialize profile picture state
  const [email, setEmail] = useState(null);
  const [friends, setFriends] = useState([]);
  // Fetch user profile data including the profile picture
  const { user_id } = route.params; // Extracting user_id from route params
  console.log(user_id)
  // Fetch user profile data including the profile picture
  const fetchProfileData = async (userId) => {
    try {
      const response = await api.get(`/api/user-profile/${userId}/`);
      const profileData = response.data;
      setProfilePicture(profileData.profile_picture); // Set the profile picture in the state
      setName(profileData.name);
      setSurname(profileData.surname);
      setPaymentDetails(profileData.iban);
      setEmail(profileData.email);
      setFriends(profileData.friends); 
      console.log("kgbdabc"+friends)
      console.log(profileData.friends)
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Call fetchProfileData on component mount
  useEffect(() => {
    fetchProfileData(user_id);
  }, [user_id]);
  console.log(profilePicture);
  // Return profile data as an array
  navigation.addListener('focus', () => {
    fetchProfileData(user_id);
  });

  console.log(profilePicture);

  const [sortOption, setSortOption] = useState('date');
  const [isEditable, setIsEditable] = useState(false);
  console.log(profilePicture);
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null)
 
  useEffect(() => {
    setImage(profilePicture);
    setOriginalImage(profilePicture);
  }, [profilePicture]);


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
            // Handle success
            setIsEditable(false);
        } else {
            // Handle error
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
      <View style={stylesprofile.container_main}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Profile</Text>
          
          <View style={stylesprofile.img}>
            
            {image && <Image source={{ uri: image }} style={stylesprofile.tempprofilepic} />}
            {isEditable && <Button title="Pick an image from camera roll" onPress={pickImage} />}
          </View>
          <View style={stylesprofile.titleContainer}>
            {isEditable ? (
              <>
                <Button title="Done" onPress={handleDoneEditing} />
                <Button title="Cancel" onPress={handleCancelEditing} />
              </>
            ) : (
              <Button title="Edit" onPress={handleEditProfile} />
            )}
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
          <Text style={stylesprofile.subTitle}>My Friends</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddFriends')}>
              <Feather name="plus-circle" size={24} color="blue" marginRight = {40} />
          </TouchableOpacity>
          </View>
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            style={stylesprofile.friendsList}
          />
          
        </ScrollView>
      </View>
    </View>
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
  sortPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 90,
    marginVertical :10,
    paddingBottom: 20,
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
    borderRadius : 15,
    paddingRight: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 300,
    justifyContent: 's', // This will move the button and title to opposite ends
    marginBottom: 10, // Add some spacing at the bottom
  },
  expensesList: {
    height :110,
    marginTop: 30,
    marginBottom: 20,
    paddingRight:10, 
    width: '90%',
  },
  groupextitle:{
    paddingTop: 15,
    fontSize: 15,
    fontWeight: 'bold'
  },
  img_container: {
    marginVertical: 20,
    paddingBottom: 20,
    flex: 1,
    justifyContent: 'center',
  },

  img: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // make the image circular
    marginTop: 10,
  },
  container_main: {
      flexGrow: 1,
      height: '90%',
      width: 425,
      padding: 20,
  },
  tempprofilepic:{
    width: 100,
    height: 100,
    borderRadius: 100, // make the image circular
    marginTop: 10,
  },
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

})

export default ProfileScreen;
