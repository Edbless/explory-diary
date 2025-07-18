import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import LocationPicker from '../components/LocationPicker';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { Save } from 'lucide-react';

const AddEntry = () => {
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
    const timestamp = Date.now();
    const imageRef = ref(storage, `images/${timestamp}_${file.name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.story.trim()) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const entryData = {
        title: formData.title.trim(),
        story: formData.story.trim(),
        date: formData.date,
        location: formData.location,
        imageUrl,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'entries'), entryData);
      
      setMessage('Entry added successfully!');
      setFormData({
        title: '',
        story: '',
        date: new Date().toISOString().split('T')[0],
        location: null
      });
      setImage(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error adding entry:', error);
      setMessage('Error adding entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1>Add New Adventure</h1>
      
      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
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
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Adventure'}
        </button>
      </form>
    </div>
  );
};

export default AddEntry;