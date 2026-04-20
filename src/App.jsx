import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './App.css';

import Login from './pages/Login';
import Signup from './pages/Signup';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Planner = lazy(() => import('./pages/Planner'));
const Timer = lazy(() => import('./pages/Timer'));

const PageLoader = () => (
  <div className="bg-animated min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {currentUser && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login"  element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <Signup />} />
          <Route path="/"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
          <Route path="/timer"   element={<ProtectedRoute><Timer /></ProtectedRoute>} />
          <Route path="*"        element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </div>
  );
}

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
