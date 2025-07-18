import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { currentUser, loading } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="auth-debug">
      <div><strong>Auth Debug:</strong></div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>User: {currentUser ? 'Logged In' : 'Not Logged In'}</div>
      {currentUser && (
        <>
          <div>UID: {currentUser.uid}</div>
          <div>Email: {currentUser.email}</div>
          <div>Name: {currentUser.displayName || 'Not set'}</div>
        </>
      )}
    </div>
  );
};

export default AuthDebug;