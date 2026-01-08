// tavern-frontend/src/pages/NPCSpendingDashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

type SpendingData = {
  totalSpent: number;
  pendingPayments: number;
  activeQuestsCost: number;
  completedQuests: number;
  monthlySpending: Array<{ month: string; amount: number }>;
  recentTransactions: Array<{
    id: string;
    quest: string;
    amount: number;
    status: string;
    date: string;
  }>;
};

export default function NPCSpendingDashboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState<SpendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) loadSpendingData();
  }, [token]);

  const loadSpendingData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    
    try {
      // Fetch actual quests data
      const res = await api.get<{ success: boolean; data: any[] }>(
        '/quests/mine',
        token
      );
      
      const quests = res.data || [];
      
      // Calculate spending metrics
      const totalSpent = quests
        .filter(q => q.status === 'Paid')
        .reduce((sum, q) => sum + (q.paidGold || 0), 0);
      
      const pendingPayments = quests
        .filter(q => q.status === 'Completed')
        .reduce((sum, q) => sum + (q.rewardGold || 0), 0);
      
      const activeQuestsCost = quests
        .filter(q => q.status === 'Accepted')
        .reduce((sum, q) => sum + (q.rewardGold || 0), 0);
      
      const completedQuests = quests.filter(q => q.status === 'Paid').length;
      
      // Calculate monthly spending (last 3 months)
      const now = new Date();
      const monthlySpending = [];
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthTotal = quests
          .filter(q => {
            if (!q.paidAt) return false;
            const paidDate = new Date(q.paidAt);
            return paidDate >= monthStart && paidDate <= monthEnd;
          })
          .reduce((sum, q) => sum + (q.paidGold || 0), 0);
        
        monthlySpending.push({ month: monthName, amount: monthTotal });
      }
      
      // Recent transactions
      const recentTransactions = quests
        .filter(q => q.status === 'Paid' || q.status === 'Completed')
        .sort((a, b) => {
          const dateA = new Date(a.paidAt || a.updatedAt).getTime();
          const dateB = new Date(b.paidAt || b.updatedAt).getTime();
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(q => ({
          id: q._id,
          quest: q.title,
          amount: q.paidGold || q.rewardGold || 0,
          status: q.status === 'Paid' ? 'Paid' : 'Pending',
          date: q.paidAt || q.updatedAt
        }));
      
      setData({
        totalSpent,
        pendingPayments,
        activeQuestsCost,
        completedQuests,
        monthlySpending,
        recentTransactions
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load spending data');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'NPC') {
    return <div className="min-h-screen bg-slate-900 text-slate-100 p-8">Access denied. NPC only.</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 p-8">
        <p className="text-slate-400">Loading spending data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100 p-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide flex items-center gap-2">
              💰 Quest Spending Dashboard
            </h1>
            <p className="text-sm text-slate-300">Track your quest expenses and payments</p>
          </div>
          <Link
            to="/"
            className="text-xs md:text-sm px-3 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50"
          >
            ← Back to Dashboard
          </Link>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-purple-500/40 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400 mb-1">Total Spent</div>
            <div className="text-3xl font-bold text-purple-300">{data.totalSpent} 🪙</div>
            <div className="text-xs text-slate-500 mt-1">All time</div>
          </div>

          <div className="rounded-2xl border border-yellow-500/40 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400 mb-1">Pending Payments</div>
            <div className="text-3xl font-bold text-yellow-300">{data.pendingPayments} 🪙</div>
            <div className="text-xs text-slate-500 mt-1">Awaiting approval</div>
          </div>

          <div className="rounded-2xl border border-blue-500/40 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400 mb-1">Active Quests Cost</div>
            <div className="text-3xl font-bold text-blue-300">{data.activeQuestsCost} 🪙</div>
            <div className="text-xs text-slate-500 mt-1">In progress</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/70 p-5">
            <div className="text-sm text-slate-400 mb-1">Completed Quests</div>
            <div className="text-3xl font-bold text-emerald-300">{data.completedQuests}</div>
            <div className="text-xs text-slate-500 mt-1">Successfully paid</div>
          </div>
        </div>

        {/* Monthly Spending Chart */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Monthly Spending Trend</h2>
          <div className="flex items-end justify-between gap-4 h-48">
            {data.monthlySpending.map((item, idx) => {
              const maxAmount = Math.max(...data.monthlySpending.map(m => m.amount), 1);
              const heightPercent = (item.amount / maxAmount) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-semibold text-purple-300">{item.amount} 🪙</div>
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:from-purple-500 hover:to-purple-300"
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                  />
                  <div className="text-xs text-slate-400 font-medium">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">📜 Recent Transactions</h2>
          </div>
          {data.recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No transactions yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Quest</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300">Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 text-sm text-slate-200">{tx.quest}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-amber-400">
                        {tx.amount} 🪙
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'Paid' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/60'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/npc/completions"
            className="rounded-xl border border-emerald-500/40 bg-slate-950/70 px-6 py-4 hover:bg-emerald-500/10 transition-colors"
          >
            <div className="font-semibold text-lg mb-1">✅ Review & Pay</div>
            <div className="text-xs text-slate-300">Process pending quest completions</div>
          </Link>

          <Link
            to="/npc/quests"
            className="rounded-xl border border-purple-500/40 bg-slate-950/70 px-6 py-4 hover:bg-purple-500/10 transition-colors"
          >
            <div className="font-semibold text-lg mb-1">📜 Manage Quests</div>
            <div className="text-xs text-slate-300">View and edit your posted quests</div>
          </Link>

          <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-6 py-4 opacity-70">
            <div className="font-semibold text-lg mb-1">📊 Export Report</div>
            <div className="text-xs text-slate-400">Download spending summary (Coming soon)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
