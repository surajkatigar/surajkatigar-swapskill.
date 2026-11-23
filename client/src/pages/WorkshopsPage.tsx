import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Coins,
  Plus,
  Video,
  CheckCircle,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import api from '../services/api';
import { Workshop } from '../types';
import { useAuth } from '../context/AuthContext';

export const WorkshopsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Programming');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('19:00');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [maxParticipants, setMaxParticipants] = useState('6');
  const [creditCost, setCreditCost] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await api.get('/workshops');
      setWorkshops(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleEnroll = async (workshop: Workshop) => {
    if (!user) {
      showToast('Please sign in to enroll.', 'error');
      return;
    }

    if (user.credits < workshop.creditCost) {
      showToast(`You need at least ${workshop.creditCost} credit to enroll in this workshop.`, 'error');
      return;
    }

    try {
      await api.post(`/workshops/${workshop.id}/enroll`);
      await refreshUser();
      await fetchWorkshops();
      showToast('Successfully enrolled! The host has been credited.');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to enroll', 'error');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !scheduledDate) {
      setError('Please fill in title, description, and date.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`);
      await api.post('/workshops', {
        title,
        description,
        category,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: parseInt(durationMinutes),
        maxParticipants: parseInt(maxParticipants),
        creditCost: parseInt(creditCost),
      });

      await fetchWorkshops();
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      showToast('Workshop published successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create workshop');
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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Users size={13} className="text-amber-400" />
            <span>Group Learning Value-Add</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Small Group Workshops</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            One skilled peer hosts a small interactive session for multiple learners simultaneously.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-[1.02] active:scale-100 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <Plus size={15} />
          <span>Host a Workshop</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0d0d14]/80 rounded-2xl p-5 border border-white/10 animate-pulse space-y-4">
              <div className="h-4 bg-white/10 rounded-md w-1/3" />
              <div className="h-5 bg-white/15 rounded-md w-3/4" />
              <div className="h-12 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      ) : workshops.length === 0 ? (
        <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10">
          <p className="text-slate-400 text-sm">No upcoming workshops scheduled yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Be the first to host one!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((w) => {
            const isEnrolled = user && w.enrollments.some((e) => e.userId === user.id);
            const isHost = user?.id === w.hostId;
            const isFull = w.enrollments.length >= w.maxParticipants;

            return (
              <div
                key={w.id}
                className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {w.category}
                    </span>
                    <div className="flex items-center space-x-1 font-mono text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                      <Coins size={12} className="text-amber-400" />
                      <span>{w.creditCost} Credit</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3">{w.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">{w.description}</p>

                  <div className="mt-4 p-3 bg-white/[0.04] border border-white/5 rounded-xl space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-slate-400">
                        <Calendar size={13} />
                        <span>Date</span>
                      </span>
                      <span className="font-semibold text-white">
                        {new Date(w.scheduledAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-slate-400">
                        <Clock size={13} />
                        <span>Time &amp; Length</span>
                      </span>
                      <span className="font-semibold text-white">
                        {new Date(w.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        ({w.durationMinutes} min)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-slate-400">
                        <Users size={13} />
                        <span>Participants</span>
                      </span>
                      <span className="font-semibold text-white">
                        {w.enrollments.length} / {w.maxParticipants} enrolled
                      </span>
                    </div>
                  </div>

                  {/* Host info */}
                  <div className="flex items-center space-x-2.5 mt-4 pt-3 border-t border-white/10">
                    <img
                      src={w.host.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-white/15"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{w.host.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{w.host.headline}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3 border-t border-white/10">
                  {isHost ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded-xl">
                      You are hosting this workshop
                    </div>
                  ) : isEnrolled ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                        <CheckCircle size={14} />
                        <span>Enrolled</span>
                      </span>
                      {w.meetingLink && (
                        <a
                          href={w.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                        >
                          <Video size={13} />
                          <span>Join Live</span>
                        </a>
                      )}
                    </div>
                  ) : isFull ? (
                    <div className="w-full py-2 text-center text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 rounded-xl">
                      Workshop Full
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(w)}
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.01] active:scale-100"
                    >
                      Enroll ({w.creditCost} Credit)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Workshop Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b0b12]/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/10 relative max-h-[90vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-white">Host a Group Workshop</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Teach multiple learners at once and earn credits from each enrolled participant!
            </p>

            {error && (
              <div className="mt-3 p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Workshop Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Git & Pull Request Workflows"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description &amp; Outline</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What will learners practice during this interactive workshop?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                    <option value="Music" className="bg-[#121218] text-white">Music</option>
                    <option value="Business & Career" className="bg-[#121218] text-white">Business &amp; Career</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Participants</label>
                  <input
                    type="number"
                    min="2"
                    max="15"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white scheme-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white scheme-dark"
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
                  {submitting ? 'Creating...' : 'Publish Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
