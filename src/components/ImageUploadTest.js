import React, { useState } from 'react';
import { uploadToImgBB } from '../utils/imgbbUpload';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

const ImageUploadTest = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult('');
      setImageUrl('');
    }
  };

  const testUpload = async () => {
    if (!file) {
      setResult('❌ Please select a file first');
      return;
    }

    setUploading(true);
    setResult('🔄 Uploading to ImgBB...');

    try {
      const url = await uploadToImgBB(file, 'test_upload');
      setImageUrl(url);
      setResult('✅ Upload successful!');
    } catch (error) {
      setResult(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ 
      margin: '1rem 0', 
      padding: '1rem', 
      border: '1px solid var(--border-color)', 
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-secondary)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Upload size={20} />
        ImgBB Upload Test
      </h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ marginBottom: '0.5rem' }}
        />
        {file && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <button 
        onClick={testUpload}
        disabled={uploading || !file}
        className="btn btn-secondary"
        style={{ marginBottom: '1rem' }}
      >
        {uploading ? 'Uploading...' : 'Test Upload'}
      </button>

      {result && (
        <div style={{ 
          padding: '0.75rem', 
          background: result.includes('❌') ? '#fee2e2' : result.includes('✅') ? '#dcfce7' : '#fef3c7',
          color: result.includes('❌') ? '#dc2626' : result.includes('✅') ? '#16a34a' : '#d97706',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          {result}
        </div>
      )}

      {imageUrl && (
        <div>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Uploaded image:</p>
          <img 
            src={imageUrl} 
            alt="Uploaded test" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '200px', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadTest;