import LogCard from './LogCard';

const Feed = ({ logs, onDeleteLog, userLocation }) => {
  if (!logs) return <div className="feed-container">Loading feed...</div>;

  // Mock trending data
  const trendingSpots = [
    { id: 1, name: "Joe's Pizza", count: 12 },
    { id: 2, name: "Levain Bakery", count: 8 },
    { id: 3, name: "Katz's Deli", count: 5 }
  ];

  return (
    <div className="feed-layout">
      <div className="feed-main">
        <h2 className="feed-title">Your Feed</h2>
        <div className="feed-list">
          {logs.map(log => (
            <LogCard key={log.id} log={log} onDelete={onDeleteLog} />
          ))}
        </div>
      </div>

      <div className="feed-sidebar">
        <div className="trending-card">
          <h3 className="trending-title">🔥 Trending in {userLocation.split(',')[0]}</h3>
          <div className="trending-list">
            {trendingSpots.map((spot, index) => (
              <div key={spot.id} className="trending-item">
                <span className="trending-rank">#{index + 1}</span>
                <span className="trending-name">{spot.name}</span>
                <span className="trending-count">{spot.count} logs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .feed-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 0;
        }
        .feed-title {
          margin-bottom: 20px;
          font-size: 1.5rem;
        }
        .feed-sidebar {
          position: sticky;
          top: 90px; /* Navbar height + padding */
          height: fit-content;
        }
        .trending-card {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: 20px;
          border: 1px solid var(--border-color);
        }
        .trending-title {
          font-size: 1.1rem;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        .trending-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
        }
        .trending-item:last-child {
          border-bottom: none;
        }
        .trending-rank {
          font-weight: 700;
          color: var(--accent-primary);
          width: 30px;
        }
        .trending-name {
          flex: 1;
          font-weight: 500;
        }
        .trending-count {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .feed-layout {
            grid-template-columns: 1fr;
          }
          .feed-sidebar {
            position: static;
            order: -1; /* Show trending on top on mobile */
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Feed;
