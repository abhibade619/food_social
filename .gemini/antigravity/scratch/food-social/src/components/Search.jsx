import React, { useState } from 'react';
import { mockUsers } from '../data/mockData';
import { popularRestaurants } from '../data/restaurants';

const Search = ({ onSelectRestaurant }) => {
    const [searchType, setSearchType] = useState('people'); // 'people' or 'restaurants'
    const [searchTerm, setSearchTerm] = useState('');
    const [following, setFollowing] = useState(['u2', 'u3']); // Mock following list

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRestaurants = popularRestaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFollow = (userId) => {
        if (following.includes(userId)) {
            setFollowing(following.filter(id => id !== userId));
        } else {
            setFollowing([...following, userId]);
        }
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <h2>Search</h2>
                <div className="search-type-toggle">
                    <button
                        className={`toggle-btn ${searchType === 'people' ? 'active' : ''}`}
                        onClick={() => setSearchType('people')}
                    >
                        People
                    </button>
                    <button
                        className={`toggle-btn ${searchType === 'restaurants' ? 'active' : ''}`}
                        onClick={() => setSearchType('restaurants')}
                    >
                        Restaurants
                    </button>
                </div>
                <input
                    type="text"
                    placeholder={searchType === 'people' ? "Search by name or handle..." : "Search by name, cuisine, or location..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="results-list">
                {searchType === 'people' ? (
                    <>
                        {filteredUsers.map(user => (
                            <div key={user.id} className="user-card">
                                <img src={user.avatar} alt={user.name} className="user-avatar" />
                                <div className="user-info">
                                    <div className="user-name">{user.name}</div>
                                    <div className="user-handle">{user.handle}</div>
                                    <div className="user-location">{user.state}, {user.country}</div>
                                </div>
                                <button
                                    className={`follow-btn ${following.includes(user.id) ? 'following' : ''}`}
                                    onClick={() => toggleFollow(user.id)}
                                >
                                    {following.includes(user.id) ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="no-results">No foodies found.</div>
                        )}
                    </>
                ) : (
                    <>
                        {filteredRestaurants.map(r => (
                            <div key={r.id} className="restaurant-card" onClick={() => onSelectRestaurant(r)}>
                                <div className="restaurant-info">
                                    <div className="restaurant-name">{r.name}</div>
                                    <div className="restaurant-meta">{r.cuisine} • {r.location}</div>
                                </div>
                                <div className="arrow-icon">→</div>
                            </div>
                        ))}
                        {filteredRestaurants.length === 0 && (
                            <div className="no-results">No restaurants found.</div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .search-page {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 0;
        }
        .search-header {
          margin-bottom: 30px;
        }
        .search-header h2 {
          margin-bottom: 15px;
          color: var(--text-primary);
        }
        .search-type-toggle {
          display: flex;
          background-color: var(--bg-secondary);
          padding: 4px;
          border-radius: var(--radius-md);
          margin-bottom: 15px;
        }
        .toggle-btn {
          flex: 1;
          padding: 8px;
          border: none;
          background: none;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .toggle-btn.active {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          font-weight: 600;
        }
        .search-input {
          width: 100%;
          padding: 12px 15px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 1rem;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .user-card, .restaurant-card {
          display: flex;
          align-items: center;
          background-color: var(--bg-secondary);
          padding: 15px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          transition: transform 0.2s;
        }
        .restaurant-card {
          cursor: pointer;
        }
        .restaurant-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-primary);
        }
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 15px;
        }
        .user-info, .restaurant-info {
          flex: 1;
        }
        .user-name, .restaurant-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .user-handle {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .user-location, .restaurant-meta {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin-top: 2px;
        }
        .follow-btn {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--accent-primary);
          background-color: transparent;
          color: var(--accent-primary);
        }
        .follow-btn:hover {
          background-color: rgba(255, 71, 87, 0.1);
        }
        .follow-btn.following {
          background-color: var(--accent-primary);
          color: white;
        }
        .arrow-icon {
          color: var(--text-secondary);
          font-size: 1.2rem;
        }
        .no-results {
          text-align: center;
          color: var(--text-secondary);
          padding: 20px;
        }
      `}</style>
        </div>
    );
};

export default Search;
