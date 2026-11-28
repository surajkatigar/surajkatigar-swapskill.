import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Coins, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [languages, setLanguages] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({
        name,
        email,
        password,
        headline,
        languages,
      });
      navigate('/matches');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
          <Sparkles size={24} />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-white tracking-tight">
          Create Your SwapSkill Account
        </h2>
        <div className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
          <Coins size={14} className="text-emerald-400" />
          <span>+2 Free Starter Credits Granted On Signup</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0d0d14]/85 backdrop-blur-xl py-8 px-6 shadow-2xl border border-white/10 rounded-3xl sm:px-10 space-y-5">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Python Developer & Spanish Student"
                className="w-full px-3.5 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Languages Spoken</label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-[1.01] active:scale-100 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-3"
            >
              {loading ? 'Creating Account...' : 'Get Started with 2 Credits'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
