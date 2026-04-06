'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

interface RecentOrder {
  id: string;
  status: string;
  type: string;
  total: number;
  created_at: string;
  profiles: { username: string | null; full_name: string | null } | null;
}

const STATUS_STYLE: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-600 border border-amber-200',
  processing: 'bg-blue-50 text-blue-600 border border-blue-200',
  completed:  'bg-emerald-50 text-emerald-600 border border-emerald-200',
  failed:     'bg-red-50 text-red-600 border border-red-200',
  refunded:   'bg-gray-100 text-gray-500 border border-gray-200',
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [ordersRes, usersRes, recentRes] = await Promise.all([
        supabase.from('orders').select('status, total'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('id, status, type, total, created_at, profiles(username, full_name)')
          .order('created_at', { ascending: false })
          .limit(8),
      ]);

      const orders = ordersRes.data ?? [];
      setStats({
        totalOrders:   orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        totalRevenue:  orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0),
        totalUsers:    usersRes.count ?? 0,
      });
      setRecentOrders((recentRes.data ?? []) as RecentOrder[]);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
      color: 'text-[#42deef]',
      bg: 'bg-[#42deef]/10',
    },
    {
      label: 'Pending',
      value: stats?.pendingOrders ?? 0,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Revenue (RM)',
      value: `${(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
                <div className="h-8 w-16 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            ))
          : statCards.map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2 rounded-lg ${s.bg} ${s.color}`}>{s.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{s.value}</div>
                <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))
        }
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-[13px] font-bold text-gray-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[11px] font-semibold text-[#42deef] hover:text-[#0bb8d4] transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-gray-300 text-sm text-center">Loading...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-gray-300 text-sm text-center">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Order ID', 'Customer', 'Type', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 text-[12px] font-bold text-[#42deef]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-[12px] text-gray-700">
                      {order.profiles?.full_name ?? order.profiles?.username ?? 'Guest'}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[12px] font-bold text-gray-800">
                      RM {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[11px] text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-MY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
