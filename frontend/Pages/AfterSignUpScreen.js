import React, { useState, useEffect } from 'react';
import { ScrollView, Image, View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import HeaderBar from '../components/HeaderBar';
import styles from '../assets/styles/MainContainer';
import handleSignUp from '../src/functions/handleSignUp';
import { useAuth } from '../src/functions/status';
import { Feather } from '@expo/vector-icons';
import api from '../api';  


const AfterSignUpScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [iban, setIban] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [friends, setFriends] = useState([]);
  const { user } = useAuth();
  const [myId, setMyId] = useState(null);
  const authenticatedUserId = myId;
  const user_id = route.params?.user_id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await api.get(`/api/users/me/`);
        const userData = userResponse.data;
        setMyId(userData.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);



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

    if (!result.cancelled) {
      setProfilePicture(result.assets[0].uri);
    }
  };


  const handleSubmit = async() => {
    if (!name || !surname) {
      Alert.alert('Error', 'Name and Surname are mandatory.');
      
    }
    else{

        try {
          const formData = new FormData();
          if (profilePicture) {
            formData.append('profile_picture', {
              uri: profilePicture,
              name: 'profile.jpg',
              type: 'image/jpeg',
            });
          }
      
          formData.append('name', name);
          formData.append('surname', surname);
          formData.append('iban', iban);
        
          
      
          const response = await api.post('/api/update-profile/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          if (response.status === 200) {
            navigation.navigate('Home Page')
          } else {
            console.error('Failed to update profile');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.container}>
        <HeaderBar
          style={customStyles.header_container}
          navigation={navigation}
          goBack={false}
          person={false}
          home={false}
          bars={false}
          question={false}
          title='Complete Signing Up'
        />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={customStyles.description}>
            Welcome to PayBack! Please fill in the necessary details to ensure a seamless experience.
          </Text>
          <View style={customStyles.formGroup}>
            <Text style={customStyles.label}>Profile Picture (optional)</Text>
            {profilePicture && (
              <Image source={{ uri: profilePicture }} style={customStyles.profilePicture} />
            )}
            <Button title="Pick an image" onPress={pickImage} />
          </View>
          <Text style={customStyles.label2}>* Enter your valid name and surname as it will be used for your payment details *</Text>
          <View style={customStyles.formGroup}>
            <Text style={customStyles.label}>Name</Text>
            <TextInput
              style={customStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>
          <View style={customStyles.formGroup}>
            <Text style={customStyles.label}>Surname</Text>
            <TextInput
              style={customStyles.input}
              value={surname}
              onChangeText={setSurname}
              placeholder="Enter your surname"
            />
          </View>
          <View style={customStyles.formGroup}>
            <Text style={customStyles.label}>IBAN </Text>
            <TextInput
              style={customStyles.input}
              value={iban}
              onChangeText={setIban}
              placeholder="Enter your IBAN"
              keyboardType="numeric"
            />
          </View>

       
          <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const customStyles = StyleSheet.create({
  header_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginHorizontal: 20,
  },
  label2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginHorizontal: 35,
    color: 'red',
    align: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginHorizontal: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    alignSelf: 'center',
  },
  scrollView: {
    padding: 20,
  },
  container: {
    flex: 1,
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendsList: {
    marginHorizontal: 20,
  },
  addIcon: {
    marginRight: 10,
  },
  addFriendsText: {
    fontSize: 16,
    color: 'blue',
  },
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AfterSignUpScreen;
