import React, { useState, useEffect } from 'react';
import LogCard from './LogCard';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthProvider';

const Profile = ({ user, logs, onDeleteLog, onEditLog }) => {
    const { user: currentUser } = useAuth();
    if (!user) return <div className="profile">Loading profile...</div>;

    const [activeTab, setActiveTab] = useState('diary'); // 'diary' or 'hitlist'
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'rating'
    const [statFilter, setStatFilter] = useState('cuisine'); // 'cuisine' or 'location'
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'week', 'month', '90days', 'year'

    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(user.stats?.followers || 0);
    const [followingCount, setFollowingCount] = useState(user.stats?.following || 0);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const isOwnProfile = currentUser && (user.id === currentUser.id || user.id === currentUser.id?.toString());

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchFollowData = async () => {
            try {
                // Fetch followers count
                const { count: followers } = await supabase
                    .from('follows')
                    .select('*', { count: 'exact', head: true })
                    .eq('following_id', user.id);

                if (followers !== null) setFollowersCount(followers);

                // Fetch following count
                const { count: following } = await supabase
                    .from('follows')
                    .select('*', { count: 'exact', head: true })
                    .eq('follower_id', user.id);

                if (following !== null) setFollowingCount(following);

                // Check if current user is following this profile
                if (currentUser && !isOwnProfile) {
                    const { data } = await supabase
                        .from('follows')
                        .select('*')
                        .eq('follower_id', currentUser.id)
                        .eq('following_id', user.id)
                        .single();

                    setIsFollowing(!!data);
                }
            } catch (error) {
                console.error('Error fetching follow data:', error);
            }
        };

        fetchFollowData();
    }, [user.id, currentUser, isOwnProfile]);

    const handleFollow = async () => {
        if (!currentUser || loadingFollow) return;
        setLoadingFollow(true);

        try {
            if (isFollowing) {
                // Unfollow
                const { error } = await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', currentUser.id)
                    .eq('following_id', user.id);

                if (error) throw error;
                setIsFollowing(false);
                setFollowersCount(prev => Math.max(0, prev - 1));
            } else {
                // Follow
                const { error } = await supabase
                    .from('follows')
                    .insert([{ follower_id: currentUser.id, following_id: user.id }]);

                if (error) throw error;
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            alert('Failed to update follow status');
        } finally {
            setLoadingFollow(false);
        }
    };

    const userLogs = logs.filter(log => log.userId === user.id || log.userId === user.id?.toString());

    // Filter logs by time
    const filteredLogsByTime = userLogs.filter(log => {
        if (timeFilter === 'all') return true;
        const logDate = new Date(log.date);
        const now = new Date();
        const diffTime = Math.abs(now - logDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeFilter === 'week') return diffDays <= 7;
        if (timeFilter === 'month') return diffDays <= 30;
        if (timeFilter === '90days') return diffDays <= 90;
        if (timeFilter === 'year') return diffDays <= 365;
        return true;
    });

    // Calculate Stats based on filter
    const statsData = filteredLogsByTime.reduce((acc, log) => {
        const key = statFilter === 'cuisine' ? (log.cuisine || 'Other') : log.location;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const sortedStats = Object.entries(statsData)
        .sort(([, a], [, b]) => b - a);

    const sortedLogs = [...filteredLogsByTime].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'rating') {
            return parseFloat(b.internalScore) - parseFloat(a.internalScore);
        }
        return 0;
    });

    return (
        <div className="profile">
            <div className="profile-header">
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
                <div className="profile-info">
                    <div className="profile-name-row">
                        <h1 className="profile-name">{user.name}</h1>
                        {!isOwnProfile && (
                            <button
                                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                onClick={handleFollow}
                                disabled={loadingFollow}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>
                    <p className="profile-handle">{user.handle}</p>
                    <div className="profile-location">
                        📍 {user.state || 'New York'}, {user.country || 'USA'}
                    </div>
                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-value">{userLogs.length}</span>
                            <span className="stat-label">Logs</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{followersCount}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{followingCount}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <div className="stats-controls">
                    <div className="stats-filter-type">
                        <button
                            className={`filter-btn ${statFilter === 'cuisine' ? 'active' : ''}`}
                            onClick={() => setStatFilter('cuisine')}
                        >
                            Cuisine
                        </button>
                        <button
                            className={`filter-btn ${statFilter === 'location' ? 'active' : ''}`}
                            onClick={() => setStatFilter('location')}
                        >
                            Location
                        </button>
                    </div>
                    <select
                        className="time-select"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <option value="all">All Time</option>
                        <option value="week">This Week</option>
                        <option value="month">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>

                <div className="stats-pills">
                    <div className="stat-pill all-pill">
                        <span className="pill-name">All</span>
                        <span className="pill-count">{filteredLogsByTime.length}</span>
                    </div>
                    {sortedStats.map(([key, count]) => (
                        <div key={key} className="stat-pill">
                            <span className="pill-name">{key}</span>
                            <span className="pill-count">{count}</span>
                        </div>
                    ))}
                    {sortedStats.length === 0 && filteredLogsByTime.length === 0 && (
                        <span className="no-stats">No logs in this period</span>
                    )}
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'diary' ? 'active' : ''}`}
                    onClick={() => setActiveTab('diary')}
                >
                    Diary
                </button>
                <button
                    className={`tab-btn ${activeTab === 'hitlist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('hitlist')}
                >
                    Hit List
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'diary' && (
                    <>
                        <div className="content-controls">
                            <h2 className="section-title">Recent Logs</h2>
                            <div className="sort-controls">
                                <span className="sort-label">Sort by:</span>
                                <button
                                    className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                                    onClick={() => setSortBy('date')}
                                >
                                    Date
                                </button>
                                <button
                                    className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                                    onClick={() => setSortBy('rating')}
                                >
                                    Rating
                                </button>
                            </div>
                        </div>

                        <div className="logs-list">
                            {sortedLogs.length > 0 ? (
                                sortedLogs.map(log => (
                                    <LogCard key={log.id} log={log} onDelete={onDeleteLog} onEdit={onEditLog} />
                                ))
                            ) : (
                                <div className="empty-state">No logs yet.</div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'hitlist' && (
                    <div className="hit-list">
                        <div className="empty-state">
                            <h3>Your Hit List is empty</h3>
                            <p>Save restaurants you want to visit!</p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .profile {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px 0;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 30px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--bg-secondary);
        }
        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 5px;
        }
        .profile-name {
          font-size: 2rem;
          margin-bottom: 0;
        }
        .follow-btn {
          background-color: var(--accent-primary);
          color: white;
          border: none;
          padding: 8px 24px;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .follow-btn:hover {
          opacity: 0.9;
        }
        .follow-btn.following {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        .follow-btn.following:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .profile-handle {
          color: var(--text-secondary);
          margin-bottom: 5px;
        }
        .profile-location {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .profile-stats {
          display: flex;
          gap: 30px;
        }
        .stat {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }
        .stats-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .stats-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .stats-filter-type {
          display: flex;
          gap: 10px;
        }
        .filter-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          padding: 5px 0;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .filter-btn:hover {
          color: var(--text-primary);
        }
        .filter-btn.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }
        .time-select {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
        }
        .stats-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        .stat-pill {
          background-color: var(--bg-secondary);
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          border: 1px solid var(--border-color);
          transition: transform 0.2s;
        }
        .stat-pill:hover {
          transform: translateY(-2px);
          border-color: var(--accent-primary);
        }
        .all-pill {
          background-color: var(--text-primary);
          color: var(--bg-primary);
          border-color: var(--text-primary);
        }
        .all-pill .pill-name {
          color: var(--bg-primary);
        }
        .all-pill .pill-count {
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        .pill-name {
          color: var(--text-primary);
          font-weight: 500;
        }
        .pill-count {
          background-color: var(--accent-primary);
          color: white;
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 700;
        }
        .no-stats {
          color: var(--text-secondary);
          font-style: italic;
          font-size: 0.9rem;
        }
        .profile-tabs {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border-color);
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 10px 20px;
          font-size: 1.1rem;
          color: var(--text-secondary);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: var(--text-primary);
        }
        .tab-btn.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }
        .content-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
        }
        .sort-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sort-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .sort-btn {
          padding: 5px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          color: var(--text-secondary);
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
        }
        .sort-btn:hover {
          color: var(--text-primary);
        }
        .sort-btn.active {
          background-color: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
        .hit-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
      `}</style>
        </div>
    );
};

export default Profile;
