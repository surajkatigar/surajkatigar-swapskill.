import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  Coins,
  Plus,
  Video,
  CheckCircle,
  Sparkles,
  X,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { Workshop } from '../types';
import { useAuth } from '../context/AuthContext';

export const WorkshopsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      alert('Please sign in to enroll.');
      return;
    }

    if (user.credits < workshop.creditCost) {
      alert(`You need at least ${workshop.creditCost} credit to enroll in this workshop.`);
      return;
    }

    if (!confirm(`Enroll in "${workshop.title}" for ${workshop.creditCost} learning credit?`)) return;

    try {
      await api.post(`/workshops/${workshop.id}/enroll`);
      await refreshUser();
      await fetchWorkshops();
      alert('Successfully enrolled! The host has been credited.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to enroll');
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
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create workshop');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
            <Users size={13} className="text-amber-600" />
            <span>Group Learning Value-Add</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Small Group Workshops</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            One skilled peer hosts a small interactive session for multiple learners simultaneously.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-indigo-100 shrink-0"
        >
          <Plus size={15} />
          <span>Host a Workshop</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Loading workshops...</div>
      ) : workshops.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No upcoming workshops scheduled yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
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
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {w.category}
                    </span>
                    <div className="flex items-center space-x-1 font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Coins size={12} />
                      <span>{w.creditCost} Credit</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">{w.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{w.description}</p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-slate-500">
                        <Calendar size={13} />
                        <span>Date</span>
                      </span>
                      <span className="font-semibold text-slate-800">
                        {new Date(w.scheduledAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-slate-500">
                        <Clock size={13} />
                        <span>Time & Length</span>
                      </span>
                      <span className="font-semibold text-slate-800">
                        {new Date(w.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        ({w.durationMinutes} min)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 text-slate-500">
                        <Users size={13} />
                        <span>Participants</span>
                      </span>
                      <span className="font-semibold text-slate-800">
                        {w.enrollments.length} / {w.maxParticipants} enrolled
                      </span>
                    </div>
                  </div>

                  {/* Host info */}
                  <div className="flex items-center space-x-2.5 mt-4 pt-3 border-t border-slate-100">
                    <img
                      src={w.host.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{w.host.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{w.host.headline}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  {isHost ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-indigo-700 bg-indigo-50 rounded-xl">
                      You are hosting this workshop
                    </div>
                  ) : isEnrolled ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                        <CheckCircle size={14} />
                        <span>Enrolled</span>
                      </span>
                      {w.meetingLink && (
                        <a
                          href={w.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                        >
                          <Video size={13} />
                          <span>Join Live</span>
                        </a>
                      )}
                    </div>
                  ) : isFull ? (
                    <div className="w-full py-2 text-center text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl">
                      Workshop Full
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(w)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Enroll (1 Credit)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Host a Group Workshop</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Teach multiple learners at once and earn credits from each enrolled participant!
            </p>

            {error && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Workshop Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Git & Pull Request Workflows"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Outline</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What will learners practice during this interactive workshop?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
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
                    <option value="Music">Music</option>
                    <option value="Business & Career">Business & Career</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Participants</label>
                  <input
                    type="number"
                    min="2"
                    max="15"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
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
