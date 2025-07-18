import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [location, setLocation] = useState(initialLocation || { lat: '', lng: '', address: '' });
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (location.lat && location.lng) {
      onLocationSelect(location);
    }
  }, [location, onLocationSelect]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Location found: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
        
        try {
          // Try multiple geocoding services
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          try {
            // First try OpenCage
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=657e5cf3f27e4f7a889ec726ca168463&limit=1`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              address = data.results[0].formatted;
            }
          } catch (geocodeError) {
            console.warn('Geocoding failed, using coordinates:', geocodeError);
          }
          
          setLocation({
            lat: latitude,
            lng: longitude,
            address: address
          });
        } catch (error) {
          console.error('Error processing location:', error);
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
        
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        alert(errorMessage + ' You can enter the location manually.');
      },
      options
    );
  };

  const handleManualLocationChange = (field, value) => {
    setLocation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="location-picker">
      <div className="form-group">
        <label>Location</label>
        <div style={{ marginBottom: '10px' }}>
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="btn btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <Navigation size={16} />
            <span>{isGettingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Latitude"
            value={location.lat}
            onChange={(e) => handleManualLocationChange('lat', e.target.value)}
            step="any"
            style={{ fontSize: '0.875rem' }}
          />
          <input
            type="number"
            placeholder="Longitude"
            value={location.lng}
            onChange={(e) => handleManualLocationChange('lng', e.target.value)}
            step="any"
            style={{ fontSize: '0.875rem' }}
          />
        </div>
        
        <input
          type="text"
          placeholder="Address or place name"
          value={location.address}
          onChange={(e) => handleManualLocationChange('address', e.target.value)}
        />
        
        {location.lat && location.lng && (
          <div className="flex items-center gap-2" style={{ marginTop: '8px', color: '#666', flexWrap: 'wrap' }}>
            <MapPin size={16} />
            <small style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
              {parseFloat(location.lat).toFixed(6)}, {parseFloat(location.lng).toFixed(6)}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;