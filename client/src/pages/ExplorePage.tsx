import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Peer Skills</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search peers ready to share their expertise in coding, foreign languages, UX design, and instruments.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill (e.g. React, French, Python), name, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
            />
          </div>

          {/* Skill Type Switcher */}
          <div className="flex p-1 bg-white/[0.06] border border-white/10 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setSelectedSkillType('TEACH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSkillType === 'TEACH' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Can Teach
            </button>
            <button
              onClick={() => setSelectedSkillType('LEARN')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSkillType === 'LEARN' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wants to Learn
            </button>
            <button
              onClick={() => setSelectedSkillType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSkillType === 'ALL' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Skills
            </button>
          </div>
        </div>

        {/* Category & Proficiency Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  (selectedCategory === cat || (!selectedCategory && cat === 'All Categories'))
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Proficiency Dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1 text-xs border border-white/10 rounded-lg bg-[#14141c] text-white focus:outline-hidden"
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0d0d14]/80 rounded-2xl p-5 border border-white/10 shadow-xl animate-pulse">
              <div className="flex items-start space-x-3.5 mb-4">
                <div className="rounded-2xl bg-white/[0.08] shrink-0" style={{width:'52px',height:'52px'}} />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-white/[0.1] rounded-lg w-3/4" />
                  <div className="h-3 bg-white/[0.06] rounded-lg w-1/2" />
                  <div className="h-3 bg-white/[0.06] rounded-lg w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-white/[0.06] rounded-lg w-full" />
                <div className="h-3 bg-white/[0.06] rounded-lg w-4/5" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-7 bg-white/[0.06] rounded-xl flex-1" />
                <div className="h-7 bg-indigo-500/30 rounded-xl flex-1" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#0d0d14]/80 rounded-2xl p-12 text-center border border-white/10 shadow-xl backdrop-blur-xl">
          <p className="text-slate-300 text-sm">No peers found matching your filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
              setSelectedSkillType('TEACH');
            }}
            className="mt-3 text-xs font-bold text-indigo-400 hover:underline"
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
                className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-xl hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={peer.name}
                      className="w-13 h-13 rounded-2xl object-cover border border-white/15 shrink-0 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/users/${peer.id}`}
                          className="font-bold text-sm text-white hover:text-indigo-400 truncate block"
                        >
                          {peer.name}
                        </Link>
                        {isSelf && (
                          <span className="text-[10px] bg-white/[0.08] text-slate-400 px-1.5 py-0.5 rounded-md font-semibold border border-white/10">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{peer.headline}</p>

                      <div className="flex items-center space-x-2 mt-1.5 text-xs text-slate-400">
                        <RatingStars rating={Math.round(peer.averageRating || 5)} size={12} />
                        <span className="font-semibold text-slate-200">{peer.averageRating}</span>
                        <span>•</span>
                        <span>{peer.completedSessions || 0} sessions</span>
                      </div>
                    </div>
                  </div>

                  {peer.bio && (
                    <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {peer.bio}
                    </p>
                  )}

                  {/* Skills Grid */}
                  <div className="mt-4 space-y-2.5 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                        Can Teach
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teachSkills.length > 0 ? (
                          teachSkills.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-[11px] font-medium"
                            >
                              {s.skillName} <span className="text-[9px] text-indigo-400 font-bold">({s.proficiencyLevel})</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">None listed</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        Wants to Learn
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {learnSkills.length > 0 ? (
                          learnSkills.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-[11px] font-medium"
                            >
                              {s.skillName}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Open to ideas</span>
                        )}
                      </div>
                    </div>

                    {/* Schedule snippet */}
                    {peer.availability && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-1">
                        <Calendar size={12} className="text-indigo-400 shrink-0" />
                        <span className="truncate">{peer.availability}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center space-x-2">
                  <Link
                    to={`/users/${peer.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 rounded-xl transition-colors"
                  >
                    View Profile
                  </Link>

                  {!isSelf && (
                    <button
                      onClick={() => setBookingTeacher(peer)}
                      className="flex-1 py-2 text-center text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-100"
                    >
                      Book Session
                    </button>
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
            navigate('/sessions');
          }}
        />
      )}
    </div>
  );
};
