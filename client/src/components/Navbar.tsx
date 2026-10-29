import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Users,
  Calendar,
  MessageSquare,
  Award,
  BookOpen,
  Layers,
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CreditBadge } from './CreditBadge';
import api from '../services/api';
import { User } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoUser } = useAuth();
  const location = useLocation();
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.get('/auth/demo-users')
      .then((res) => setDemoUsers(res.data))
      .catch((e) => console.error(e));
  }, []);

  const navLinks = [
    { name: 'Explore Skills', path: '/explore', icon: Search },
    { name: 'Peer Matches', path: '/matches', icon: Sparkles },
    { name: 'Sessions', path: '/sessions', icon: Calendar },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Workshops', path: '/workshops', icon: Users },
    { name: 'Circles', path: '/circles', icon: Layers },
    { name: 'Practice', path: '/practice', icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <Sparkles size={22} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Swap<span className="text-indigo-600">Skill</span>
                </span>
                <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                  P2P Barter
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    location.pathname === '/admin'
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-rose-600 hover:bg-rose-50/50'
                  }`}
                >
                  <Shield size={14} />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Credit Badge */}
                <CreditBadge />

                {/* Quick Switch Demo Account Dropdown */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                    className="glass-btn flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800"
                    title="Switch demo account to test reciprocal skill exchange"
                  >
                    <Users size={13} className="text-indigo-600" />
                    <span>Switch Persona</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>

                  {showDemoDropdown && (
                    <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-xl border border-white/60 py-2 z-50 animate-in fade-in">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Switch Demo Account
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {demoUsers.map((du) => (
                          <button
                            key={du.id}
                            onClick={() => {
                              switchDemoUser(du);
                              setShowDemoDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 text-xs hover:bg-white/60 transition-colors ${
                              user.id === du.id ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-700'
                            }`}
                          >
                            <img
                              src={du.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{du.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{du.headline}</p>
                            </div>
                            <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                              {du.credits}c
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  className="glass-btn flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-full text-xs font-bold text-slate-800"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-white shadow-xs"
                  />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="glass-btn p-2 text-slate-500 hover:text-rose-600 rounded-xl"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="glass-btn px-3.5 py-1.5 text-xs font-semibold text-slate-700 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="glass-btn-primary px-4 py-2 text-xs font-bold rounded-xl"
                >
                  Join & Get 2 Credits
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Icon size={18} className="text-slate-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50"
            >
              <Shield size={18} />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
