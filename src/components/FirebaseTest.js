import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';

const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test if Firebase is properly initialized
        console.log('Firebase Auth instance:', auth);
        console.log('Firebase Auth app:', auth.app);
        console.log('Firebase Auth config:', auth.config);
        
        setConnectionStatus('Firebase initialized successfully');
      } catch (error) {
        console.error('Firebase connection error:', error);
        setConnectionStatus(`Firebase error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>Firebase Status: {connectionStatus}</div>
    </div>
  );
};

export default FirebaseTest;