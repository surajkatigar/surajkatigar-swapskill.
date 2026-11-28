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
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <div className="max-w-md mx-auto py-24 px-4 text-center text-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/30">
          <Shield size={26} />
        </div>
        <h2 className="text-xl font-bold text-white">Admin Clearance Required</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Switch to the <strong>SwapSkill Admin</strong> persona in the top right menu to access platform operations.
        </p>
      </div>
    );
  }

  const ADMIN_STATS = stats ? [
    { label: "Total Registered Peers", value: stats.totalUsers, hint: "Active platform participants", icon: Users },
    { label: "Completed Barters", value: stats.completedSwaps, hint: "Verified skill sessions", icon: Calendar },
    { label: "Circulating Tokens", value: `${stats.totalCreditsInCirculation}c`, hint: "Escrow & peer wallets", icon: Coins },
    { label: "Pending Disputes", value: stats.pendingDisputes, hint: stats.pendingDisputes > 0 ? "Requires review" : "Clear queue", icon: AlertTriangle },
  ] : [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full text-slate-100">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border backdrop-blur-xl animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* KPI Cards in App1 Style */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ADMIN_STATS.map((stat) => (
            <Card key={stat.label} className="bg-card/75 border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {stat.label}
                </CardTitle>
                <stat.icon
                  aria-hidden
                  className={`h-5 w-5 ${stat.label.includes('Disputes') && stats.pendingDisputes > 0 ? 'text-rose-400' : 'text-indigo-400'}`}
                />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Dispute Resolution Queue */}
        <Card className="bg-card/75 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white">Dispute Resolution Queue</CardTitle>
                <CardDescription>
                  Review contested skill exchanges &amp; escrow reversals
                </CardDescription>
              </div>
              <Badge variant={disputes.length > 0 ? "destructive" : "secondary"}>
                {disputes.length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {disputes.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
                <p className="text-sm font-medium text-slate-300">No disputes pending adjudication</p>
                <p className="text-xs text-slate-400 mt-1">All barter exchanges are running smoothly!</p>
              </div>
            ) : (
              disputes.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                        <AlertTriangle size={13} /> Reason: {d.reason}
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        Reported by: <span className="font-medium text-white">{d.reporter?.name}</span>
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-amber-300 border-amber-500/40">
                      Escrow Held
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleResolveDispute(d.id, true)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8"
                    >
                      <CheckCircle size={13} className="mr-1.5" /> Refund Escrow Credit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolveDispute(d.id, false)}
                      className="text-xs h-8 text-slate-300 hover:text-white"
                    >
                      <XCircle size={13} className="mr-1.5" /> Dismiss &amp; Mark Resolved
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Skill Category Management */}
        <Card className="bg-card/75 border-border">
          <CardHeader>
            <CardTitle className="text-lg text-white">Skill Taxonomies</CardTitle>
            <CardDescription>
              Platform skill categories &amp; barter verticals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateCategory} className="space-y-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                <FolderPlus size={14} className="text-indigo-400" /> Add New Category
              </div>
              <div className="grid gap-2">
                <Input
                  placeholder="Category Name (e.g. AI & Concurrency)"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="bg-white/5 border-white/10 text-xs h-9"
                />
                <Input
                  placeholder="Description..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="bg-white/5 border-white/10 text-xs h-9"
                />
                <Input
                  placeholder="Tags (comma-separated, e.g. PyTorch, Rust, LangChain)"
                  value={catTags}
                  onChange={(e) => setCatTags(e.target.value)}
                  className="bg-white/5 border-white/10 text-xs h-9"
                />
              </div>
              <Button
                type="submit"
                disabled={addingCat || !catName}
                size="sm"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8"
              >
                {addingCat ? 'Creating...' : 'Save Category'}
              </Button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{c.description}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-full">
                    {c._count?.skills || 0} skills
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
