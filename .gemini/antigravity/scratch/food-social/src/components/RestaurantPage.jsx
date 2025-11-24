import React from 'react';
import LogCard from './LogCard';

const RestaurantPage = ({ restaurant, logs, onBack }) => {
    const restaurantLogs = logs.filter(
        log => log.restaurant.toLowerCase() === restaurant.name.toLowerCase()
    );

    const averageScore = restaurantLogs.length > 0
        ? (restaurantLogs.reduce((acc, log) => acc + parseFloat(log.internalScore), 0) / restaurantLogs.length).toFixed(1)
        : 'N/A';

    return (
        <div className="restaurant-page">
            <button className="back-btn" onClick={onBack}>← Back to Search</button>

            <div className="restaurant-header">
                <div className="restaurant-title-row">
                    <h1>{restaurant.name}</h1>
                    {averageScore !== 'N/A' && (
                        <div className="avg-score-badge" title="Average Score">
                            {averageScore}
                        </div>
                    )}
                </div>
                <p className="restaurant-meta">{restaurant.cuisine} • {restaurant.location}</p>
                <div className="restaurant-stats">
                    <div className="stat">
                        <span className="stat-value">{restaurantLogs.length}</span>
                        <span className="stat-label">Logs</span>
                    </div>
                </div>
            </div>

            <div className="restaurant-content">
                <h2 className="section-title">Recent Reviews</h2>
                <div className="logs-list">
                    {restaurantLogs.length > 0 ? (
                        restaurantLogs.map(log => (
                            <LogCard key={log.id} log={log} />
                        ))
                    ) : (
                        <div className="empty-state">No reviews yet. Be the first to log a visit!</div>
                    )}
                </div>
            </div>

            <style>{`
        .restaurant-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 0;
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
          margin-bottom: 20px;
          padding: 0;
        }
        .back-btn:hover {
          color: var(--text-primary);
          text-decoration: underline;
        }
        .restaurant-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .restaurant-title-row {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 5px;
        }
        .restaurant-title-row h1 {
          margin: 0;
          font-size: 2rem;
        }
        .avg-score-badge {
          background-color: var(--accent-primary);
          color: white;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          font-size: 1.2rem;
        }
        .restaurant-meta {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 20px;
        }
        .restaurant-stats {
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
        .section-title {
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .empty-state {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
      `}</style>
        </div>
    );
};

export default RestaurantPage;
