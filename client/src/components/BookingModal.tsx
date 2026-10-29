import React, { useState } from 'react';
import { X, Calendar, Clock, Target, Link, ShieldCheck, AlertCircle } from 'lucide-react';
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
  const [location, setLocation] = useState('SwapSkill In-App Live Meeting');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <img
            src={teacher.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={teacher.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Book Session with {teacher.name}</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{teacher.headline}</p>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skill to Learn</label>
            {teachSkills.length > 0 ? (
              <select
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-slate-50/50"
              >
                {teachSkills.map((s) => (
                  <option key={s.id} value={s.skillName}>
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
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Calendar size={13} />
                  <span>Date</span>
                </span>
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center space-x-1">
                  <Clock size={13} />
                  <span>Time</span>
                </span>
              </label>
              <input
                type="time"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center space-x-1">
                <Target size={13} />
                <span>Learning Goal / Objective</span>
              </span>
            </label>
            <textarea
              rows={2}
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="What specifically would you like to achieve during this 30-minute session?"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center space-x-1">
                <Link size={13} />
                <span>Session Location / Mode</span>
              </span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="SwapSkill Online Video Room or Campus Library"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Time & Escrow Details */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center space-x-1">
                <ShieldCheck size={15} className="text-indigo-600" />
                <span>Escrow Guarantee (30-min = 1 Credit)</span>
              </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                1 Credit Held
              </span>
            </div>
            <p className="text-[11px] text-indigo-700">
              Your credit will only be locked once {teacher.name} accepts. It is safely transferred to {teacher.name} after the session is completed.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="glass-btn px-4 py-2 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glass-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Session Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
