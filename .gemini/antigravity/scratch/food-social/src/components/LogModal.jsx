import React, { useState, useEffect, useRef } from 'react';
import { popularRestaurants } from '../data/restaurants';
import { calculateInternalScore, mockUsers } from '../data/mockData';

const LogModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [restaurant, setRestaurant] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [visitType, setVisitType] = useState('Dine In');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ratings, setRatings] = useState({
    food: 'good',
    service: 'good',
    ambience: 'good',
    value: 'good',
    packaging: 'good',
    store_service: 'good',
    return_intent: 'yes'
  });
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  // Tagging state
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [tagQuery, setTagQuery] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const tagWrapperRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setRestaurant(initialData.restaurant || '');
        setCuisine(initialData.cuisine || '');
        setVisitType(initialData.visitType || 'Dine In');
        setDate(initialData.date || new Date().toISOString().split('T')[0]);
        setRatings(initialData.ratings || {
          food: 'good',
          service: 'good',
          ambience: 'good',
          value: 'good',
          packaging: 'good',
          store_service: 'good',
          return_intent: 'yes'
        });
        setContent(initialData.content || '');
        setImage(initialData.image || '');
        setTaggedFriends(initialData.taggedFriends || []);
      } else {
        // Reset form for new log
        setRestaurant('');
        setCuisine('');
        setVisitType('Dine In');
        setDate(new Date().toISOString().split('T')[0]);
        setRatings({
          food: 'good',
          service: 'good',
          ambience: 'good',
          value: 'good',
          packaging: 'good',
          store_service: 'good',
          return_intent: 'yes'
        });
        setContent('');
        setImage('');
        setTaggedFriends([]);
      }
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    // Click outside to close suggestions
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (tagWrapperRef.current && !tagWrapperRef.current.contains(event.target)) {
        setShowTagSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, tagWrapperRef]);

  const handleRestaurantChange = (e) => {
    const value = e.target.value;
    setRestaurant(value);

    if (value.length > 0) {
      const filtered = popularRestaurants.filter(r =>
        r.name.toLowerCase().includes(value.toLowerCase()) ||
        r.location.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectRestaurant = (r) => {
    setRestaurant(r.name);
    setCuisine(r.cuisine);
    setShowSuggestions(false);
  };

  const updateRating = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleTagQueryChange = (e) => {
    setTagQuery(e.target.value);
    setShowTagSuggestions(true);
  };

  const addTag = (user) => {
    if (!taggedFriends.find(f => f.id === user.id)) {
      setTaggedFriends([...taggedFriends, user]);
    }
    setTagQuery('');
    setShowTagSuggestions(false);
  };

  const removeTag = (userId) => {
    setTaggedFriends(taggedFriends.filter(f => f.id !== userId));
  };

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(tagQuery.toLowerCase()) &&
    !taggedFriends.find(f => f.id === u.id)
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const logData = {
      restaurant,
      cuisine: cuisine || 'Other', // Default if not selected from autocomplete
      visitType,
      ratings,
      content,
      image,
      date,
      taggedFriends
    };
    // Calculate internal score immediately for local state
    logData.internalScore = calculateInternalScore(logData);

    onSubmit(logData);
    onClose();
  };

  const RatingSelector = ({ label, category, options }) => (
    <div className="rating-row">
      <label>{label}</label>
      <div className="emoji-group">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`emoji-btn ${ratings[category] === option.value ? 'active' : ''}`}
            onClick={() => updateRating(category, option.value)}
            title={option.label}
          >
            {option.emoji}
          </button>
        ))}
      </div>
    </div>
  );

  const standardOptions = [
    { value: 'poor', emoji: '😞', label: 'Poor' },
    { value: 'okay', emoji: '😐', label: 'Okay' },
    { value: 'good', emoji: '🙂', label: 'Good' },
    { value: 'amazing', emoji: '🤩', label: 'Amazing' }
  ];

  const returnOptions = [
    { value: 'no', emoji: '❌', label: 'No' },
    { value: 'maybe', emoji: '🤔', label: 'Maybe' },
    { value: 'yes', emoji: '✅', label: 'Yes' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{initialData ? 'Edit Log' : 'Log a Visit'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" ref={wrapperRef}>
            <label>Restaurant Name</label>
            <div className="autocomplete-wrapper">
              <input
                type="text"
                value={restaurant}
                onChange={handleRestaurantChange}
                onFocus={() => restaurant && setShowSuggestions(true)}
                placeholder="Search for a place..."
                required
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map(r => (
                    <li key={r.id} onClick={() => selectRestaurant(r)}>
                      <div className="suggestion-name">{r.name}</div>
                      <div className="suggestion-meta">{r.cuisine} • {r.location}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Visit Type</label>
              <div className="visit-type-selector">
                {['Dine In', 'Take Out', 'Delivery'].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`type-btn ${visitType === type ? 'active' : ''}`}
                    onClick={() => setVisitType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="date-input"
              />
            </div>
          </div>

          <div className="form-group vibe-scorecard">
            <label className="section-label">Vibe Scorecard</label>
            <RatingSelector label="Food" category="food" options={standardOptions} />

            {visitType === 'Dine In' && (
              <>
                <RatingSelector label="Service" category="service" options={standardOptions} />
                <RatingSelector label="Ambience" category="ambience" options={standardOptions} />
              </>
            )}

            {visitType === 'Take Out' && (
              <>
                <RatingSelector label="Packaging" category="packaging" options={standardOptions} />
                <RatingSelector label="Store Service" category="store_service" options={standardOptions} />
              </>
            )}

            {visitType === 'Delivery' && (
              <RatingSelector label="Packaging" category="packaging" options={standardOptions} />
            )}

            <RatingSelector label="Value" category="value" options={standardOptions} />
            <RatingSelector label="Would you go again?" category="return_intent" options={returnOptions} />
          </div>

          <div className="form-group">
            <label>Review (Optional)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How was it?"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group" ref={tagWrapperRef}>
            <label>Tag Friends</label>
            <div className="tags-container">
              {taggedFriends.map(friend => (
                <span key={friend.id} className="tag-pill">
                  {friend.name}
                  <button type="button" onClick={() => removeTag(friend.id)}>&times;</button>
                </span>
              ))}
            </div>
            <div className="autocomplete-wrapper">
              <input
                type="text"
                value={tagQuery}
                onChange={handleTagQueryChange}
                onFocus={() => setShowTagSuggestions(true)}
                placeholder="Search friends..."
                className="tag-input"
              />
              {showTagSuggestions && tagQuery && filteredUsers.length > 0 && (
                <ul className="suggestions-list">
                  {filteredUsers.map(u => (
                    <li key={u.id} onClick={() => addTag(u)}>
                      <div className="suggestion-row">
                        <img src={u.avatar} alt={u.name} className="mini-avatar" />
                        <span className="suggestion-name">{u.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Photo URL (Optional)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <button type="submit" className="btn btn-primary full-width">{initialData ? 'Update Log' : 'Post Log'}</button>
        </form>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }
        .modal {
          background-color: var(--bg-secondary);
          padding: 30px;
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          color-scheme: dark; /* Forces native controls like date picker to be dark */
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .close-btn {
          font-size: 1.5rem;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
        }
        .close-btn:hover {
          color: var(--text-primary);
        }
        .form-group {
          margin-bottom: 20px;
          position: relative;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .section-label {
          color: var(--accent-primary) !important;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.8rem !important;
          margin-bottom: 15px !important;
        }
        .autocomplete-wrapper {
          position: relative;
        }
        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 0 0 var(--radius-sm) var(--radius-sm);
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
          list-style: none;
          margin-top: 4px;
          box-shadow: var(--shadow-md);
          padding: 0;
        }
        .suggestions-list li {
          padding: 10px 15px;
          cursor: pointer;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        .suggestions-list li:last-child {
          border-bottom: none;
        }
        .suggestions-list li:hover {
          background-color: var(--bg-secondary);
        }
        .suggestion-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        .suggestion-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .visit-type-selector {
          display: flex;
          gap: 10px;
        }
        .type-btn {
          flex: 1;
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          background-color: var(--bg-tertiary);
          transition: all 0.2s;
          cursor: pointer;
        }
        .type-btn.active {
          background-color: var(--accent-secondary);
          color: #121212;
          border-color: var(--accent-secondary);
          font-weight: 600;
        }
        .vibe-scorecard {
          background-color: var(--bg-tertiary);
          padding: 15px;
          border-radius: var(--radius-md);
        }
        .rating-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .rating-row:last-child {
          margin-bottom: 0;
        }
        .rating-row label {
          margin-bottom: 0;
          font-weight: 500;
          color: var(--text-primary);
        }
        .emoji-group {
          display: flex;
          gap: 5px;
          background-color: var(--bg-secondary);
          padding: 4px;
          border-radius: 20px;
        }
        .emoji-btn {
          font-size: 1.2rem;
          padding: 4px 8px;
          border-radius: 50%;
          opacity: 0.4;
          transition: all 0.2s;
          filter: grayscale(0.8);
          background: none;
          border: none;
          cursor: pointer;
        }
        .emoji-btn:hover {
          opacity: 0.7;
          transform: scale(1.1);
          filter: grayscale(0);
        }
        .emoji-btn.active {
          opacity: 1;
          background-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
          filter: grayscale(0);
        }
        .full-width {
          width: 100%;
          margin-top: 10px;
        }
        .form-row {
          display: flex;
          gap: 15px;
        }
        .form-row .form-group {
          flex: 1;
        }
        .date-input, input[type="text"], input[type="url"], textarea {
          width: 100%;
          padding: 10px;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: inherit;
        }
        /* Fix for autofill white background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px var(--bg-tertiary) inset !important;
            -webkit-text-fill-color: var(--text-primary) !important;
        }
        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 10px;
        }
        .tag-pill {
            background-color: var(--accent-secondary);
            color: #121212;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.85rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .tag-pill button {
            background: none;
            border: none;
            color: #121212;
            font-size: 1.1rem;
            line-height: 1;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
        }
        .suggestion-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .mini-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default LogModal;
