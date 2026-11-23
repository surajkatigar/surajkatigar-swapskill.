import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Coins,
  Star,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import { SessionBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { ReviewModal } from '../components/ReviewModal';
import { useNavigate } from 'react-router-dom';

export const SessionsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED'>('ALL');
  const [reviewSession, setReviewSession] = useState<SessionBooking | null>(null);
  const [toast, setToast] = useState<{msg: string; type: 'success' | 'error'} | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      setSessions(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await api.put(`/bookings/${id}/accept`);
      await refreshUser();
      await fetchSessions();
      showToast('Session accepted! 1 credit has been locked in escrow.');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to accept session', 'error');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await api.put(`/bookings/${id}/decline`);
      await fetchSessions();
      showToast('Session declined.');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to decline', 'error');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await api.put(`/bookings/${id}/complete`);
      await refreshUser();
      await fetchSessions();
      showToast(res.data.message);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to complete session', 'error');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      await refreshUser();
      await fetchSessions();
      showToast('Session cancelled and escrow refunded.');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to cancel session', 'error');
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border text-xs font-bold transition-all animate-in fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Learning Sessions</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your peer teaching &amp; learning bookings, track escrow status, and launch live rooms.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex p-1 bg-[#0d0d14]/80 border border-white/10 rounded-xl text-xs font-semibold shadow-xl">
          {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                filter === tab
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Escrow Rule Reminder */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Escrow Security Engine</p>
            <p className="text-[11px] text-indigo-300/80 leading-relaxed">
              When a session is accepted, 1 credit is temporarily held in escrow. Once you complete the 30-min session and mark it done, the credit is officially released to the teacher!
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 font-mono text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl">
          <Coins size={14} />
          <span>Your Balance: {user?.credits}c</span>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Loading your sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-[#0d0d14]/80 rounded-2xl p-12 text-center border border-white/10 shadow-xl backdrop-blur-xl">
          <Calendar size={32} className="mx-auto text-slate-500 mb-3" />
          <p className="text-white font-semibold text-sm">No sessions found in this category.</p>
          <p className="text-xs text-slate-400 mt-1">Book a session with a peer or accept pending requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const isLearner = user?.id === session.learnerId;
            const isTeacher = user?.id === session.teacherId;
            const partner = isLearner ? session.teacher : session.learner;
            const hasReviewed = session.reviews && session.reviews.some((r) => r.reviewerId === user?.id);

            return (
              <div
                key={session.id}
                className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl hover:border-indigo-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Session & Partner Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={partner.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/15 shrink-0 shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-base text-white">{session.skillName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          session.status === 'ACCEPTED'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                            : session.status === 'COMPLETED'
                            ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-500/40'
                            : session.status === 'PENDING'
                            ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {isLearner ? 'Taught by' : 'Learning with'}:{' '}
                      <span
                        onClick={() => navigate(`/users/${partner.id}`)}
                        className="font-bold text-white hover:text-indigo-400 cursor-pointer underline ml-1"
                      >
                        {partner.name}
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center space-x-1.5">
                        <Calendar size={13} className="text-indigo-400" />
                        <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1.5">
                        <Clock size={13} className="text-indigo-400" />
                        <span>{new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.durationMinutes}m)</span>
                      </span>
                      {session.location && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] truncate max-w-xs">{session.location}</span>
                        </>
                      )}
                    </div>

                    {session.goalDescription && (
                      <p className="mt-2 text-xs text-slate-300 italic bg-white/[0.04] p-2 rounded-lg border border-white/[0.06] max-w-xl">
                        Goal: "{session.goalDescription}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => navigate(`/chat?partner=${partner.id}`)}
                    className="p-2.5 text-slate-300 hover:text-white bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 rounded-xl transition-colors"
                    title="Open Direct Chat"
                  >
                    <MessageSquare size={16} />
                  </button>

                  {/* Pending actions for Teacher */}
                  {session.status === 'PENDING' && isTeacher && (
                    <>
                      <button
                        onClick={() => handleAccept(session.id)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-100"
                      >
                        <CheckCircle size={14} />
                        <span>Accept &amp; Lock Credit</span>
                      </button>
                      <button
                        onClick={() => handleDecline(session.id)}
                        className="px-3.5 py-2 bg-white/[0.07] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <XCircle size={14} />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {/* Pending info for Learner */}
                  {session.status === 'PENDING' && isLearner && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-amber-300 font-semibold bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                        Waiting for Teacher
                      </span>
                      <button
                        onClick={() => handleCancel(session.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}

                  {/* Accepted state */}
                  {session.status === 'ACCEPTED' && (
                    <>
                      {session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-100"
                        >
                          <Video size={14} />
                          <span>Join Video Room</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleComplete(session.id)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-100"
                      >
                        Mark Done &amp; Transfer Credit
                      </button>
                    </>
                  )}

                  {/* Completed Review button */}
                  {session.status === 'COMPLETED' && !hasReviewed && (
                    <button
                      onClick={() => setReviewSession(session)}
                      className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    >
                      <Star size={14} className="fill-amber-300" />
                      <span>Review Session</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewSession && (
        <ReviewModal
          sessionId={reviewSession.id}
          partnerName={
            user?.id === reviewSession.learnerId
              ? reviewSession.teacher.name
              : reviewSession.learner.name
          }
          skillName={reviewSession.skillName}
          onClose={() => setReviewSession(null)}
          onSuccess={() => {
            setReviewSession(null);
            fetchSessions();
            showToast('Thank you for rating your peer!');
          }}
        />
      )}
    </div>
  );
};
