import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  Calendar,
  Globe,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import api from '../services/api';
import { User } from '../types';
import { RatingStars } from '../components/RatingStars';
import { BookingModal } from '../components/BookingModal';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkillType, setSelectedSkillType] = useState<'ALL' | 'TEACH' | 'LEARN'>('TEACH');
  const [selectedLevel, setSelectedLevel] = useState('');

  const [bookingTeacher, setBookingTeacher] = useState<User | null>(null);

  const categories = [
    'All Categories',
    'Programming',
    'UI/UX Design',
    'Languages',
    'Music',
    'Business & Career',
    'Academics',
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory && selectedCategory !== 'All Categories') {
        const catQuery = selectedCategory === 'UI/UX Design' ? 'Design' : selectedCategory;
        params.append('category', catQuery);
      }
      if (selectedSkillType !== 'ALL') params.append('skillType', selectedSkillType);
      if (selectedLevel) params.append('level', selectedLevel);

      const res = await api.get(`/users?${params.toString()}`);
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedSkillType, selectedLevel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Peer Skills</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search peers ready to share their expertise in coding, foreign languages, UX design, and instruments.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill (e.g. React, French, Python), name, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Skill Type Switcher */}
          <div className="flex p-1 glass-btn rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setSelectedSkillType('TEACH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSkillType === 'TEACH' ? 'glass-btn text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Can Teach
            </button>
            <button
              onClick={() => setSelectedSkillType('LEARN')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSkillType === 'LEARN' ? 'glass-btn text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Wants to Learn
            </button>
            <button
              onClick={() => setSelectedSkillType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSkillType === 'ALL' ? 'glass-btn text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Skills
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All Categories' ? '' : cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                (cat === 'All Categories' && !selectedCategory) || selectedCategory === cat
                  ? 'glass-btn-dark'
                  : 'glass-btn text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">Searching peers...</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No peers found matching your filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedSkillType('TEACH');
            }}
            className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((peer) => {
            const teachSkills = peer.skills?.filter((s) => s.type === 'TEACH') || [];
            const learnSkills = peer.skills?.filter((s) => s.type === 'LEARN') || [];
            const isSelf = user?.id === peer.id;

            return (
              <div
                key={peer.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={peer.name}
                      className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/users/${peer.id}`}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600 truncate block"
                        >
                          {peer.name}
                        </Link>
                        {isSelf && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{peer.headline}</p>

                      <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-500">
                        <RatingStars rating={Math.round(peer.averageRating || 5)} size={12} />
                        <span className="font-semibold text-slate-700">{peer.averageRating}</span>
                        <span>•</span>
                        <span>{peer.completedSessions || 0} sessions</span>
                      </div>
                    </div>
                  </div>

                  {peer.bio && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {peer.bio}
                    </p>
                  )}

                  {/* Skills Grid */}
                  <div className="mt-4 space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                        Can Teach
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teachSkills.length > 0 ? (
                          teachSkills.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-800 text-[11px] font-medium"
                            >
                              {s.skillName} <span className="text-[9px] text-indigo-500 font-bold">({s.proficiencyLevel})</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None listed</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                        Wants to Learn
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {learnSkills.length > 0 ? (
                          learnSkills.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-medium"
                            >
                              {s.skillName}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Open to ideas</span>
                        )}
                      </div>
                    </div>

                    {/* Schedule / Language snippet */}
                    {peer.availability && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-1">
                        <Calendar size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{peer.availability}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <Link
                    to={`/users/${peer.id}`}
                    className="glass-btn flex-1 py-2 text-center text-xs font-semibold text-slate-700 rounded-xl"
                  >
                    Profile
                  </Link>
                  {!isSelf && (
                    <>
                      <button
                        onClick={() => navigate(`/chat?partner=${peer.id}`)}
                        className="glass-btn p-2 text-slate-600 hover:text-indigo-600 rounded-xl"
                        title="Direct Message"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button
                        onClick={() => setBookingTeacher(peer)}
                        className="glass-btn-primary flex-1 py-2 text-center text-xs font-semibold rounded-xl"
                      >
                        Book 30m
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {bookingTeacher && (
        <BookingModal
          teacher={bookingTeacher}
          onClose={() => setBookingTeacher(null)}
          onSuccess={() => {
            setBookingTeacher(null);
            alert('Session requested! 1 credit will be locked in escrow upon teacher acceptance.');
          }}
        />
      )}
    </div>
  );
};
