import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '20px',
      background: '#dc3545',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <WifiOff size={16} />
      <span>You're offline</span>
    </div>
  );
};

export default OfflineIndicator;