import React from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar, Camera, Edit, Trash2 } from 'lucide-react';

const EntryCard = ({ entry, onEdit, onDelete, showActions = false }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, flex: 1 }}>{entry.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666' }}>
            <Calendar size={16} />
            <span>{entry.date && format(new Date(entry.date), 'MMM dd, yyyy')}</span>
          </div>
          {showActions && (
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => onEdit(entry)}
                className="btn btn-secondary"
                style={{ padding: '5px 10px', fontSize: '14px' }}
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="btn"
                style={{ 
                  padding: '5px 10px', 
                  fontSize: '14px',
                  backgroundColor: '#dc3545',
                  color: 'white'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {entry.location?.address && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px', color: '#666' }}>
          <MapPin size={16} />
          <span>{entry.location.address}</span>
          {entry.location.lat && entry.location.lng && (
            <small style={{ marginLeft: '10px' }}>
              ({parseFloat(entry.location.lat).toFixed(4)}, {parseFloat(entry.location.lng).toFixed(4)})
            </small>
          )}
        </div>
      )}
      
      {entry.imageUrl && (
        <div style={{ marginBottom: '15px' }}>
          <img 
            src={entry.imageUrl} 
            alt={entry.title}
            className="entry-image"
            style={{ cursor: 'pointer' }}
            onClick={() => window.open(entry.imageUrl, '_blank')}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: '#666', fontSize: '14px' }}>
            <Camera size={14} />
            <span>Click to view full size</span>
          </div>
        </div>
      )}
      
      <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '15px' }}>
        {entry.story}
      </div>
      
      {entry.createdAt && (
        <div style={{ paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '14px', color: '#666' }}>
          Added {format(entry.createdAt.toDate(), 'MMM dd, yyyy \'at\' HH:mm')}
        </div>
      )}
    </div>
  );
};

export default EntryCard;