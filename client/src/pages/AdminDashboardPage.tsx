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
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catTags, setCatTags] = useState('');
  const [addingCat, setAddingCat] = useState(false);

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
      alert('Skill category added!');
    } catch (e) {
      console.error(e);
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
      alert(refund ? 'Dispute resolved and credit refunded!' : 'Dispute resolved.');
    } catch (e) {
      console.error(e);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <Shield size={36} className="mx-auto text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Admin Clearance Required</h2>
        <p className="text-xs text-slate-500 mt-1">
          Use the persona switcher in the top bar to switch to <strong>SwapSkill Admin</strong> (admin@swapskill.com).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Admin & Safety Center</h1>
          <p className="text-xs text-slate-500">Manage skill taxonomies, track barter metrics, and resolve peer disputes.</p>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Total Peers</span>
              <Users size={16} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-2">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Completed Sessions</span>
              <Calendar size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-600 font-mono mt-2">{stats.completedSessions}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Escrow Credits Active</span>
              <Coins size={16} className="text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-amber-600 font-mono mt-2">{stats.lockedEscrowSessions}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>Open Safety Disputes</span>
              <AlertTriangle size={16} className="text-rose-500" />
            </div>
            <p className="text-2xl font-extrabold text-rose-600 font-mono mt-2">{stats.openDisputes}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Skill Categories Management */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Skill Categories</h3>
              <p className="text-xs text-slate-500">Configure canonical taxonomies for peer searches.</p>
            </div>
            <Tag size={18} className="text-indigo-600" />
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleCreateCategory} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Add New Category</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. AI & Prompting)"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Popular Tags (comma separated)"
                value={catTags}
                onChange={(e) => setCatTags(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              />
            </div>
            <input
              type="text"
              placeholder="Short description..."
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={addingCat}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
              >
                {addingCat ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {categories.map((c) => (
              <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.name}</span>
                </div>
                {c.description && <p className="text-[11px] text-slate-500 mt-0.5">{c.description}</p>}
                {c.popularTags && (
                  <p className="text-[10px] text-indigo-600 font-mono mt-1">Tags: {c.popularTags}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dispute Resolution Center */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Safety & Dispute Resolution</h3>
              <p className="text-xs text-slate-500">Handle reported sessions and refund escrow if required.</p>
            </div>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>

          {disputes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No active dispute reports at this time. All exchanges running smoothly!
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {disputes.map((d) => (
                <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Reporter: {d.reporter?.name} vs {d.reportedUser?.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        d.status === 'OPEN' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                    "{d.reason}"
                  </p>

                  {d.session && (
                    <p className="text-[11px] text-slate-500">
                      Session: {d.session.skillName} (Escrow Locked:{' '}
                      {d.session.escrowCreditLocked ? 'Yes' : 'No'})
                    </p>
                  )}

                  {d.status === 'OPEN' && (
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={() => handleResolveDispute(d.id, true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Refund Escrow & Resolve
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.id, false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
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
