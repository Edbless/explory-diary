import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    if (currentUser) {
      fetchEntries();
    }
  }, [currentUser]);

  const fetchEntries = async () => {
    try {
      const q = query(
        collection(db, 'entries'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const entriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(entry => entry.location?.lat && entry.location?.lng);
      
      setEntries(entriesData);
      
      // Calculate center based on entries
      if (entriesData.length > 0) {
        const avgLat = entriesData.reduce((sum, entry) => sum + parseFloat(entry.location.lat), 0) / entriesData.length;
        const avgLng = entriesData.reduce((sum, entry) => sum + parseFloat(entry.location.lng), 0) / entriesData.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(entriesData.length === 1 ? 10 : 4);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your adventure map...</div>;
  }

  return (
    <div>
      <div className="card">
        <h1>Adventure Map</h1>
        <p>Explore all the places you've visited on your adventures.</p>
        
        {entries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No locations to display yet. Add some entries with locations to see them on the map!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <strong>{entries.length}</strong> adventure{entries.length !== 1 ? 's' : ''} mapped
            </div>
            
            <div className="map-container">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {entries.map(entry => (
                  <Marker
                    key={entry.id}
                    position={[parseFloat(entry.location.lat), parseFloat(entry.location.lng)]}
                  >
                    <Popup maxWidth={300}>
                      <div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{entry.title}</h3>
                        
                        {entry.date && (
                          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                            {format(new Date(entry.date), 'MMM dd, yyyy')}
                          </p>
                        )}
                        
                        {entry.location.address && (
                          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontStyle: 'italic' }}>
                            {entry.location.address}
                          </p>
                        )}
                        
                        {entry.imageUrl && (
                          <img 
                            src={entry.imageUrl} 
                            alt={entry.title}
                            style={{ 
                              width: '100%', 
                              maxHeight: '150px', 
                              objectFit: 'cover', 
                              borderRadius: '5px',
                              marginBottom: '10px'
                            }}
                          />
                        )}
                        
                        <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.4' }}>
                          {entry.story.length > 150 
                            ? `${entry.story.substring(0, 150)}...` 
                            : entry.story
                          }
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MapView;