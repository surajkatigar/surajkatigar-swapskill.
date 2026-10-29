import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coins,
  Users,
  Clock,
  ArrowLeftRight,
  BookOpen,
  Award,
  CheckCircle,
  Video,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Workshop } from '../types';
import { RatingStars } from '../components/RatingStars';
import { BookingModal } from '../components/BookingModal';
import { IridescentButton } from '../components/IridescentButton';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

  useEffect(() => {
    api.get('/users?level=EXPERT').then((res) => setFeaturedUsers(res.data.slice(0, 4))).catch(() => {});
    api.get('/workshops').then((res) => setWorkshops(res.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 animate-in fade-in">
            <Sparkles size={13} className="text-indigo-600" />
            <span>Peer-to-Peer Skill Exchange Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Swap Skills Directly With Peers. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              No Money. Pure Barter.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate costly courses and private tutors. Teach what you excel at (coding, languages, design, music) and earn time-based credits to learn anything in return.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <>
                <Link to="/matches" style={{ textDecoration: 'none' }}>
                  <IridescentButton>
                    <Sparkles size={15} />
                    View Your Peer Matches
                  </IridescentButton>
                </Link>
                <Link
                  to="/explore"
                  className="glass-btn w-full sm:w-auto px-8 py-3.5 text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center space-x-2"
                >
                  <span>Explore All Skills</span>
                  <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="glass-btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2"
                >
                  <span>Join & Get 2 Free Credits</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/explore"
                  className="glass-btn w-full sm:w-auto px-8 py-3.5 text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center space-x-2"
                >
                  <span>Browse Peer Directory</span>
                </Link>
              </>
            )}
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/80 pt-8">
            <div className="p-3">
              <p className="text-2xl font-extrabold text-slate-900 font-mono">100%</p>
              <p className="text-xs text-slate-500 font-medium">Free & Non-Monetary</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold text-slate-900 font-mono">30 Min</p>
              <p className="text-xs text-slate-500 font-medium">1 Learning Credit</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold text-indigo-600 font-mono">Escrow</p>
              <p className="text-xs text-slate-500 font-medium">Guaranteed Fair Barter</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-extrabold text-amber-500 font-mono">Real-time</p>
              <p className="text-xs text-slate-500 font-medium">1-on-1 Chat & Video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 from Blueprint: How the Credit System Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Fair Asymmetric Learning
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            How The Time-Based Credit System Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            You don't need to learn from the exact same person you teach. Credits enable seamless multi-peer exchanges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm font-mono mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Instant Signup</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Every new user immediately receives <strong className="text-emerald-700">2 starter credits</strong> to book their first 2 learning sessions right away.
            </p>
            <div className="mt-4 flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-600 bg-emerald-50/70 p-2 rounded-lg">
              <Coins size={14} />
              <span>+2 Free Credits Granted</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm font-mono mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Escrow Booking</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Send a session request. When the teacher accepts, <strong className="text-amber-700">1 credit is safely held in escrow</strong> so both parties commit.
            </p>
            <div className="mt-4 flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-700 bg-amber-50/70 p-2 rounded-lg">
              <ShieldCheck size={14} />
              <span>1 Credit Locked in Escrow</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm font-mono mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Live 30-min Session</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Conduct a focused 30-minute peer session online or on campus. Coordinate via direct chat and share practice files.
            </p>
            <div className="mt-4 flex items-center space-x-1.5 text-xs font-mono font-bold text-indigo-600 bg-indigo-50/70 p-2 rounded-lg">
              <Clock size={14} />
              <span>30 Mins Interactive Practice</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm font-mono mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Escrow Transfer</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Mark session complete and leave a rating. Escrow credit transfers into the teacher's balance to fund their own learning!
            </p>
            <div className="mt-4 flex items-center space-x-1.5 text-xs font-mono font-bold text-purple-600 bg-purple-50/70 p-2 rounded-lg">
              <CheckCircle size={14} />
              <span>1 Credit Released to Teacher</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skilled Peers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Tutors & Learners</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Featured Community Peers</h2>
          </div>
          <Link
            to="/explore"
            className="mt-3 sm:mt-0 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>Browse all peers</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredUsers.map((peer) => {
            const teachSkills = peer.skills?.filter((s) => s.type === 'TEACH') || [];
            const learnSkills = peer.skills?.filter((s) => s.type === 'LEARN') || [];

            return (
              <div
                key={peer.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={peer.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/users/${peer.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 truncate block"
                      >
                        {peer.name}
                      </Link>
                      <p className="text-[11px] text-slate-400 truncate">{peer.headline}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                    <RatingStars rating={Math.round(peer.averageRating || 5)} size={12} />
                    <span className="font-semibold text-slate-700">{peer.averageRating || '5.0'}</span>
                    <span>•</span>
                    <span>{peer.completedSessions || 0} sessions</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider block mb-1">
                        Can Teach
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {teachSkills.slice(0, 2).map((s) => (
                          <span key={s.id} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider block mb-1">
                        Wants to Learn
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {learnSkills.slice(0, 2).map((s) => (
                          <span key={s.id} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedTeacher(peer)}
                    className="glass-btn-dark w-full py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Value Addition Features from Blueprint */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Special Extra Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 max-w-2xl">
              More Ways to Share & Accelerate Mastery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-3">
                  <Users size={20} />
                </div>
                <h4 className="font-bold text-sm">Small Group Workshops</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Host one session for multiple learners simultaneously (e.g. Git command line workshop or French conversation).
                </p>
                <Link to="/workshops" className="inline-block mt-3 text-xs text-amber-400 hover:text-amber-300 font-semibold">
                  Browse Workshops →
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-400/20 text-indigo-300 flex items-center justify-center mb-3">
                  <BookOpen size={20} />
                </div>
                <h4 className="font-bold text-sm">Learning Circles</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Recurring interest study cohorts focused on joint goals like LeetCode algorithms or UI design portfolio review.
                </p>
                <Link to="/circles" className="inline-block mt-3 text-xs text-indigo-300 hover:text-indigo-200 font-semibold">
                  Join a Circle →
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center mb-3">
                  <Award size={20} />
                </div>
                <h4 className="font-bold text-sm">Practice Tasks & Quizzes</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Teachers assign short practical exercises. Learners submit work and receive personalized expert feedback.
                </p>
                <Link to="/practice" className="inline-block mt-3 text-xs text-emerald-300 hover:text-emerald-200 font-semibold">
                  Practice Center →
                </Link>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center mb-3">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-sm">Skill Portfolio Evidence</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Attach sample projects, code repositories, or portfolio evidence to validate your teaching qualifications.
                </p>
                <Link to="/profile" className="inline-block mt-3 text-xs text-rose-300 hover:text-rose-200 font-semibold">
                  Update Portfolio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedTeacher && (
        <BookingModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onSuccess={() => {
            setSelectedTeacher(null);
            alert('Session requested! 1 credit will be held in escrow once teacher confirms.');
          }}
        />
      )}
    </div>
  );
};
