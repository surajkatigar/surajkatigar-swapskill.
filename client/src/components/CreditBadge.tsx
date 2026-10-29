import React, { useState } from 'react';
import { Coins, History, ArrowDownLeft, ArrowUpRight, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CreditTransaction } from '../types';

export const CreditBadge: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setShowModal(true);
    try {
      const res = await api.get('/users/credits/history');
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={fetchHistory}
        className="glass-pill-amber flex items-center space-x-2 text-amber-950 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs group"
        title="Click to view credit ledger & escrow info"
      >
        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-xs group-hover:rotate-12 transition-transform">
          <Coins size={12} className="stroke-[2.5]" />
        </div>
        <span className="font-mono tracking-tight text-sm">{user.credits}</span>
        <span className="text-[11px] text-amber-800 font-semibold hidden sm:inline">Credits</span>
      </button>

      {/* Credit History & Escrow Rules Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Coins size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Your Time-Based Credit Ledger</h3>
                <p className="text-xs text-slate-500">
                  Available Balance: <span className="font-bold text-amber-600 font-mono text-sm">{user.credits} Credits</span>
                </p>
              </div>
            </div>

            {/* How Credit & Escrow Works Banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 my-4 text-xs text-slate-600 space-y-2">
              <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>How SwapSkill Credit Barter Works</span>
              </div>
              <p>• <strong>Signup</strong>: Every new member gets 2 free starter credits.</p>
              <p>• <strong>Escrow</strong>: 1 credit is safely held in escrow when a 30-min session is accepted.</p>
              <p>• <strong>Transfer</strong>: Upon mutual confirmation, 1 credit transfers into the teacher's balance.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-2">
                <History size={14} />
                <span>Transaction History</span>
              </div>

              {loading ? (
                <div className="py-8 text-center text-slate-400 text-sm">Loading transactions...</div>
              ) : history.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">No transaction records yet.</div>
              ) : (
                <div className="space-y-2.5">
                  {history.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${
                            tx.amount > 0
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {tx.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-800 line-clamp-1">{tx.description}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                            {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold font-mono ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-700'
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
