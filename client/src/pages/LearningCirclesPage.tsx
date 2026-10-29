import React, { useState, useEffect } from 'react';
import { Layers, Users, Calendar, Plus, CheckCircle, Sparkles, X, Target } from 'lucide-react';
import api from '../services/api';
import { LearningCircle } from '../types';
import { useAuth } from '../context/AuthContext';

export const LearningCirclesPage: React.FC = () => {
  const { user } = useAuth();
  const [circles, setCircles] = useState<LearningCircle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('Programming');
  const [goalDescription, setGoalDescription] = useState('');
  const [meetingSchedule, setMeetingSchedule] = useState('Every Saturday 10:00 AM');
  const [submitting, setSubmitting] = useState(false);

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
      alert('Please sign in to join a circle.');
      return;
    }

    try {
      await api.post(`/circles/${circleId}/join`);
      await fetchCircles();
      alert('Joined learning circle successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to join');
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
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold mb-2">
            <Layers size={13} className="text-purple-600" />
            <span>Recurring Study Cohorts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Learning Circles</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Join recurring peer interest groups focused on joint goals like LeetCode algorithms, design critique, and language immersion.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-indigo-100 shrink-0"
        >
          <Plus size={15} />
          <span>Start a Learning Circle</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Loading learning circles...</div>
      ) : circles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No learning circles active right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((c) => {
            const isMember = user && c.members.some((m) => m.userId === user.id);

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {c.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                      <Users size={12} />
                      <span>{c.members.length} members</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">{c.title}</h3>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">{c.topic}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{c.goalDescription}</p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                      <Calendar size={13} className="text-slate-400" />
                      <span>Schedule: {c.meetingSchedule}</span>
                    </div>
                  </div>

                  {/* Members Avatars preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {c.members.slice(0, 4).map((m) => (
                        <img
                          key={m.userId}
                          src={m.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50'}
                          alt={m.user.name}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                          title={m.user.name}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400">Led by {c.creator.name}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  {isMember ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl flex items-center justify-center space-x-1">
                      <CheckCircle size={14} />
                      <span>Active Member</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(c.id)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Start a Learning Circle</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a recurring study cohort to collaborate with peers on joint milestones.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Circle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly LeetCode Medium Breakdown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Focus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynamic Programming & Graph Algorithms"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What will members accomplish together?"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Languages">Languages</option>
                    <option value="Design">Design</option>
                    <option value="Academics">Academics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Every Saturday 10:00 AM"
                    value={meetingSchedule}
                    onChange={(e) => setMeetingSchedule(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
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
