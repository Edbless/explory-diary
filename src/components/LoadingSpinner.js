import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading flex flex-col items-center justify-center gap-4" style={{ 
      padding: '2.5rem 1rem',
      minHeight: '200px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid var(--border-color)',
        borderTop: '4px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p className="text-base" style={{ 
        color: 'var(--text-secondary)', 
        margin: 0,
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;