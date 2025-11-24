import React, { useState, useRef, useEffect } from 'react';
import { mockCities } from '../data/mockData';

const Navbar = ({ onOpenLogModal, onNavigate, currentView, onLogout, user, userLocation, onUpdateLocation }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const dropdownRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, locationRef]);

  const filteredCities = mockCities.filter(city =>
    city.toLowerCase().includes(locationQuery.toLowerCase())
  ).slice(0, 5);

  const handleLocationSelect = (city) => {
    onUpdateLocation(city);
    setShowLocationSearch(false);
    setLocationQuery('');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="logo" onClick={() => onNavigate('feed')} style={{ cursor: 'pointer' }}>
          <span role="img" aria-label="pizza">🍕</span> FoodSocial
        </div>

        <div className="location-picker-wrapper" ref={locationRef}>
          <button
            className="location-btn"
            onClick={() => setShowLocationSearch(!showLocationSearch)}
          >
            📍 {userLocation}
          </button>

          {showLocationSearch && (
            <div className="location-dropdown">
              <input
                type="text"
                className="location-search"
                placeholder="Search city..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                autoFocus
              />
              <div className="city-list">
                {filteredCities.map((city, index) => (
                  <button
                    key={index}
                    className="city-item"
                    onClick={() => handleLocationSelect(city)}
                  >
                    {city}
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <div className="no-results">No cities found</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${currentView === 'feed' ? 'active' : ''}`}
            onClick={() => onNavigate('feed')}
          >
            Feed
          </button>
          <button
            className={`nav-link ${currentView === 'search' ? 'active' : ''}`}
            onClick={() => onNavigate('search')}
          >
            Search
          </button>
          <button
            className={`nav-link ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            Profile
          </button>
          <button className="btn btn-primary" onClick={onOpenLogModal}>
            + Log Visit
          </button>

          <div className="settings-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="nav-link settings-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="settings-icon">⚙️</span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-name">{user?.name}</div>
                  <div className="user-handle">{user?.handle}</div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => { onNavigate('profile'); setShowDropdown(false); }}>
                  Account Info
                </button>
                <button className="dropdown-item">Settings</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .navbar {
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: 15px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .location-picker-wrapper {
          position: relative;
          margin: 0 20px;
        }
        .location-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .location-btn:hover {
          border-color: var(--accent-primary);
          background: var(--bg-secondary);
        }
        .location-dropdown {
          position: absolute;
          top: 120%;
          left: 50%;
          transform: translateX(-50%);
          width: 250px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 10px;
          z-index: 1000;
        }
        .location-search {
          width: 100%;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--bg-tertiary);
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .city-list {
          max-height: 200px;
          overflow-y: auto;
        }
        .city-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }
        .city-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .no-results {
          padding: 10px;
          text-align: center;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-link {
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.2s;
          font-size: 1rem;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
        }
        .settings-dropdown-wrapper {
          position: relative;
          margin-left: 10px;
        }
        .settings-btn {
          font-size: 1.2rem;
          padding: 5px;
          display: flex;
          align-items: center;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          width: 200px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          margin-top: 10px;
          padding: 5px 0;
          z-index: 1000;
        }
        .dropdown-header {
          padding: 10px 15px;
        }
        .user-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .user-handle {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .dropdown-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 5px 0;
        }
        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 15px;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }
        .dropdown-item:hover {
          background-color: var(--bg-tertiary);
        }
        .dropdown-item.logout {
          color: var(--accent-primary);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
