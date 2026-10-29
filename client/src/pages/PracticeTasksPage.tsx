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
} from 'lucide-react';
import api from '../services/api';
import { PracticeTask } from '../types';
import { useAuth } from '../context/AuthContext';

export const PracticeTasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<PracticeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'LEARNER' | 'TEACHER'>('LEARNER');

  // Submit task modal state
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  // Review task modal state
  const [reviewingTaskId, setReviewingTaskId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

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
      alert('Task submitted! Your teacher will review it.');
    } catch (e) {
      console.error(e);
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
      alert('Feedback delivered to the learner!');
    } catch (e) {
      console.error(e);
    }
  };

  const learnerTasks = tasks.filter((t) => t.learnerId === user?.id);
  const teacherTasks = tasks.filter((t) => t.teacherId === user?.id);
  const currentList = activeTab === 'LEARNER' ? learnerTasks : teacherTasks;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <BookOpen size={13} className="text-emerald-600" />
            <span>Practice Exercises & Personalized Feedback</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Practice Tasks & Quizzes</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Solidify learning between 30-min sessions with practical drills and instructor code reviews.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold shadow-xs">
          <button
            onClick={() => setActiveTab('LEARNER')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'LEARNER' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assigned to You ({learnerTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('TEACHER')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'TEACHER' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tasks You Assigned ({teacherTasks.length})
          </button>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-sm">Loading practice assignments...</div>
      ) : currentList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">No tasks in this category.</p>
          <p className="text-xs text-slate-400 mt-1">
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
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                    <p className="text-xs text-slate-500">
                      {activeTab === 'LEARNER' ? `Teacher: ${task.teacher.name}` : `Learner: ${task.learner.name}`}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                    task.status === 'REVIEWED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : task.status === 'SUBMITTED'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {task.status}
                </span>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  Exercise Instructions
                </span>
                <p className="leading-relaxed whitespace-pre-wrap">{task.instructions}</p>
              </div>

              {/* Learner Submission if exists */}
              {task.submissionText && (
                <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 text-xs space-y-1">
                  <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wider">
                    Learner Submission
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{task.submissionText}</p>
                </div>
              )}

              {/* Teacher Feedback if exists */}
              {task.feedback && (
                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                    <Award size={13} className="text-emerald-600" />
                    <span>Teacher Feedback</span>
                  </span>
                  <p className="text-emerald-950 leading-relaxed whitespace-pre-wrap">{task.feedback}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                {activeTab === 'LEARNER' && task.status === 'ASSIGNED' && (
                  <button
                    onClick={() => {
                      setSubmittingTaskId(task.id);
                      setSubmissionText('');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSubmittingTaskId(null)}
              className="absolute top-4 right-4 text-slate-400 p-1"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Submit Your Practice Exercise</h3>
            <p className="text-xs text-slate-500 mt-1">Provide code snippets, solution text, or links to your work.</p>

            <form onSubmit={handleLearnerSubmit} className="mt-4 space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Paste code or describe your solution, e.g.: https://github.com/..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSubmittingTaskId(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setReviewingTaskId(null)}
              className="absolute top-4 right-4 text-slate-400 p-1"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-900">Provide Review & Guidance</h3>
            <p className="text-xs text-slate-500 mt-1">Share actionable tips on how the learner can improve.</p>

            <form onSubmit={handleTeacherFeedback} className="mt-4 space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Great job! One recommendation: avoid mutating state directly..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReviewingTaskId(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
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
