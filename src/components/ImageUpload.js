import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

const ImageUpload = ({ onImageSelect, currentImage, onImageRemove }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  return (
    <div className="form-group">
      <label>
        <Camera size={20} style={{ marginRight: '5px' }} />
        Add Photo
      </label>
      
      {!currentImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? '#007bff' : '#ddd'}`,
            borderRadius: '10px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: dragOver ? '#f8f9ff' : '#f9f9f9',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => document.getElementById('image-input').click()}
        >
          <Upload size={32} color={dragOver ? '#007bff' : '#666'} style={{ marginBottom: '10px' }} />
          <p style={{ margin: '0 0 10px 0', color: '#666' }}>
            Drag and drop an image here, or click to select
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
            Supports JPG, PNG, GIF up to 10MB
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img 
            src={currentImage} 
            alt="Preview" 
            style={{ 
              maxWidth: '300px', 
              maxHeight: '200px', 
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          />
          <button
            type="button"
            onClick={onImageRemove}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(220, 53, 69, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => document.getElementById('image-input').click()}
              className="btn btn-secondary"
              style={{ fontSize: '14px', padding: '5px 15px' }}
            >
              Change Photo
            </button>
          </div>
        </div>
      )}
      
      <input
        type="file"
        id="image-input"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;