import api from "../../api";


const handleDoneEditing = async ({setIsEditable}) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: image,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });

      const response = await api.post('/api/upload-profile-picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // Handle success
        setIsEditable(false);
      } else {
        // Handle error
        console.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
export default handleDoneEditing;