import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, XCircle, Database } from 'lucide-react';

const DatabaseTest = () => {
  const { currentUser } = useAuth();
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);

  const runDatabaseTest = async () => {
    if (!currentUser) {
      setTestResult('❌ No user logged in');
      return;
    }

    setTesting(true);
    setTestResult('🔄 Testing database connection...');

    try {
      // Test 1: Create a test document
      const testData = {
        test: true,
        message: 'Database connection test',
        userId: currentUser.uid,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'test'), testData);
      setTestResult('✅ Database write successful! Document ID: ' + docRef.id);

      // Test 2: Clean up - delete the test document
      setTimeout(async () => {
        try {
          await deleteDoc(doc(db, 'test', docRef.id));
          setTestResult(prev => prev + '\n✅ Test document cleaned up successfully!');
        } catch (cleanupError) {
          console.warn('Could not clean up test document:', cleanupError);
        }
      }, 2000);

    } catch (error) {
      console.error('Database test failed:', error);
      
      let errorMsg = '❌ Database test failed: ';
      switch (error.code) {
        case 'permission-denied':
          errorMsg += 'Permission denied - check Firebase security rules';
          break;
        case 'unauthenticated':
          errorMsg += 'User not authenticated';
          break;
        case 'unavailable':
          errorMsg += 'Database unavailable';
          break;
        default:
          errorMsg += error.message;
      }
      
      setTestResult(errorMsg);
    } finally {
      setTesting(false);
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
        <Database size={20} />
        Database Connection Test
      </h3>
      
      <button 
        onClick={runDatabaseTest}
        disabled={testing || !currentUser}
        className="btn btn-secondary"
        style={{ marginBottom: '1rem' }}
      >
        {testing ? 'Testing...' : 'Test Database'}
      </button>

      {testResult && (
        <div style={{ 
          padding: '0.75rem', 
          background: testResult.includes('❌') ? '#fee2e2' : '#dcfce7',
          color: testResult.includes('❌') ? '#dc2626' : '#16a34a',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          whiteSpace: 'pre-line'
        }}>
          {testResult}
        </div>
      )}

      {!currentUser && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Please log in to test the database connection.
        </p>
      )}
    </div>
  );
};

export default DatabaseTest;