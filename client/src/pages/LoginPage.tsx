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
      navigate('/matches');
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
      navigate('/matches');
    } catch (err: any) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-100">
          <Sparkles size={24} />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to SwapSkill
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Exchange skills without money using your time-based credits.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200/80 rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              1-Click Fast Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('alex@example.com')}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-left font-medium text-slate-700"
              >
                <div className="font-bold text-slate-900">Alex Rivera</div>
                <div className="text-[10px] text-slate-400">React $\longleftrightarrow$ French</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('chloe@example.com')}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-left font-medium text-slate-700"
              >
                <div className="font-bold text-slate-900">Chloe Martin</div>
                <div className="text-[10px] text-slate-400">French $\longleftrightarrow$ React</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('david@example.com')}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-left font-medium text-slate-700"
              >
                <div className="font-bold text-slate-900">David Kim</div>
                <div className="text-[10px] text-slate-400">Python $\longleftrightarrow$ Figma</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@swapskill.com')}
                className="p-2 border border-rose-200 hover:bg-rose-50/50 rounded-xl text-left font-medium text-rose-800"
              >
                <div className="font-bold text-rose-900">Admin Account</div>
                <div className="text-[10px] text-rose-500">Dashboard & Safety</div>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Sign up for 2 starter credits
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
