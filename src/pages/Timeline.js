import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import EntryCard from '../components/EntryCard';
import SearchFilter from '../components/SearchFilter';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';

const Timeline = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for newest first, 'asc' for oldest first

  const fetchEntries = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'entries'),
        where('userId', '==', currentUser.uid),
        orderBy('date', sortOrder)
      );
      const querySnapshot = await getDocs(q);
      const entriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(entriesData);
      setFilteredEntries(entriesData);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, sortOrder]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredEntries(entries);
      return;
    }
    
    const filtered = entries.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntries(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...entries];
    
    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(filters.dateTo));
    }
    
    // Location filter
    if (filters.hasLocation) {
      filtered = filtered.filter(entry => entry.location?.lat && entry.location?.lng);
    }
    
    // Photo filter
    if (filters.hasPhoto) {
      filtered = filtered.filter(entry => entry.imageUrl);
    }
    
    setFilteredEntries(filtered);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your timeline..." />;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h1>Your Adventure Timeline</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <ExportButton />
            <button 
              onClick={toggleSortOrder}
              className="btn btn-secondary"
            >
              {sortOrder === 'desc' ? 'Oldest First' : 'Newest First'}
            </button>
          </div>
        </div>
        
        <SearchFilter 
          onSearch={handleSearch}
          onFilter={handleFilter}
          totalEntries={filteredEntries.length}
        />
        
        {filteredEntries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No adventures recorded yet. Start exploring and add your first entry!</p>
          </div>
        ) : (
          <div className="timeline">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} className="timeline-item">
                <EntryCard entry={entry} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;