import React from 'react';
import { Sparkles, ArrowLeftRight, CheckCircle2, Calendar, Globe, Star } from 'lucide-react';
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
      className={`relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-xl ${
        isMutual
          ? 'border-indigo-300 ring-2 ring-indigo-500/10 shadow-lg'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Top Banner / Match Score */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          {isMutual ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles size={13} className="text-indigo-600 animate-pulse" />
              <span>Perfect Mutual Swap</span>
            </span>
          ) : matchType === 'CAN_TEACH_YOU' ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={13} />
              <span>Can Teach Your Goal</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <span>Wants Your Skill</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 font-mono text-xs font-bold text-slate-800">
          <span>{matchScore}%</span>
          <span className="text-[10px] text-slate-400 font-sans">Match</span>
        </div>
      </div>

      {/* User Info Header */}
      <div className="flex items-start space-x-3.5 mt-4">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
          alt={user.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link
              to={`/users/${user.id}`}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate"
            >
              {user.name}
            </Link>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">{user.headline}</p>

          <div className="flex items-center space-x-3 mt-1.5 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <RatingStars rating={Math.round(user.averageRating || 5)} size={13} />
              <span className="font-semibold text-slate-700 ml-1">{user.averageRating}</span>
              <span className="text-[11px] text-slate-400">({user.reviewCount || 0})</span>
            </div>
            <span>•</span>
            <span className="text-slate-600">{user.completedSessions || 0} sessions</span>
          </div>
        </div>
      </div>

      {/* Barter Overlap Breakdown */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs">
        {canTeachMe.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Can teach you:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {canTeachMe.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md font-semibold bg-indigo-100 text-indigo-800 text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {canLearnFromMe.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Wants to learn:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {canLearnFromMe.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800 text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {user.availability && (
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
            <Calendar size={12} className="shrink-0 text-slate-400" />
            <span className="truncate">{user.availability}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 flex items-center space-x-2 border-t border-slate-100">
        <Link
          to={`/users/${user.id}`}
          className="glass-btn flex-1 py-2 text-center text-xs font-semibold text-slate-700 rounded-xl"
        >
          View Profile
        </Link>
        <button
          onClick={onBook}
          className="glass-btn-primary flex-1 py-2 text-center text-xs font-semibold rounded-xl"
        >
          Book 30m Session
        </button>
      </div>
    </div>
  );
};
