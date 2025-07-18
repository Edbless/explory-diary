import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchFilter = ({ onSearch, onFilter, totalEntries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    hasLocation: false,
    hasPhoto: false
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateFrom: '',
      dateTo: '',
      hasLocation: false,
      hasPhoto: false
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    onFilter(clearedFilters);
    onSearch('');
  };

  const hasActiveFilters = searchTerm || filters.dateFrom || filters.dateTo || filters.hasLocation || filters.hasPhoto;

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            type="text"
            placeholder="Search your adventures..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Filter size={16} />
          Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn"
            style={{ 
              backgroundColor: '#dc3545',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              style={{ fontSize: '14px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              style={{ fontSize: '14px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={filters.hasLocation}
                onChange={(e) => handleFilterChange('hasLocation', e.target.checked)}
              />
              Has Location
            </label>
          </div>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={filters.hasPhoto}
                onChange={(e) => handleFilterChange('hasPhoto', e.target.checked)}
              />
              Has Photo
            </label>
          </div>
        </div>
      )}

      <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
        Showing {totalEntries} adventure{totalEntries !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default SearchFilter;