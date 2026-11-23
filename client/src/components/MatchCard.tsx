import React from 'react';
import { Sparkles, CheckCircle2, Calendar } from 'lucide-react';
import { MatchResult } from '../types';
import { RatingStars } from './RatingStars';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: MatchResult;
  onBook: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onBook }) => {
  const { user, matchType, matchScore, canTeachMe, canLearnFromMe } = match;

  const isMutual = matchType === 'MUTUAL_EXCHANGE';

  return (
    <div
      className={`relative bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-5 border transition-all duration-200 text-slate-100 shadow-xl ${
        isMutual
          ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.22)] ring-1 ring-indigo-500/30'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Top Banner / Match Score */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          {isMutual ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40">
              <Sparkles size={13} className="text-indigo-400 animate-pulse" />
              <span>Perfect Mutual Swap</span>
            </span>
          ) : matchType === 'CAN_TEACH_YOU' ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Can Teach Your Goal</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/40">
              <span>Wants Your Skill</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/10 font-mono text-xs font-bold text-white">
          <span>{matchScore}%</span>
          <span className="text-[10px] text-slate-400 font-sans">Match</span>
        </div>
      </div>

      {/* User Info Header */}
      <div className="flex items-start space-x-3.5 mt-4">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
          alt={user.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-white/15 shadow-md shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link
              to={`/users/${user.id}`}
              className="text-base font-bold text-white hover:text-indigo-400 transition-colors truncate"
            >
              {user.name}
            </Link>
          </div>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{user.headline}</p>

          <div className="flex items-center space-x-3 mt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <RatingStars rating={Math.round(user.averageRating || 5)} size={13} />
              <span className="font-semibold text-slate-200 ml-1">{user.averageRating}</span>
              <span className="text-[11px] text-slate-500">({user.reviewCount || 0})</span>
            </div>
            <span>•</span>
            <span className="text-slate-300">{user.completedSessions || 0} sessions</span>
          </div>
        </div>
      </div>

      {/* Barter Overlap Breakdown */}
      <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2 text-xs">
        {canTeachMe.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Can teach you:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {canTeachMe.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {canLearnFromMe.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Wants to learn:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {canLearnFromMe.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {user.availability && (
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-1.5 border-t border-white/[0.06]">
            <Calendar size={12} className="shrink-0 text-indigo-400" />
            <span className="truncate">{user.availability}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3.5 flex items-center space-x-2.5 border-t border-white/10">
        <Link
          to={`/users/${user.id}`}
          className="flex-1 py-2 text-center text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 rounded-xl transition-colors"
        >
          View Profile
        </Link>
        <button
          onClick={onBook}
          className="flex-1 py-2 text-center text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-100"
        >
          Book 30m Session
        </button>
      </div>
    </div>
  );
};
