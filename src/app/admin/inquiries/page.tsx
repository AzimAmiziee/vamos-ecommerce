'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

type InquiryType   = 'contact' | 'partnership';
type InquiryStatus = 'new' | 'read' | 'replied';

interface Inquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  company: string | null;
  subject: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

const TYPE_COLOR: Record<InquiryType, string> = {
  contact:     'bg-blue-50 text-blue-600',
  partnership: 'bg-purple-50 text-purple-600',
};

const STATUS_COLOR: Record<InquiryStatus, string> = {
  new:     'bg-amber-50 text-amber-600 border border-amber-200',
  read:    'bg-gray-100 text-gray-500 border border-gray-200',
  replied: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
};

const ALL_STATUSES: InquiryStatus[] = ['new', 'read', 'replied'];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filterType, setFilterType]     = useState<InquiryType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all');
  const [search, setSearch]       = useState('');
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [updating, setUpdating]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (filterType   !== 'all') query = query.eq('type',   filterType);
    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    const { data } = await query;
    setInquiries((data ?? []) as Inquiry[]);
    setLoading(false);
  }, [filterType, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: InquiryStatus) => {
    setUpdating(id);
    await createClient().from('contact_inquiries').update({ status }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setUpdating(null);
  };

  const filtered = inquiries.filter(i => {
    if (!search) return true;
    const q = search.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.subject?.toLowerCase().includes(q);
  });

  const stats = {
    total:       inquiries.length,
    newCount:    inquiries.filter(i => i.status === 'new').length,
    contact:     inquiries.filter(i => i.type === 'contact').length,
    partnership: inquiries.filter(i => i.type === 'partnership').length,
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 transition-all shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',       value: stats.total,       color: 'text-gray-800',   bg: 'bg-gray-100' },
          { label: 'New',         value: stats.newCount,    color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Contact',     value: stats.contact,     color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Partnership', value: stats.partnership, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
            <div className={`text-2xl font-bold mb-0.5 ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 relative min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full bg-white border border-gray-200 text-gray-800 text-[12px] pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-[#42deef] placeholder-gray-300 shadow-sm transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {(['all', 'contact', 'partnership'] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-[11px] font-semibold capitalize rounded-md transition-all ${
                filterType === t ? 'bg-[#42deef] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {(['all', ...ALL_STATUSES] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-[11px] font-semibold capitalize rounded-md transition-all ${
                filterStatus === s ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-gray-400 text-[11px] font-medium mb-3">
        Showing {filtered.length} of {inquiries.length} inquiries
      </p>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-300 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-300 text-sm">No inquiries found</div>
        ) : (
          filtered.map(inquiry => (
            <div key={inquiry.id} className="border-b border-gray-100 last:border-0">

              {/* Row */}
              <div
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setExpanded(expanded === inquiry.id ? null : inquiry.id);
                  if (expanded !== inquiry.id && inquiry.status === 'new') {
                    updateStatus(inquiry.id, 'read');
                  }
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {inquiry.status === 'new' && (
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                    <span className="text-gray-800 text-[13px] font-semibold truncate">{inquiry.name}</span>
                    <span className={`text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${TYPE_COLOR[inquiry.type]}`}>
                      {inquiry.type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] truncate">
                    {inquiry.email}
                    {inquiry.subject && <span className="ml-2 text-gray-300">· {inquiry.subject}</span>}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_COLOR[inquiry.status]}`}>
                    {inquiry.status}
                  </span>
                  <p className="text-gray-300 text-[10px] mt-1">
                    {new Date(inquiry.created_at).toLocaleDateString('en-MY')}
                  </p>
                </div>
                <div className="text-gray-300 text-xs shrink-0">{expanded === inquiry.id ? '▲' : '▼'}</div>
              </div>

              {/* Expanded */}
              {expanded === inquiry.id && (
                <div className="px-6 pb-6 pt-3 bg-gray-50 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Message</p>
                      {inquiry.company && (
                        <p className="text-[11px] text-gray-500 mb-2">
                          <span className="font-semibold text-gray-600">Company:</span> {inquiry.company}
                        </p>
                      )}
                      <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject ?? 'Your inquiry'}`}
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#42deef] text-white text-[11px] font-semibold rounded-lg hover:bg-[#0bb8d4] transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Reply via Email
                      </a>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Update Status</p>
                      <div className="flex gap-2">
                        {ALL_STATUSES.map(s => (
                          <button
                            key={s}
                            disabled={inquiry.status === s || updating === inquiry.id}
                            onClick={() => updateStatus(inquiry.id, s)}
                            className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-lg border transition-all disabled:cursor-not-allowed ${
                              inquiry.status === s
                                ? `${STATUS_COLOR[s]} border-transparent`
                                : 'border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 disabled:opacity-30'
                            }`}
                          >
                            {updating === inquiry.id && inquiry.status !== s ? '...' : s}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 text-[11px] space-y-1">
                        <p className="text-gray-400"><span className="font-semibold text-gray-600">ID:</span> <span className="font-mono">{inquiry.id.slice(0, 16)}...</span></p>
                        <p className="text-gray-400"><span className="font-semibold text-gray-600">Submitted:</span> {new Date(inquiry.created_at).toLocaleString('en-MY')}</p>
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
