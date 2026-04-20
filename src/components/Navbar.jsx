import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: '⬡' },
  { to: '/planner', label: 'Planner', icon: '◈' },
  { to: '/timer', label: 'Focus Timer', icon: '◎' },
];

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
            🧠
          </div>
          <span className="text-base font-bold gradient-text hidden sm:block">AI Study Companion</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(167,139,250,0.15))',
                border: '1px solid rgba(99,102,241,0.3)',
              } : { border: '1px solid transparent' }}
            >
              <span className="text-base">{icon}</span>
              <span className="hidden sm:block">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              {currentUser?.email?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-slate-400 max-w-[120px] truncate">{currentUser?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold text-red-400 rounded-xl hover:text-red-300 transition-all"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
