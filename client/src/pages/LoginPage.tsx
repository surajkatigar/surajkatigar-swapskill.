import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      navigate('/dashboard');
    } catch (err: any) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
          <Sparkles size={24} />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-white tracking-tight">
          Sign In to SwapSkill
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Exchange skills without money using your time-based credits.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0d0d14]/85 backdrop-blur-xl py-8 px-6 shadow-2xl border border-white/10 rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
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
                className="w-full px-3.5 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-[1.01] active:scale-100 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 text-center">
              1-Click Fast Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('alex@example.com')}
                className="p-2.5 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 rounded-xl text-left font-medium text-slate-300 transition-colors"
              >
                <div className="font-bold text-white">Alex Rivera</div>
                <div className="text-[10px] text-slate-400 mt-0.5">React ↔ French</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('chloe@example.com')}
                className="p-2.5 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 rounded-xl text-left font-medium text-slate-300 transition-colors"
              >
                <div className="font-bold text-white">Chloe Martin</div>
                <div className="text-[10px] text-slate-400 mt-0.5">French ↔ React</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('david@example.com')}
                className="p-2.5 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 rounded-xl text-left font-medium text-slate-300 transition-colors"
              >
                <div className="font-bold text-white">David Kim</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Python ↔ Figma</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@swapskill.com')}
                className="p-2.5 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-950/60 rounded-xl text-left font-medium text-rose-300 transition-colors"
              >
                <div className="font-bold text-rose-200">Admin Account</div>
                <div className="text-[10px] text-rose-400 mt-0.5">Dashboard &amp; Safety</div>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline">
              Sign up for 2 starter credits
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
