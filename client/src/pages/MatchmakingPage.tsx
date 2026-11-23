import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeftRight, PlusCircle } from 'lucide-react';
import api from '../services/api';
import { MatchResult, User } from '../types';
import { MatchCard } from '../components/MatchCard';
import { BookingModal } from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const MatchmakingPage: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'MUTUAL' | 'CAN_TEACH'>('ALL');
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/matches');
      setMatches(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const filteredMatches = matches.filter((m) => {
    if (filterType === 'MUTUAL') return m.matchType === 'MUTUAL_EXCHANGE';
    if (filterType === 'CAN_TEACH') return m.matchType === 'CAN_TEACH_YOU';
    return true;
  });

  const mutualCount = matches.filter((m) => m.matchType === 'MUTUAL_EXCHANGE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-indigo-400 animate-spin" />
            <span>Automated Peer Barter Matchmaker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Smart Peer Matches</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            We cross-reference your "Can Teach" and "Want to Learn" skills with peers to discover high-compatibility knowledge exchanges.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex p-1 bg-[#0d0d14]/80 border border-white/10 rounded-xl text-xs font-semibold shadow-xl">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              filterType === 'ALL' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Matches ({matches.length})
          </button>
          <button
            onClick={() => setFilterType('MUTUAL')}
            className={`px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-all ${
              filterType === 'MUTUAL' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-indigo-300'
            }`}
          >
            <Sparkles size={13} />
            <span>Mutual Swaps ({mutualCount})</span>
          </button>
          <button
            onClick={() => setFilterType('CAN_TEACH')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              filterType === 'CAN_TEACH' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Can Teach You
          </button>
        </div>
      </div>

      {/* Matchmaking Explanation Banner */}
      <div className="bg-[#0d0d14]/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
            <ArrowLeftRight size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">How Compatibility Is Scored</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Users with <strong className="text-indigo-300">reciprocal skills</strong> (you teach what they need AND they teach what you need) receive 90%+ compatibility scores.
            </p>
          </div>
        </div>
        <Link
          to="/profile"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/10 rounded-xl text-xs font-semibold shrink-0 transition-colors"
        >
          <PlusCircle size={14} className="text-indigo-400" />
          <span>Add More Skills</span>
        </Link>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Calculating reciprocal compatibility scores...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10 shadow-xl">
          <Sparkles size={32} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-base font-bold text-white">No matches found in this filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Try adding more skills to your "Can Teach" or "Wants to Learn" lists on your profile to unlock new peer pairings.
          </p>
          <Link
            to="/profile"
            className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
          >
            Update Your Skills
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((m) => (
            <MatchCard
              key={m.user.id}
              match={m}
              onBook={() => setSelectedTeacher(m.user)}
            />
          ))}
        </div>
      )}

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
