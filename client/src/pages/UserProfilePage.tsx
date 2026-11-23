import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Globe,
  Calendar,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import { User, Review } from '../types';
import { RatingStars } from '../components/RatingStars';
import { BookingModal } from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([api.get(`/users/${id}`), api.get(`/reviews/user/${id}`)])
      .then(([userRes, reviewsRes]) => {
        setUser(userRes.data);
        setReviews(reviewsRes.data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-400 text-sm">Loading peer profile...</div>;
  }

  if (!user) {
    return <div className="py-24 text-center text-slate-500">Peer not found.</div>;
  }

  const isSelf = currentUser?.id === user.id;
  const teachSkills = user.skills?.filter((s) => s.type === 'TEACH') || [];
  const learnSkills = user.skills?.filter((s) => s.type === 'LEARN') || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-slate-100">
        <div className="flex items-center space-x-5">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/15 shadow-xl shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h1>
              {user.role === 'ADMIN' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-950/70 text-rose-300 border border-rose-500/40">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">{user.headline || 'SwapSkill Member'}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <RatingStars rating={Math.round(user.averageRating || 5)} size={14} />
                <span className="font-bold text-white ml-1">{user.averageRating || '5.0'}</span>
                <span className="text-slate-500">({user.reviewCount || 0} reviews)</span>
              </div>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Globe size={13} className="text-indigo-400" />
                <span>{user.languages || 'English'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Calendar size={13} className="text-indigo-400" />
                <span>{user.availability || 'Flexible'}</span>
              </span>
            </div>
          </div>
        </div>

        {!isSelf && (
          <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/chat?partner=${user.id}`)}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <MessageSquare size={15} />
              <span>Direct Chat</span>
            </button>
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-100"
            >
              Book 30m Session
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {user.bio && (
            <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl text-slate-100">
              <h3 className="text-sm font-bold text-white mb-2.5">About {user.name}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>
            </div>
          )}

          {/* Skills Grid */}
          <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-6 text-slate-100">
            <div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>Skills {user.name} Can Teach ({teachSkills.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teachSkills.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{s.skillName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                        {s.proficiencyLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{s.category} • {s.yearsExperience} yr(s) exp</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Skills {user.name} Wants to Learn ({learnSkills.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learnSkills.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <span className="text-xs font-bold text-white block">{s.skillName}</span>
                    <p className="text-[11px] text-slate-400 mt-1">{s.category} (Desired: {s.proficiencyLevel})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Portfolio Evidence */}
          {user.portfolio && user.portfolio.length > 0 && (
            <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl text-slate-100">
              <h3 className="text-sm font-bold text-white mb-4">Skill Portfolio Evidence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.portfolio.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.04] flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    {item.projectUrl && (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                      >
                        <span>View Project Asset</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Ratings & Reviews */}
        <div className="space-y-6">
          <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl text-slate-100">
            <h3 className="text-sm font-bold text-white mb-3.5">Community Reviews ({reviews.length})</h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews yet for completed sessions.</p>
            ) : (
              <div className="space-y-3.5">
                {reviews.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{r.reviewer?.name}</span>
                      <RatingStars rating={r.rating} size={12} />
                    </div>
                    <p className="text-xs text-slate-300 italic">"{r.comment}"</p>
                    <span className="text-[10px] text-slate-500 block">
                      Session: {r.session?.skillName || 'Skill Exchange'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          teacher={user}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            alert('Session requested! 1 credit will be held in escrow once teacher confirms.');
          }}
        />
      )}
    </div>
  );
};
