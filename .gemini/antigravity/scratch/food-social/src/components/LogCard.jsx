import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

const LogCard = ({ log, onDelete, onEdit }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { user } = useAuth();

  if (!log || !log.user) {
    return <div className="log-card error">Invalid log data</div>;
  }

  // Check if current user owns this log.
  // Handle both string IDs (mock) and UUIDs (Supabase)
  const isOwner = user && (log.userId === user.id || log.userId === user.id?.toString());

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      if (onDelete) onDelete(log.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(log);
    setShowOptions(false);
  };

  const emojiMap = {
    'poor': '😞',
    'okay': '😐',
    'good': '🙂',
    'amazing': '🤩',
    'no': '❌',
    'maybe': '🤔',
    'yes': '✅'
  };

  const getRatingItems = () => {
    const items = [
      { label: 'Food', value: log.ratings.food },
    ];

    if (log.visitType === 'Dine In') {
      items.push({ label: 'Service', value: log.ratings.service });
      items.push({ label: 'Ambience', value: log.ratings.ambience });
    } else if (log.visitType === 'Take Out') {
      items.push({ label: 'Packaging', value: log.ratings.packaging });
      items.push({ label: 'Service', value: log.ratings.store_service });
    } else if (log.visitType === 'Delivery') {
      items.push({ label: 'Packaging', value: log.ratings.packaging });
    }

    items.push({ label: 'Value', value: log.ratings.value });
    items.push({ label: 'Return', value: log.ratings.return_intent });

    return items;
  };

  return (
    <div className="log-card">
      <div className="log-header">
        <div className="user-info">
          <img src={log.user.avatar} alt={log.user.name} className="avatar" />
          <div>
            <div className="user-name">{log.user.name}</div>
            <div className="user-handle">{log.user.handle}</div>
          </div>
        </div>
        <div className="header-actions">
          <div className="log-meta">
            <span className="visit-type-badge">{log.visitType}</span>
            <span className="log-date">{log.date}</span>
          </div>
          {isOwner && (
            <div className="options-wrapper">
              <button className="options-btn" onClick={() => setShowOptions(!showOptions)}>⋮</button>
              {showOptions && (
                <div className="options-menu">
                  <button className="option-item" onClick={handleEdit}>Edit</button>
                  <button className="option-item delete" onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="restaurant-info">
        <h3>{log.restaurant}</h3>
        <span className="location">{log.location}</span>
      </div>

      <div className="vibe-summary">
        {getRatingItems().map((item, index) => (
          item.value && (
            <div key={index} className="vibe-item" title={item.label}>
              <span className="vibe-emoji">{emojiMap[item.value]}</span>
              <span className="vibe-label">{item.label}</span>
            </div>
          )
        ))}
        {log.internalScore && (
          <div className="score-badge" title="Calculated Score">
            {log.internalScore}
          </div>
        )}
      </div>

      {log.content && <p className="log-content">{log.content}</p>}

      {log.taggedFriends && log.taggedFriends.length > 0 && (
        <div className="tagged-friends">
          With: {log.taggedFriends.map((friend, index) => (
            <span key={index} className="tagged-link">{friend.name}{index < log.taggedFriends.length - 1 ? ', ' : ''}</span>
          ))}
        </div>
      )}

      {log.image && (
        <div className="log-image-container">
          <img src={log.image} alt="Food" className="log-image" />
        </div>
      )}

      <style>{`
        .log-card {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid var(--border-color);
        }
        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        .user-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .user-handle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .header-actions {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-left: auto; /* Push to the right */
        }
        .log-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }
        .log-date {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .visit-type-badge {
          font-size: 0.7rem;
          text-transform: uppercase;
          background-color: var(--bg-tertiary);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--accent-secondary);
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .options-wrapper {
          position: relative;
        }
        .options-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 5px;
          line-height: 1;
        }
        .options-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-md);
          z-index: 10;
          min-width: 100px;
        }
        .option-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.9rem;
        }
        .option-item:hover {
          background-color: var(--bg-secondary);
        }
        .option-item.delete {
          color: var(--accent-primary);
        }
        .restaurant-info {
          margin-bottom: 15px;
        }
        .restaurant-info h3 {
          margin: 0 0 5px 0;
          color: var(--text-primary);
        }
        .location {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .vibe-summary {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          background-color: var(--bg-tertiary);
          padding: 10px;
          border-radius: var(--radius-sm);
          overflow-x: auto;
          align-items: center;
        }
        .vibe-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 50px;
        }
        .vibe-emoji {
          font-size: 1.2rem;
          margin-bottom: 2px;
        }
        .vibe-label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        .score-badge {
          background-color: var(--accent-primary);
          color: white;
          font-weight: 800;
          padding: 5px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          margin-left: auto;
        }
        .log-content {
          color: var(--text-primary);
          line-height: 1.5;
          margin-bottom: 15px;
        }
        .tagged-friends {
          margin-bottom: 15px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .tagged-link {
          color: var(--accent-secondary);
          font-weight: 500;
          margin-right: 5px;
        }
        .log-image-container {
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .log-image {
          width: 100%;
          height: auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default LogCard;
