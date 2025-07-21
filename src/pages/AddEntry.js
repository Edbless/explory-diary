import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { uploadToImgBB } from '../utils/imgbbUpload';
import LocationPicker from '../components/LocationPicker';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save } from 'lucide-react';

const AddEntry = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    date: new Date().toISOString().split('T')[0],
    location: null
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleImageSelect = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };



  const uploadImage = async (file) => {
    try {
      console.log('Uploading image to ImgBB...');
      console.log('File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      // Create a meaningful name for the image
      const timestamp = Date.now();
      const imageName = `adventure_${currentUser.uid}_${timestamp}`;
      
      // Upload to ImgBB
      const imageUrl = await uploadToImgBB(file, imageName);
      
      console.log('Image uploaded successfully to ImgBB:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Re-throw the error with the original message from imgbbUpload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.story.trim()) {
      setMessage('Please fill in all required fields.');
      return;
    }

    if (!currentUser) {
      setMessage('You must be logged in to save an adventure.');
      return;
    }

    setLoading(true);
    setMessage('Saving adventure...');

    try {
      let imageUrl = null;
      
      // Upload image first if exists
      if (image) {
        try {
          setMessage('Uploading image...');
          imageUrl = await uploadImage(image);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          
          // Ask user if they want to save without image
          const saveWithoutImage = window.confirm(
            `Image upload failed: ${uploadError.message}\n\nWould you like to save your adventure without the image?`
          );
          
          if (!saveWithoutImage) {
            setMessage('Adventure not saved. Please try again with a smaller image or better internet connection.');
            return;
          }
          
          setMessage('Saving adventure without image...');
          imageUrl = null;
        }
      }

      // Prepare entry data
      const entryData = {
        title: formData.title.trim(),
        story: formData.story.trim(),
        date: formData.date,
        location: formData.location || null,
        imageUrl: imageUrl || null,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      setMessage('Saving to database...');
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'entries'), entryData);
      
      setMessage(imageUrl ? 'Adventure saved successfully! 🎉' : 'Adventure saved successfully (without image)! 🎉');
      
      // Reset form
      setFormData({
        title: '',
        story: '',
        date: new Date().toISOString().split('T')[0],
        location: null
      });
      setImage(null);
      setImagePreview(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
      
    } catch (error) {
      console.error('Error saving adventure:', error);
      
      let errorMessage = 'Failed to save adventure. ';
      
      switch (error.code) {
        case 'permission-denied':
          errorMessage += 'You don\'t have permission to save entries. Please check your account.';
          break;
        case 'unavailable':
          errorMessage += 'Database is currently unavailable. Please try again later.';
          break;
        case 'unauthenticated':
          errorMessage += 'Your session has expired. Please log in again.';
          break;
        case 'quota-exceeded':
          errorMessage += 'Storage quota exceeded. Please contact support.';
          break;
        case 'network-request-failed':
          errorMessage += 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage += `${error.message}`;
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Add New Adventure</h1>
        
      {message && (
        <div className={message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Give your adventure a title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <LocationPicker 
          onLocationSelect={handleLocationSelect}
          initialLocation={formData.location}
        />

        <div className="form-group">
          <label htmlFor="story">Your Story *</label>
          <textarea
            id="story"
            name="story"
            value={formData.story}
            onChange={handleInputChange}
            placeholder="Tell us about your adventure..."
            rows="6"
            required
          />
        </div>

        <ImageUpload
          onImageSelect={handleImageSelect}
          currentImage={imagePreview}
          onImageRemove={handleImageRemove}
        />

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '5px', width: '100%', justifyContent: 'center' }}
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Adventure'}
        </button>
      </form>
    </div>
  );
};

export default AddEntry;