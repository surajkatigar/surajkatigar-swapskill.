import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Calendar,
  Coins,
  AlertTriangle,
  FolderPlus,
  CheckCircle,
  XCircle,
  Tag,
  Check,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // New Category State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catTags, setCatTags] = useState('');
  const [addingCat, setAddingCat] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, catRes, dispRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/categories'),
        api.get('/admin/disputes'),
      ]);
      setStats(statsRes.data);
      setCategories(catRes.data);
      setDisputes(dispRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    setAddingCat(true);
    try {
      await api.post('/admin/categories', {
        name: catName,
        description: catDesc,
        popularTags: catTags,
      });
      await fetchData();
      setCatName('');
      setCatDesc('');
      setCatTags('');
      showToast('Skill category added!');
    } catch (e) {
      showToast('Failed to add category.', 'error');
    } finally {
      setAddingCat(false);
    }
  };

  const handleResolveDispute = async (id: string, refund: boolean) => {
    try {
      await api.put(`/admin/disputes/${id}/resolve`, {
        status: 'RESOLVED',
        adminNotes: refund ? 'Resolved by admin with full escrow credit refund' : 'Resolved after review',
        refundCredit: refund,
      });
      await fetchData();
      showToast(refund ? 'Dispute resolved and credit refunded!' : 'Dispute marked as resolved.');
    } catch (e) {
      showToast('Failed to resolve dispute.', 'error');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto py-24 text-center text-slate-100">
        <Shield size={36} className="mx-auto text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-white">Admin Clearance Required</h2>
        <p className="text-xs text-slate-400 mt-1">
          Use the persona switcher in the top bar to switch to <strong>SwapSkill Admin</strong> (admin@swapskill.com).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
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
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-600/30">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform Admin &amp; Safety Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage skill taxonomies, track barter metrics, and resolve peer disputes.</p>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0d0d14]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Peers</span>
              <Users size={16} className="text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono mt-2">{stats.totalUsers}</p>
          </div>

          <div className="bg-[#0d0d14]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Completed Sessions</span>
              <Calendar size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-2">{stats.completedSessions}</p>
          </div>

          <div className="bg-[#0d0d14]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Escrow Credits Active</span>
              <Coins size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-amber-400 font-mono mt-2">{stats.lockedEscrowSessions}</p>
          </div>

          <div className="bg-[#0d0d14]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Open Safety Disputes</span>
              <AlertTriangle size={16} className="text-rose-400" />
            </div>
            <p className="text-2xl font-extrabold text-rose-400 font-mono mt-2">{stats.openDisputes}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Skill Categories Management */}
        <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">Manage Skill Categories</h3>
              <p className="text-xs text-slate-400 mt-0.5">Configure canonical taxonomies for peer searches.</p>
            </div>
            <Tag size={18} className="text-indigo-400" />
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleCreateCategory} className="bg-white/[0.04] p-4 rounded-xl border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-slate-200">Add New Category</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. AI & Prompting)"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="px-3 py-2 text-xs border border-white/10 rounded-lg bg-white/[0.06] text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Popular Tags (comma separated)"
                value={catTags}
                onChange={(e) => setCatTags(e.target.value)}
                className="px-3 py-2 text-xs border border-white/10 rounded-lg bg-white/[0.06] text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <input
              type="text"
              placeholder="Short description..."
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-white/10 rounded-lg bg-white/[0.06] text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingCat}
                className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
              >
                {addingCat ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {categories.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.03] hover:border-white/15 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                </div>
                {c.description && <p className="text-[11px] text-slate-400 mt-0.5">{c.description}</p>}
                {c.popularTags && (
                  <p className="text-[10px] text-indigo-400 font-mono mt-1">Tags: {c.popularTags}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dispute Resolution Center */}
        <div className="bg-[#0d0d14]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">Safety &amp; Dispute Resolution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Handle reported sessions and refund escrow if required.</p>
            </div>
            <AlertTriangle size={18} className="text-amber-400" />
          </div>

          {disputes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No active dispute reports at this time. All exchanges running smoothly!
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {disputes.map((d) => (
                <div key={d.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Reporter: {d.reporter?.name} vs {d.reportedUser?.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        d.status === 'OPEN'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-white/[0.04] p-2.5 rounded-lg border border-white/5">
                    "{d.reason}"
                  </p>

                  {d.session && (
                    <p className="text-[11px] text-slate-400">
                      Session: {d.session.skillName} (Escrow Locked:{' '}
                      {d.session.escrowCreditLocked ? 'Yes' : 'No'})
                    </p>
                  )}

                  {d.status === 'OPEN' && (
                    <div className="flex items-center space-x-2 pt-1 border-t border-white/10">
                      <button
                        onClick={() => handleResolveDispute(d.id, true)}
                        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/25 transition-all"
                      >
                        Refund Escrow &amp; Resolve
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.id, false)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Dismiss / Resolve
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
