import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050508] border-t border-white/[0.08] mt-20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Swap<span className="text-indigo-400">Skill</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              A peer-to-peer web application where users exchange personal skills directly with peers without spending money, using a peer-matching and time-based credit system.
            </p>
            <div className="flex items-center space-x-1 text-xs text-slate-400">
              <span>Built with mutual knowledge sharing</span>
              <Heart size={13} className="text-rose-500 fill-rose-500" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/explore" className="hover:text-indigo-400 transition-colors">Search Teachers &amp; Learners</Link></li>
              <li><Link to="/matches" className="hover:text-indigo-400 transition-colors">Peer Matchmaking</Link></li>
              <li><Link to="/workshops" className="hover:text-indigo-400 transition-colors">Small Group Workshops</Link></li>
              <li><Link to="/circles" className="hover:text-indigo-400 transition-colors">Learning Circles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Credit System</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>1. Signup: 2 Starter Credits</li>
              <li>2. Booking: 1 Credit Held in Escrow</li>
              <li>3. Session: 30-min Mutual Learning</li>
              <li>4. Transfer: Credit Released to Teacher</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SwapSkill Blueprint Edition. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Time-Banked Peer Skill Barter</p>
        </div>
      </div>
    </footer>
  );
};
