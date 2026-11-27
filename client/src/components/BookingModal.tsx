import React, { useState } from 'react';
import { X, Calendar, Clock, Target, Link as LinkIcon, ShieldCheck, AlertCircle, Video } from 'lucide-react';
import api from '../services/api';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  teacher: User;
  preselectedSkill?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  teacher,
  preselectedSkill,
  onClose,
  onSuccess,
}) => {
  const { user, refreshUser } = useAuth();
  const teachSkills = teacher.skills?.filter((s) => s.type === 'TEACH') || [];

  const [skillName, setSkillName] = useState(preselectedSkill || teachSkills[0]?.skillName || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('18:00');
  const [goalDescription, setGoalDescription] = useState('');
  const [location, setLocation] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName || !scheduledDate || !scheduledTime) {
      setError('Please select a skill, date, and time.');
      return;
    }

    if (!user || user.credits < 1) {
      setError('You need at least 1 credit to book a session.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`);
      await api.post('/bookings', {
        teacherId: teacher.id,
        skillName,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: 30,
        goalDescription,
        location,
        meetingLink: meetingLink.trim() || 'https://meet.google.com/new',
      });

      await refreshUser();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to book session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0b0b12]/95 rounded-2xl max-w-lg w-full p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/10 relative max-h-[95vh] overflow-y-auto text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3.5 pb-4 border-b border-white/10">
          <img
            src={teacher.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={teacher.name}
            className="w-13 h-13 rounded-xl object-cover border border-white/15 shrink-0"
          />
          <div>
            <h3 className="text-lg font-bold text-white">Book Session with {teacher.name}</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{teacher.headline}</p>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Skill to Learn</label>
            {teachSkills.length > 0 ? (
              <select
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white"
              >
                {teachSkills.map((s) => (
                  <option key={s.id} value={s.skillName} className="bg-[#121218] text-white">
                    {s.skillName} ({s.proficiencyLevel} • {s.category})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Python Basics"
                className="w-full px-3 py-2.5 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Calendar size={13} className="text-indigo-400" />
                  <span>Date</span>
                </span>
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white scheme-dark"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Clock size={13} className="text-indigo-400" />
                  <span>Time</span>
                </span>
              </label>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white scheme-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Target size={13} className="text-indigo-400" />
                <span>Learning Goal / Objective</span>
              </span>
            </label>
            <textarea
              rows={2}
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="What specifically would you like to achieve during this 30-minute session?"
              className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
            />
          </div>

          {/* Google Meet Connection */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300">
                <Video size={15} className="text-emerald-400" />
                <span>Google Meet Video Session</span>
              </span>
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center space-x-1 bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-500/30 transition-colors"
              >
                <span>+ Create Google Meet</span>
              </a>
            </div>
            <div>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-yyyy-zzz (or leave default to open instantly)"
                className="w-full px-3 py-2 text-xs border border-emerald-500/30 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden bg-black/40 text-emerald-100 placeholder-emerald-400/50 font-mono"
              />
              <p className="text-[10px] text-emerald-400/80 mt-1">
                Both you and {teacher.name} can join this Google Meet directly from your Sessions page once confirmed.
              </p>
            </div>
          </div>

          {/* Time & Escrow Details */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 text-xs text-indigo-200 space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck size={16} className="text-indigo-400" />
                <span>Escrow Guarantee (30-min = 1 Credit)</span>
              </span>
              <span className="font-mono bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/40 text-[11px]">
                1 Credit Held
              </span>
            </div>
            <p className="text-[11px] text-indigo-300/80 leading-relaxed">
              Your credit will only be locked once {teacher.name} accepts. It is safely transferred to {teacher.name} after the session is completed.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-[1.02] active:scale-100 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Session Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
