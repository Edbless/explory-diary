import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import OfflineIndicator from './components/OfflineIndicator';
import PrivateRoute from './components/PrivateRoute';
import Auth from './pages/Auth';
import Home from './pages/Home';
import AddEntry from './pages/AddEntry';
import Timeline from './pages/Timeline';
import MapView from './pages/MapView';
import LoadingSpinner from './components/LoadingSpinner';

const AppContent = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading Explorer Diary..." />;
  }

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="App">
      <Navigation />
      <OfflineIndicator />
      <div className="container">
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/add" element={
            <PrivateRoute>
              <AddEntry />
            </PrivateRoute>
          } />
          <Route path="/timeline" element={
            <PrivateRoute>
              <Timeline />
            </PrivateRoute>
          } />
          <Route path="/map" element={
            <PrivateRoute>
              <MapView />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;