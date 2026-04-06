'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

interface Order {
  id: string;
  status: OrderStatus;
  type: 'merchandise' | 'topup';
  total: number;
  points_earned: number;
  game_user_id: string | null;
  notes: string | null;
  created_at: string;
  profiles: { username: string | null; full_name: string | null; } | null;
  order_items: {
    id: string;
    quantity: number;
    unit_price: number;
    size: string | null;
    products: { name: string; image: string | null } | null;
    game_packages: { amount: string } | null;
    games: { name: string; short_name: string } | null;
  }[];
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending:    'bg-amber-50 text-amber-600 border border-amber-200',
  processing: 'bg-blue-50 text-blue-600 border border-blue-200',
  completed:  'bg-emerald-50 text-emerald-600 border border-emerald-200',
  failed:     'bg-red-50 text-red-600 border border-red-200',
  refunded:   'bg-gray-100 text-gray-500 border border-gray-200',
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'completed', 'failed', 'refunded'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'merchandise' | 'topup'>('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('orders')
      .select(`
        id, status, type, total, points_earned, game_user_id, notes, created_at,
        profiles ( username, full_name ),
        order_items (
          id, quantity, unit_price, size,
          products ( name, image ),
          game_packages ( amount ),
          games ( name, short_name )
        )
      `)
      .order('created_at', { ascending: false });

    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (filterType   !== 'all') query = query.eq('type',   filterType);

    const { data, error } = await query;
    if (error) console.error(error);
    setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  }, [filterStatus, filterType]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    await createClient().from('orders').update({ status }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setUpdating(null);
  };

  const filtered = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.profiles?.full_name?.toLowerCase().includes(q) ||
      o.profiles?.username?.toLowerCase().includes(q) ||
      o.game_user_id?.toLowerCase().includes(q)
    );
  });

  // Stats
  const total     = orders.length;
  const pending   = orders.filter(o => o.status === 'pending').length;
  const revenue   = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
  const merch     = orders.filter(o => o.type === 'merchandise').length;
  const topup     = orders.filter(o => o.type === 'topup').length;

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 transition-all shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: total,              color: 'text-[#42deef]', bg: 'bg-[#42deef]/10' },
          { label: 'Pending',      value: pending,            color: 'text-amber-500',  bg: 'bg-amber-50' },
          { label: 'Revenue (RM)', value: revenue.toFixed(2), color: 'text-emerald-500',bg: 'bg-emerald-50' },
          { label: 'Merchandise',  value: merch,              color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Top Up',       value: topup,              color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
            <div className={`text-xl font-bold mb-0.5 ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search order ID, customer, game user ID..."
          className="flex-1 min-w-56 bg-white border border-gray-200 text-gray-800 text-[12px] px-4 py-2 rounded-lg focus:outline-none focus:border-[#42deef] placeholder-gray-300 shadow-sm transition-colors"
        />
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {(['all', ...ALL_STATUSES] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-md transition-all ${
                filterStatus === s ? 'bg-[#42deef] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {(['all', 'merchandise', 'topup'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-md transition-all ${
                filterType === t ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <p className="text-gray-400 text-[11px] font-medium mb-3">
        Showing {filtered.length} of {orders.length} orders
      </p>

      {/* Orders list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-300 text-sm">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-300 text-sm">No orders found</div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="border-b border-gray-100 last:border-0">

              {/* Row */}
              <div
                className="grid items-center px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors gap-4"
                style={{ gridTemplateColumns: '1fr 140px 90px 120px 90px 20px' }}
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[#42deef] text-[12px] font-bold font-mono">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      order.type === 'merchandise'
                        ? 'bg-purple-50 text-purple-500'
                        : 'bg-orange-50 text-orange-500'
                    }`}>
                      {order.type === 'merchandise' ? 'Merch' : 'Top Up'}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    {order.profiles?.full_name ?? order.profiles?.username ?? 'Guest'}
                    {order.game_user_id && <span className="ml-2 text-gray-300">· {order.game_user_id}</span>}
                  </div>
                </div>
                <div className="text-gray-400 text-[11px]">
                  {new Date(order.created_at).toLocaleString('en-MY', { dateStyle: 'short', timeStyle: 'short' })}
                </div>
                <div className="font-bold text-gray-800 text-[13px]">RM {order.total.toFixed(2)}</div>
                <div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-[#42deef] text-[11px] font-semibold">+{order.points_earned} pts</div>
                <div className="text-gray-300 text-xs">{expanded === order.id ? '▲' : '▼'}</div>
              </div>

              {/* Expanded */}
              {expanded === order.id && (
                <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8 pt-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Order Items</p>
                      <div className="space-y-2.5">
                        {order.order_items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#42deef] shrink-0" />
                              <span className="text-gray-600 truncate">
                                {item.products?.name
                                  ?? (item.games?.short_name && item.game_packages?.amount
                                    ? `${item.games.short_name} — ${item.game_packages.amount}`
                                    : 'Item')}
                                {item.size ? ` (${item.size})` : ''}
                                {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                              </span>
                            </div>
                            <span className="text-gray-800 font-bold shrink-0">RM {(item.unit_price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      {order.notes && (
                        <p className="text-[11px] text-gray-400 mt-4 pt-4 border-t border-gray-200">
                          <span className="font-semibold text-gray-500">Notes:</span> {order.notes}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            disabled={order.status === s || updating === order.id}
                            onClick={() => updateStatus(order.id, s)}
                            className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-lg border transition-all disabled:cursor-not-allowed ${
                              order.status === s
                                ? `${STATUS_COLOR[s]} border-transparent`
                                : 'border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30'
                            }`}
                          >
                            {updating === order.id && order.status !== s ? '...' : s}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <p className="text-gray-400 font-semibold uppercase tracking-wide text-[9px] mb-0.5">Order ID</p>
                          <p className="text-gray-500 font-mono text-[10px] break-all">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold uppercase tracking-wide text-[9px] mb-0.5">Points Issued</p>
                          <p className="text-[#42deef] font-bold">+{order.points_earned} pts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
