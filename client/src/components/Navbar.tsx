import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Users,
  Calendar,
  MessageSquare,
  BookOpen,
  Layers,
  Shield,
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
    <nav className="sticky top-0 z-40 bg-[#070709]/80 backdrop-blur-md border-b border-white/[0.08] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles size={22} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  Swap<span className="text-indigo-400">Skill</span>
                </span>
                <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-950/70 text-indigo-300 rounded-md border border-indigo-700/50">
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
                        ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    location.pathname === '/admin'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                      : 'text-rose-400 hover:bg-rose-500/10'
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
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 transition-colors"
                    title="Switch demo account to test reciprocal skill exchange"
                  >
                    <Users size={13} className="text-indigo-400" />
                    <span>Switch Persona</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </button>

                  {showDemoDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#111116] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in">
                      <div className="px-3 py-1.5 border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
                            className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 text-xs hover:bg-white/[0.06] transition-colors ${
                              user.id === du.id ? 'bg-indigo-600/20 font-semibold text-indigo-300' : 'text-slate-200'
                            }`}
                          >
                            <img
                              src={du.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-medium">{du.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{du.headline}</p>
                            </div>
                            <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/15 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
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
                  className="flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-full text-xs font-bold text-slate-200 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-xs"
                  />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/[0.08] rounded-xl border border-white/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-100"
                >
                  Join &amp; Get 2 Credits
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c10] border-b border-white/[0.08] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/[0.06]"
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
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10"
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
