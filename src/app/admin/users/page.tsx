'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

type Role = 'customer' | 'admin' | 'vendor';

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  points: number;
  role: Role;
  created_at: string;
}

interface EditForm {
  full_name: string;
  phone: string;
  role: Role;
}

const ROLE_COLOR: Record<Role, string> = {
  customer: 'bg-gray-100 text-gray-500',
  admin:    'bg-[#42deef]/10 text-[#42deef]',
  vendor:   'bg-purple-50 text-purple-600',
};

const ROLE_ICON: Record<Role, string> = {
  customer: '👤',
  admin:    '🛡️',
  vendor:   '🏪',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<Role | 'all'>('all');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ full_name: '', phone: '', role: 'customer' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('profiles')
      .select('id, full_name, phone, points, role, created_at')
      .order('created_at', { ascending: false });
    if (filterRole !== 'all') query = query.eq('role', filterRole);
    const { data } = await query;
    setUsers(data ?? []);
    setLoading(false);
  }, [filterRole]);

  useEffect(() => { load(); }, [load]);

  function openEdit(user: UserProfile) {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name ?? '',
      phone: user.phone ?? '',
      role: user.role,
    });
  }

  async function saveProfile() {
    if (!editingUser) return;
    setSaving(true);
    await createClient().from('profiles').update({
      full_name: editForm.full_name.trim() || null,
      phone: editForm.phone.trim() || null,
      role: editForm.role,
    }).eq('id', editingUser.id);
    setUsers(prev => prev.map(u => u.id === editingUser.id
      ? { ...u, full_name: editForm.full_name.trim() || null, phone: editForm.phone.trim() || null, role: editForm.role }
      : u
    ));
    setSaving(false);
    setEditingUser(null);
  }

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.full_name?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q);
  });

  const stats = {
    total: users.length,
    customers: users.filter(u => u.role === 'customer').length,
    admins: users.filter(u => u.role === 'admin').length,
    vendors: users.filter(u => u.role === 'vendor').length,
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',     value: stats.total,     color: 'text-gray-800',    bg: 'bg-gray-100' },
          { label: 'Customers', value: stats.customers, color: 'text-gray-600',    bg: 'bg-gray-50' },
          { label: 'Admins',    value: stats.admins,    color: 'text-[#42deef]',   bg: 'bg-[#42deef]/10' },
          { label: 'Vendors',   value: stats.vendors,   color: 'text-purple-600',  bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
            <div className={`text-2xl font-bold mb-0.5 ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full bg-white border border-gray-200 text-gray-800 text-[12px] pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#42deef] placeholder-gray-300 shadow-sm transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {(['all', 'customer', 'admin', 'vendor'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 text-[11px] font-semibold capitalize rounded-md transition-all ${
                filterRole === r ? 'bg-[#42deef] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* User cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse h-28" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-300 text-sm shadow-sm border border-gray-100">
          No users found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((user) => (
            <div key={user.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">

              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#42deef]/10 flex items-center justify-center text-[#42deef] text-base font-bold shrink-0">
                    {(user.full_name ?? '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-800 text-[13px] font-semibold leading-tight">{user.full_name ?? <span className="text-gray-300 italic">No name</span>}</p>
                    <p className="text-gray-400 text-[11px] mt-0.5">{user.phone ?? <span className="text-gray-300">No phone</span>}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${ROLE_COLOR[user.role]}`}>
                  {ROLE_ICON[user.role]} {user.role}
                </span>
              </div>

              {/* Info row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">Points</p>
                    <p className="text-[13px] font-bold text-[#42deef]">{user.points.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wide font-semibold">Joined</p>
                    <p className="text-[12px] text-gray-500">{new Date(user.created_at).toLocaleDateString('en-MY')}</p>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(user)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-gray-500 bg-gray-50 rounded-lg hover:bg-[#42deef] hover:text-white transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#42deef]/10 flex items-center justify-center text-[#42deef] font-bold">
                  {(editingUser.full_name ?? '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-800">Edit Profile</p>
                  <p className="text-[10px] text-gray-400 font-mono">{editingUser.id.slice(0, 16)}...</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-gray-300 hover:text-gray-600 text-xl leading-none transition-colors">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Full name */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Full Name</label>
                <input
                  value={editForm.full_name}
                  onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Customer full name"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-[13px] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#42deef] focus:bg-white placeholder-gray-300 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Phone Number</label>
                <input
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+60 12-345 6789"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-[13px] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#42deef] focus:bg-white placeholder-gray-300 transition-all"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'admin', 'vendor'] as Role[]).map(r => (
                    <button
                      key={r}
                      onClick={() => setEditForm(f => ({ ...f, role: r }))}
                      className={`py-2.5 text-[11px] font-semibold capitalize rounded-lg border transition-all ${
                        editForm.role === r
                          ? r === 'admin'
                            ? 'bg-[#42deef] text-white border-[#42deef]'
                            : r === 'vendor'
                              ? 'bg-purple-500 text-white border-purple-500'
                              : 'bg-gray-800 text-white border-gray-800'
                          : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
                      }`}
                    >
                      {ROLE_ICON[r]} {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Points (read only) */}
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Points Balance</p>
                  <p className="text-[15px] font-bold text-[#42deef]">{editingUser.points.toLocaleString()} pts</p>
                </div>
                <p className="text-[10px] text-gray-300">Read only</p>
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 text-[12px] font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-[#42deef] rounded-lg hover:bg-[#0bb8d4] transition-colors disabled:opacity-40 shadow-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
