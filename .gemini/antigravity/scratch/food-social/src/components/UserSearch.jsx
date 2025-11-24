import React, { useState } from 'react';
import { mockUsers } from '../data/mockData';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [following, setFollowing] = useState(['u2', 'u3']); // Mock following list

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFollow = (userId) => {
        if (following.includes(userId)) {
            setFollowing(following.filter(id => id !== userId));
        } else {
            setFollowing([...following, userId]);
        }
    };

    return (
        <div className="user-search">
            <div className="search-header">
                <h2>Find Foodies</h2>
                <input
                    type="text"
                    placeholder="Search by name or handle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="users-list">
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
            </div>

            <style>{`
        .user-search {
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
        .users-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .user-card {
          display: flex;
          align-items: center;
          background-color: var(--bg-secondary);
          padding: 15px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 15px;
        }
        .user-info {
          flex: 1;
        }
        .user-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .user-handle {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .user-location {
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
        .no-results {
          text-align: center;
          color: var(--text-secondary);
          padding: 20px;
        }
      `}</style>
        </div>
    );
};

export default UserSearch;
