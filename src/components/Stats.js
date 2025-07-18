import React from 'react';
import { Calendar, MapPin, Camera, Globe } from 'lucide-react';

const Stats = ({ stats }) => {
  const statItems = [
    {
      icon: Calendar,
      value: stats.totalEntries || 0,
      label: 'Total Adventures',
      color: '#007bff'
    },
    {
      icon: MapPin,
      value: stats.totalPlaces || 0,
      label: 'Places Visited',
      color: '#28a745'
    },
    {
      icon: Camera,
      value: stats.totalPhotos || 0,
      label: 'Photos Captured',
      color: '#ffc107'
    },
    {
      icon: Globe,
      value: stats.totalCountries || 0,
      label: 'Countries Explored',
      color: '#dc3545'
    }
  ];

  return (
    <div className="card-grid" style={{ marginBottom: '20px' }}>
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div 
            key={index}
            className="card"
            style={{ 
              textAlign: 'center', 
              padding: '1.5rem 1rem', 
              backgroundColor: 'white',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }
            }}
          >
            <div className="flex justify-center mb-3">
              <div style={{
                padding: '12px',
                borderRadius: '50%',
                backgroundColor: `${item.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconComponent 
                  size={window.innerWidth <= 480 ? 24 : 28} 
                  color={item.color} 
                />
              </div>
            </div>
            <h3 className="text-2xl" style={{ 
              margin: '0 0 5px 0', 
              fontWeight: 'bold',
              color: item.color
            }}>
              {item.value}
            </h3>
            <p className="text-sm" style={{ 
              margin: 0, 
              color: '#666',
              fontWeight: '500',
              lineHeight: '1.4'
            }}>
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stats;