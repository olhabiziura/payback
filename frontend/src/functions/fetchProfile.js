// useProfile function
import { useState, useEffect } from 'react';
import api from '../../api';

const useProfile = () => {
  const [name, setName] = useState('John');
  const [surname, setSurname] = useState('Doe');
  const [paymentDetails, setPaymentDetails] = useState('IBAN: 123456789');
  const [profilePicture, setProfilePicture] = useState(null); // Initialize profile picture state
  const [email, setEmail] = useState(null);
  // Fetch user profile data including the profile picture
  const fetchProfileData = async () => {
    try {
      const response = await api.get('/api/user-profile/');
      const profileData = response.data;
      setProfilePicture(profileData.profile_picture); // Set the profile picture in the state
      setName(profileData.name);
      setSurname(profileData.surname);
      setPaymentDetails(profileData.iban);
      setEmail(profileData.email);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Call fetchProfileData on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);
  console.log(profilePicture);
  // Return profile data as an array
  return [name, setName, surname, setSurname, paymentDetails, setPaymentDetails, profilePicture, setProfilePicture, email, setEmail];
};

export default useProfile;
