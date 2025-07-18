import React, { useState } from 'react';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const FirebaseSetupGuide = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div style={{ margin: '2rem 0' }}>
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="btn btn-secondary"
        style={{ marginBottom: '1rem' }}
      >
        <AlertCircle size={16} />
        Firebase Setup Guide
      </button>

      {showGuide && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--danger-color)' }}>
            <AlertCircle size={20} style={{ marginRight: '0.5rem' }} />
            Authentication Not Working? Follow These Steps:
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4>1. Enable Authentication in Firebase Console</h4>
            <ol style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
              <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>Firebase Console <ExternalLink size={12} /></a></li>
              <li>Select your project: <strong>adventure-journal-20a28</strong></li>
              <li>Click on "Authentication" in the left sidebar</li>
              <li>Click "Get started" if you haven't set it up yet</li>
              <li>Go to the "Sign-in method" tab</li>
              <li>Click on "Email/Password"</li>
              <li>Enable "Email/Password" (first option)</li>
              <li>Click "Save"</li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4>2. Check Authorized Domains</h4>
            <ol style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
              <li>In the Authentication section, go to "Settings" tab</li>
              <li>Scroll down to "Authorized domains"</li>
              <li>Make sure <code>localhost</code> is in the list</li>
              <li>If not, click "Add domain" and add <code>localhost</code></li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4>3. Verify Project Configuration</h4>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <strong>Your current config:</strong>
              <pre style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>
                {`Project ID: adventure-journal-20a28
Auth Domain: adventure-journal-20a28.firebaseapp.com`}
              </pre>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4>4. Test Authentication</h4>
            <p>After enabling authentication:</p>
            <ol style={{ marginLeft: '1rem' }}>
              <li>Refresh this page</li>
              <li>Try creating a new account</li>
              <li>Check the browser console for any error messages</li>
              <li>Look at the debug info in the top-right corner</li>
            </ol>
          </div>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <h4 style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }}>
              <CheckCircle size={16} style={{ marginRight: '0.5rem' }} />
              Common Issues & Solutions:
            </h4>
            <ul style={{ marginLeft: '1rem', fontSize: '0.9rem' }}>
              <li><strong>auth/operation-not-allowed:</strong> Email/Password authentication is not enabled</li>
              <li><strong>auth/unauthorized-domain:</strong> localhost is not in authorized domains</li>
              <li><strong>auth/network-request-failed:</strong> Check your internet connection</li>
              <li><strong>auth/invalid-api-key:</strong> Firebase configuration is incorrect</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseSetupGuide;