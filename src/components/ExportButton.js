import React, { useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Download } from 'lucide-react';
import { exportToJSON } from '../utils/helpers';

const ExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const q = query(collection(db, 'entries'));
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to ISO string for JSON export
        createdAt: doc.data().createdAt?.toDate().toISOString()
      }));
      
      exportToJSON(entries);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="btn btn-secondary"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontSize: '14px'
      }}
    >
      <Download size={16} />
      {isExporting ? 'Exporting...' : 'Export Data'}
    </button>
  );
};

export default ExportButton;