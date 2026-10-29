import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeftRight, HelpCircle, PlusCircle, CheckCircle2 } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-indigo-600 animate-spin" />
            <span>Automated Peer Barter Matchmaker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Smart Peer Matches</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We cross-reference your "Can Teach" and "Want to Learn" skills with peers to discover high-compatibility knowledge exchanges.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold shadow-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              filterType === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Matches ({matches.length})
          </button>
          <button
            onClick={() => setFilterType('MUTUAL')}
            className={`px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
              filterType === 'MUTUAL' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Sparkles size={13} />
            <span>Mutual Swaps ({mutualCount})</span>
          </button>
          <button
            onClick={() => setFilterType('CAN_TEACH')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              filterType === 'CAN_TEACH' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Can Teach You
          </button>
        </div>
      </div>

      {/* Matchmaking Explanation Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-transparent p-4 sm:p-5 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <ArrowLeftRight size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">How Compatibility Is Scored</h4>
            <p className="text-xs text-slate-600">
              Users with <strong>reciprocal skills</strong> (you teach what they need AND they teach what you need) receive 90%+ compatibility scores.
            </p>
          </div>
        </div>
        <Link
          to="/profile"
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-indigo-700 text-xs font-bold rounded-xl shrink-0 flex items-center space-x-1.5 shadow-xs"
        >
          <PlusCircle size={14} />
          <span>Update Your Teach & Learn Skills</span>
        </Link>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Calculating smart compatibility scores...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-600 font-semibold text-sm">No matches found for this filter.</p>
          <p className="text-xs text-slate-400 mt-1">Make sure you have added both skills you "Can Teach" and skills you "Want to Learn" on your profile.</p>
          <Link
            to="/profile"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Configure Profile Skills
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.user.id}
              match={match}
              onBook={() => setSelectedTeacher(match.user)}
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
