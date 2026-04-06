'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [deleting, setDeleting]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await createClient()
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    setSubscribers((data ?? []) as Subscriber[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    setDeleting(id);
    await createClient().from('subscribers').delete().eq('id', id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  };

  const filtered = subscribers.filter(s =>
    !search || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 transition-all shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6 max-w-xs">
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-[#42deef] mb-0.5">{subscribers.length}</div>
          <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Total Subscribers</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="w-full bg-white border border-gray-200 text-gray-800 text-[12px] pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#42deef] placeholder-gray-300 shadow-sm transition-colors"
        />
      </div>

      <p className="text-gray-400 text-[11px] font-medium mb-3">
        Showing {filtered.length} of {subscribers.length} subscribers
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-56" />
                <div className="h-3 bg-gray-50 rounded w-28 ml-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-300 text-sm">No subscribers found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(sub => (
              <div key={sub.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#42deef]/10 flex items-center justify-center text-[#42deef] text-xs font-bold shrink-0">
                  {sub.email[0].toUpperCase()}
                </div>
                <p className="flex-1 text-gray-800 text-[13px] font-medium">{sub.email}</p>
                <p className="text-gray-400 text-[11px] shrink-0">
                  {new Date(sub.subscribed_at).toLocaleDateString('en-MY')}
                </p>
                <button
                  onClick={() => remove(sub.id)}
                  disabled={deleting === sub.id}
                  className="shrink-0 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-40"
                  title="Remove subscriber"
                >
                  {deleting === sub.id ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeDasharray="50" strokeDashoffset="25"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
