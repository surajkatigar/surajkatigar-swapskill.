import React, { useState } from 'react';
import { X, Award, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { RatingStars } from './RatingStars';

interface ReviewModalProps {
  sessionId: string;
  partnerName: string;
  skillName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  sessionId,
  partnerName,
  skillName,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [skillQuality, setSkillQuality] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment describing your experience.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/reviews', {
        sessionId,
        rating,
        skillQualityRating: skillQuality,
        punctualityRating: punctuality,
        comment,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Review Session</h3>
          <p className="text-xs text-slate-500">
            Share feedback for <span className="font-semibold text-slate-700">{partnerName}</span> on{' '}
            <span className="font-semibold text-indigo-600">{skillName}</span>
          </p>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Overall Rating</span>
              <RatingStars rating={rating} interactive onChange={setRating} size={22} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
              <span className="text-xs text-slate-600 flex items-center space-x-1.5">
                <Award size={14} className="text-indigo-500" />
                <span>Teaching Quality</span>
              </span>
              <RatingStars rating={skillQuality} interactive onChange={setSkillQuality} size={18} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
              <span className="text-xs text-slate-600 flex items-center space-x-1.5">
                <Clock size={14} className="text-emerald-500" />
                <span>Punctuality & Prep</span>
              </span>
              <RatingStars rating={punctuality} interactive onChange={setPunctuality} size={18} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center space-x-1">
                <MessageSquare size={13} />
                <span>Your Testimonial / Feedback</span>
              </span>
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What went well? How clearly did they explain concepts?"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
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
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
