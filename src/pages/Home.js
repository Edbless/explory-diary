import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { MapPin, Camera, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Stats from '../components/Stats';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { currentUser } = useAuth();
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalEntries: 0, 
    totalPlaces: 0, 
    totalPhotos: 0, 
    totalCountries: 0 
  });

  useEffect(() => {
    if (currentUser) {
      fetchRecentEntries();
      fetchStats();
    }
  }, [currentUser]);

  const fetchRecentEntries = async () => {
    try {
      const q = query(
        collection(db, 'entries'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentEntries(entries);
    } catch (error) {
      console.error('Error fetching recent entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const q = query(
        collection(db, 'entries'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => doc.data());
      
      const uniquePlaces = new Set(entries.map(entry => 
        `${entry.location?.lat},${entry.location?.lng}`
      ).filter(coord => coord !== 'undefined,undefined'));
      
      const totalPhotos = entries.filter(entry => entry.imageUrl).length;
      
      // Simple country estimation based on unique locations (this could be enhanced with reverse geocoding)
      const estimatedCountries = Math.min(uniquePlaces.size, Math.ceil(uniquePlaces.size / 3));
      
      setStats({
        totalEntries: entries.length,
        totalPlaces: uniquePlaces.size,
        totalPhotos: totalPhotos,
        totalCountries: estimatedCountries
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your adventure dashboard..." />;
  }

  return (
    <div>
      <div className="card">
        <div className="flex justify-between items-center flex-col-mobile gap-4" style={{ marginBottom: '20px' }}>
          <div className="text-center-mobile">
            <h1 className="text-3xl" style={{ margin: '0 0 10px 0' }}>Welcome to Your Explorer Diary</h1>
            <p className="text-base" style={{ margin: 0, color: '#666' }}>Document your adventures, capture memories, and map your journey around the world.</p>
          </div>
          <Link 
            to="/add" 
            className="btn btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              textDecoration: 'none',
              fontSize: '16px',
              padding: '12px 20px',
              minWidth: 'fit-content'
            }}
          >
            <Plus size={20} />
            <span className="hidden-mobile">Add Adventure</span>
            <span className="visible-mobile">Add</span>
          </Link>
        </div>
      </div>

      <Stats stats={stats} />

      {recentEntries.length > 0 && (
        <div className="card">
          <h2 className="text-2xl" style={{ marginBottom: '20px' }}>Recent Adventures</h2>
          {recentEntries.map(entry => (
            <div key={entry.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <div className="flex justify-between items-start flex-col-mobile gap-2" style={{ marginBottom: '10px' }}>
                <h3 className="text-xl" style={{ margin: 0 }}>{entry.title}</h3>
                <small className="text-sm" style={{ color: '#666', whiteSpace: 'nowrap' }}>
                  {entry.date && format(new Date(entry.date), 'MMM dd, yyyy')}
                </small>
              </div>
              
              {entry.location?.address && (
                <div className="flex items-center gap-2" style={{ marginBottom: '10px', color: '#666', flexWrap: 'wrap' }}>
                  <MapPin size={16} />
                  <span className="text-sm" style={{ wordBreak: 'break-word' }}>{entry.location.address}</span>
                </div>
              )}
              
              <p className="text-base" style={{ marginBottom: '10px', lineHeight: '1.5' }}>
                {entry.story.substring(0, 150)}...
              </p>
              
              {entry.imageUrl && (
                <div className="flex items-center gap-2" style={{ color: '#666' }}>
                  <Camera size={16} />
                  <span className="text-sm">Photo attached</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {recentEntries.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 className="text-2xl" style={{ marginBottom: '15px' }}>Start Your Adventure</h2>
          <p className="text-base" style={{ margin: 0, lineHeight: '1.6' }}>You haven't added any entries yet. Click "Add Adventure" to document your first adventure!</p>
        </div>
      )}
    </div>
  );
};

export default Home;