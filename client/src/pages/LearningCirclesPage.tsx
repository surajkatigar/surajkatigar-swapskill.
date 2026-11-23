import React, { useState, useEffect } from 'react';
import { Layers, Users, Calendar, Plus, CheckCircle, Sparkles, X, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { LearningCircle } from '../types';
import { useAuth } from '../context/AuthContext';

export const LearningCirclesPage: React.FC = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<LearningCircle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Programming');
  const [goalDescription, setGoalDescription] = useState('');
  const [meetingSchedule, setMeetingSchedule] = useState('Every Saturday 10:00 AM');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCircles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/circles');
      setCircles(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircles();
  }, []);

  const handleJoin = async (circleId: string) => {
    if (!user) {
      showToast('Please sign in to join a circle.', 'error');
      return;
    }

    try {
      await api.post(`/circles/${circleId}/join`);
      await fetchCircles();
      showToast('Joined learning circle successfully!');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to join', 'error');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic || !goalDescription) return;

    setSubmitting(true);
    try {
      await api.post('/circles', {
        title,
        topic,
        category,
        goalDescription,
        meetingSchedule,
      });

      await fetchCircles();
      setShowCreateModal(false);
      setTitle('');
      setTopic('');
      setGoalDescription('');
      showToast('Learning Circle created successfully!');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to create circle', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
            <Layers size={13} className="text-purple-400" />
            <span>Recurring Study Cohorts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Learning Circles</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join recurring peer interest groups focused on joint goals like LeetCode algorithms, design critique, and language immersion.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-[1.02] active:scale-100 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <Plus size={15} />
          <span>Start a Learning Circle</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0d0d14]/80 rounded-2xl p-5 border border-white/10 animate-pulse space-y-4">
              <div className="h-4 bg-white/10 rounded-md w-1/3" />
              <div className="h-5 bg-white/15 rounded-md w-3/4" />
              <div className="h-10 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      ) : circles.length === 0 ? (
        <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10">
          <p className="text-slate-400 text-sm">No learning circles active right now.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Be the first to start one!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((c) => {
            const isMember = user && c.members.some((m) => m.userId === user.id);

            return (
              <div
                key={c.id}
                className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {c.category}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                      <Users size={12} />
                      <span>{c.members.length} members</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3">{c.title}</h3>
                  <p className="text-xs text-indigo-400 font-semibold mt-1">{c.topic}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{c.goalDescription}</p>

                  <div className="mt-4 p-3 bg-white/[0.04] border border-white/5 rounded-xl space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-1.5 font-semibold text-white">
                      <Calendar size={13} className="text-indigo-400" />
                      <span>Schedule: {c.meetingSchedule}</span>
                    </div>
                  </div>

                  {/* Members Avatars preview */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {c.members.slice(0, 4).map((m) => (
                        <img
                          key={m.userId}
                          src={m.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                          alt={m.user.name}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0d0d14] object-cover"
                          title={m.user.name}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500">Led by {c.creator.name}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10">
                  {isMember ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center space-x-1">
                      <CheckCircle size={14} />
                      <span>Active Member</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(c.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.01] active:scale-100"
                    >
                      Join Circle
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b0b12]/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/10 relative text-slate-100">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-white">Start a Learning Circle</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create a recurring study cohort to collaborate with peers on joint milestones.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Circle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly LeetCode Medium Breakdown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Focus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Programming & Graph Algorithms"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What will members accomplish together?"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white"
                  >
                    <option value="Programming" className="bg-[#121218] text-white">Programming</option>
                    <option value="Languages" className="bg-[#121218] text-white">Languages</option>
                    <option value="Design" className="bg-[#121218] text-white">Design</option>
                    <option value="Academics" className="bg-[#121218] text-white">Academics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Every Saturday 10:00 AM"
                    value={meetingSchedule}
                    onChange={(e) => setMeetingSchedule(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-[1.02] active:scale-100 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {submitting ? 'Creating...' : 'Create Circle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
