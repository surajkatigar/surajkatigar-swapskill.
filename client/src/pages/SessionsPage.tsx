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
  BookOpen,
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
      alert('Session accepted! 1 credit has been locked in escrow.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to accept session');
    }
  };

  const handleDecline = async (id: string) => {
    if (!confirm('Are you sure you want to decline this session request?')) return;
    try {
      await api.put(`/bookings/${id}/decline`);
      await fetchSessions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to decline');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await api.put(`/bookings/${id}/complete`);
      await refreshUser();
      await fetchSessions();
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to complete session');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this session? Any credit held in escrow will be refunded to the learner.')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      await refreshUser();
      await fetchSessions();
      alert('Session cancelled and escrow refunded.');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel session');
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Learning Sessions</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your peer teaching & learning bookings, track escrow status, and launch live rooms.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold shadow-xs">
          {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                filter === tab ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Escrow Rule Reminder */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-950">Escrow Security Engine</p>
            <p className="text-[11px] text-indigo-700">
              When a session is accepted, 1 credit is temporarily held in escrow. Once you complete the 30-min session and mark it done, the credit is officially released to the teacher!
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-1.5 font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
          <Coins size={14} />
          <span>Your Balance: {user?.credits}c</span>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Loading your sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600 font-semibold text-sm">No sessions found in this category.</p>
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
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Session & Partner Info */}
                <div className="flex items-start space-x-4">
                  <img
                    src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={partner.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-base text-slate-900">{session.skillName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          session.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : session.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : session.status === 'COMPLETED'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      {isLearner ? (
                        <span>
                          Learning from <strong className="text-slate-800">{partner.name}</strong>
                        </span>
                      ) : (
                        <span>
                          Teaching <strong className="text-slate-800">{partner.name}</strong>
                        </span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock size={13} className="text-slate-400" />
                        <span>
                          {new Date(session.scheduledAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          ({session.durationMinutes} mins)
                        </span>
                      </span>
                    </div>

                    {session.goalDescription && (
                      <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                        <strong>Goal:</strong> {session.goalDescription}
                      </p>
                    )}

                    {/* Escrow Status Tag */}
                    <div className="mt-2.5 flex items-center space-x-2">
                      {session.escrowCreditLocked ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <ShieldCheck size={12} className="text-amber-600" />
                          <span>1 Credit Currently in Escrow</span>
                        </span>
                      ) : session.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <Coins size={12} className="text-emerald-600" />
                          <span>1 Credit Released to Teacher</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Chat button */}
                  <button
                    onClick={() => navigate(`/chat?partner=${partner.id}&session=${session.id}`)}
                    className="glass-btn p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 text-slate-700"
                    title="Direct Chat"
                  >
                    <MessageSquare size={14} className="text-indigo-600" />
                    <span className="hidden sm:inline">Chat</span>
                  </button>

                  {/* Actions depending on status */}
                  {session.status === 'PENDING' && isTeacher && (
                    <>
                      <button
                        onClick={() => handleAccept(session.id)}
                        className="glass-btn-emerald px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Accept & Lock Escrow
                      </button>
                      <button
                        onClick={() => handleDecline(session.id)}
                        className="glass-btn px-3 py-2 text-rose-600 rounded-xl text-xs font-semibold"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {session.status === 'ACCEPTED' && (
                    <>
                      {session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="glass-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                        >
                          <Video size={14} />
                          <span>Join Meeting</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleComplete(session.id)}
                        className="glass-btn-emerald px-3.5 py-2 rounded-xl text-xs font-bold"
                        title="Mark complete to release 1 credit to teacher"
                      >
                        Complete & Release Credit
                      </button>
                      <button
                        onClick={() => handleCancel(session.id)}
                        className="glass-btn p-2 text-slate-400 hover:text-rose-600 rounded-xl"
                        title="Cancel Session & Refund Escrow"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}

                  {session.status === 'COMPLETED' && (
                    <>
                      {!hasReviewed ? (
                        <button
                          onClick={() => setReviewSession(session)}
                          className="glass-pill-amber px-3.5 py-2 rounded-xl text-xs font-bold text-amber-950 flex items-center space-x-1.5"
                        >
                          <Star size={14} className="text-amber-500 fill-amber-400" />
                          <span>Leave Review</span>
                        </button>
                      ) : (
                        <span className="glass-btn text-xs font-semibold text-emerald-700 px-3 py-1.5 rounded-xl flex items-center space-x-1">
                          <CheckCircle size={14} className="text-emerald-500" />
                          <span>Reviewed</span>
                        </span>
                      )}

                      <button
                        onClick={() => navigate('/practice')}
                        className="glass-btn px-3 py-2 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1"
                      >
                        <BookOpen size={13} className="text-indigo-600" />
                        <span>Tasks</span>
                      </button>
                    </>
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
            user?.id === reviewSession.learnerId ? reviewSession.teacher.name : reviewSession.learner.name
          }
          skillName={reviewSession.skillName}
          onClose={() => setReviewSession(null)}
          onSuccess={() => {
            setReviewSession(null);
            fetchSessions();
            alert('Review submitted! Thank you for strengthening community trust.');
          }}
        />
      )}
    </div>
  );
};
