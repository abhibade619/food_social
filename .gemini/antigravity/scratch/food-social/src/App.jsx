import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Profile from './components/Profile';
import LogModal from './components/LogModal';
import Auth from './components/Auth';
import Search from './components/Search';
import RestaurantPage from './components/RestaurantPage';
import { initialLogs } from './data/mockData';
import { useAuth } from './context/AuthProvider';

function App() {
  const { user, profile, loading, signOut } = useAuth();
  const [logs, setLogs] = useState(initialLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('feed'); // 'feed', 'profile', 'search', 'restaurant'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [userLocation, setUserLocation] = useState("New York, NY");

  const [editingLog, setEditingLog] = useState(null);

  // Combine auth user with profile data
  const currentUser = user ? {
    id: user.id,
    email: user.email,
    name: profile?.full_name || user.email.split('@')[0],
    handle: profile?.username || `@${user.email.split('@')[0]}`,
    avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`,
    stats: { logs: 0, followers: 0, following: 0 }, // Placeholder until we fetch real stats
    ...profile
  } : null;

  const handleLogout = async () => {
    await signOut();
    setCurrentView('feed');
  };

  const handleAddLog = (newLogData) => {
    const newLog = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar
      },
      ...newLogData
    };
    setLogs([newLog, ...logs]);
  };

  const handleUpdateLog = (updatedLogData) => {
    setLogs(logs.map(log =>
      log.id === editingLog.id ? { ...log, ...updatedLogData } : log
    ));
    setEditingLog(null);
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('restaurant');
  };

  const handleDeleteLog = (logId) => {
    setLogs(logs.filter(log => log.id !== logId));
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="app">
      <Navbar
        onOpenLogModal={() => setIsModalOpen(true)}
        onNavigate={setCurrentView}
        currentView={currentView}
        onLogout={handleLogout}
        user={currentUser}
        userLocation={userLocation}
        onUpdateLocation={setUserLocation}
      />
      <main className="container">
        {currentView === 'feed' && logs && <Feed logs={logs} onDeleteLog={handleDeleteLog} onEditLog={handleEditLog} userLocation={userLocation} />}
        {currentView === 'profile' && currentUser && <Profile user={currentUser} logs={logs || []} onDeleteLog={handleDeleteLog} onEditLog={handleEditLog} />}
        {currentView === 'search' && <Search onSelectRestaurant={handleSelectRestaurant} />}
        {currentView === 'restaurant' && selectedRestaurant && (
          <RestaurantPage
            restaurant={selectedRestaurant}
            logs={logs || []}
            onBack={() => setCurrentView('search')}
          />
        )}
      </main>
      <LogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingLog ? handleUpdateLog : handleAddLog}
        initialData={editingLog}
      />
      <style>{`
        .loading-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
}

export default App;
