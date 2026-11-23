import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  Award,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import api from '../services/api';
import { PracticeTask } from '../types';
import { useAuth } from '../context/AuthContext';

export const PracticeTasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<PracticeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'LEARNER' | 'TEACHER'>('LEARNER');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Submit task modal state
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  // Review task modal state
  const [reviewingTaskId, setReviewingTaskId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLearnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTaskId || !submissionText.trim()) return;

    try {
      await api.put(`/tasks/${submittingTaskId}/submit`, {
        submissionText,
      });
      await fetchTasks();
      setSubmittingTaskId(null);
      setSubmissionText('');
      showToast('Task submitted! Your teacher will review it.');
    } catch (e) {
      showToast('Failed to submit task.', 'error');
    }
  };

  const handleTeacherFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingTaskId || !feedbackText.trim()) return;

    try {
      await api.put(`/tasks/${reviewingTaskId}/review`, {
        feedback: feedbackText,
      });
      await fetchTasks();
      setReviewingTaskId(null);
      setFeedbackText('');
      showToast('Feedback delivered to the learner!');
    } catch (e) {
      showToast('Failed to deliver feedback.', 'error');
    }
  };

  const learnerTasks = tasks.filter((t) => t.learnerId === user?.id);
  const teacherTasks = tasks.filter((t) => t.teacherId === user?.id);
  const currentList = activeTab === 'LEARNER' ? learnerTasks : teacherTasks;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
            <BookOpen size={13} className="text-emerald-400" />
            <span>Practice Exercises &amp; Personalized Feedback</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Practice Tasks &amp; Quizzes</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Solidify learning between 30-min sessions with practical drills and instructor code reviews.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/[0.06] border border-white/10 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('LEARNER')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'LEARNER'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Assigned to You ({learnerTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('TEACHER')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'TEACHER'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tasks You Assigned ({teacherTasks.length})
          </button>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#0d0d14]/80 rounded-2xl p-5 border border-white/10 animate-pulse space-y-4">
              <div className="h-5 bg-white/15 rounded-md w-1/4" />
              <div className="h-14 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/10">
          <p className="text-slate-400 text-sm">No tasks in this category.</p>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'LEARNER'
              ? 'Complete a session with a teacher to receive practice homework!'
              : 'Visit your completed sessions to assign practice exercises to learners.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((task) => (
            <div
              key={task.id}
              className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{task.title}</h3>
                    <p className="text-xs text-slate-400">
                      {activeTab === 'LEARNER' ? `Teacher: ${task.teacher.name}` : `Learner: ${task.learner.name}`}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                    task.status === 'REVIEWED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : task.status === 'SUBMITTED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {task.status}
                </span>
              </div>

              {/* Instructions */}
              <div className="bg-white/[0.04] p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
                  Exercise Instructions
                </span>
                <p className="leading-relaxed whitespace-pre-wrap">{task.instructions}</p>
              </div>

              {/* Learner Submission if exists */}
              {task.submissionText && (
                <div className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-500/30 text-xs space-y-1">
                  <span className="font-bold text-indigo-300 block text-[11px] uppercase tracking-wider">
                    Learner Submission
                  </span>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{task.submissionText}</p>
                </div>
              )}

              {/* Teacher Feedback if exists */}
              {task.feedback && (
                <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/30 text-xs space-y-1">
                  <span className="font-bold text-emerald-300 block text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <Award size={13} className="text-emerald-400" />
                    <span>Teacher Feedback</span>
                  </span>
                  <p className="text-emerald-200 leading-relaxed whitespace-pre-wrap">{task.feedback}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-2 border-t border-white/10">
                {activeTab === 'LEARNER' && task.status === 'ASSIGNED' && (
                  <button
                    onClick={() => {
                      setSubmittingTaskId(task.id);
                      setSubmissionText('');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25 hover:scale-[1.01] active:scale-100"
                  >
                    Submit Completed Work
                  </button>
                )}

                {activeTab === 'TEACHER' && task.status === 'SUBMITTED' && (
                  <button
                    onClick={() => {
                      setReviewingTaskId(task.id);
                      setFeedbackText('');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.01] active:scale-100"
                  >
                    Provide Feedback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Learner Submit Modal */}
      {submittingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b0b12]/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/10 relative text-slate-100">
            <button
              onClick={() => setSubmittingTaskId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white">Submit Your Practice Exercise</h3>
            <p className="text-xs text-slate-400 mt-1">Provide code snippets, solution text, or links to your work.</p>

            <form onSubmit={handleLearnerSubmit} className="mt-4 space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Paste code or describe your solution, e.g.: https://github.com/..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSubmittingTaskId(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:scale-[1.02] active:scale-100 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Submit Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Review Modal */}
      {reviewingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b0b12]/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-white/10 relative text-slate-100">
            <button
              onClick={() => setReviewingTaskId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white">Provide Review &amp; Guidance</h3>
            <p className="text-xs text-slate-400 mt-1">Share actionable tips on how the learner can improve.</p>

            <form onSubmit={handleTeacherFeedback} className="mt-4 space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Great job! One recommendation: avoid mutating state directly..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-white/10 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-hidden bg-white/[0.06] text-white placeholder-slate-500"
              />
              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setReviewingTaskId(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-[1.02] active:scale-100 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Deliver Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
