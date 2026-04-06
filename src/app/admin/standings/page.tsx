'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Standing {
  id: string;
  season: string;
  week: number | null;
  rank: number;
  team: string;
  match_wins: number;
  match_losses: number;
  game_wins: number;
  game_losses: number;
  points: number;
  is_vamos: boolean;
}

type EditRow = Omit<Standing, 'id'>;

const EMPTY_ROW: EditRow = {
  season: 'MPL MY S17',
  week: 1,
  rank: 1,
  team: '',
  match_wins: 0,
  match_losses: 0,
  game_wins: 0,
  game_losses: 0,
  points: 0,
  is_vamos: false,
};

export default function AdminStandingsPage() {
  const [standings, setStandings]       = useState<Standing[]>([]);
  const [loading, setLoading]           = useState(true);
  const [season, setSeason]             = useState('MPL MY S17');
  const [saving, setSaving]             = useState<string | null>(null);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editForm, setEditForm]         = useState<Standing | null>(null);
  const [addOpen, setAddOpen]           = useState(false);
  const [addForm, setAddForm]           = useState<EditRow>(EMPTY_ROW);
  const [adding, setAdding]             = useState(false);
  const [weekInput, setWeekInput]       = useState<string>('');
  const [updatingWeek, setUpdatingWeek] = useState(false);
  const [savingOrder, setSavingOrder]   = useState(false);
  const [allSeasons, setAllSeasons]     = useState<string[]>(['MPL MY S17']);
  const [creatingNew, setCreatingNew]   = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ title: string; body: string; onOk: () => void } | null>(null);
  const [activeSeason, setActiveSeason] = useState<string>('');
  const [settingActive, setSettingActive] = useState(false);

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  // Load distinct seasons + current active season
  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from('standings').select('season'),
      supabase.from('settings').select('value').eq('key', 'active_season').single(),
    ]).then(([standingsRes, settingsRes]) => {
      if (standingsRes.data) {
        const seasons = ([...new Set((standingsRes.data as { season: string }[]).map(r => r.season))] as string[])
          .sort((a, b) => parseInt(b.replace(/\D/g, '')) - parseInt(a.replace(/\D/g, '')));
        if (seasons.length > 0) setAllSeasons(seasons);
      }
      if (settingsRes.data) {
        setActiveSeason((settingsRes.data as { value: string }).value);
      }
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await createClient()
      .from('standings')
      .select('*')
      .eq('season', season)
      .order('rank', { ascending: true });
    const rows = (data ?? []) as Standing[];
    setStandings(rows);
    if (rows.length > 0) setWeekInput(String(rows[0].week ?? ''));
    setLoading(false);
  }, [season]);

  useEffect(() => { load(); }, [load]);

  /* ── New Season ── */
  function createNewSeason() {
    const nums = allSeasons.map(s => parseInt(s.replace(/\D/g, ''))).filter(Boolean);
    const next = nums.length > 0 ? Math.max(...nums) + 1 : 18;
    const newSeason = `MPL MY S${next}`;

    setConfirmModal({
      title: `Start ${newSeason}?`,
      body: 'Team Vamos will be added automatically at rank 1. You can then add the other teams.',
      onOk: async () => {
        setConfirmModal(null);
        setCreatingNew(true);
        const { data } = await createClient().from('standings').insert({
          season:       newSeason,
          week:         1,
          rank:         1,
          team:         'Team Vamos',
          match_wins:   0,
          match_losses: 0,
          game_wins:    0,
          game_losses:  0,
          points:       0,
          is_vamos:     true,
        }).select().single();
        if (data) {
          setAllSeasons(prev => [newSeason, ...prev]);
          setSeason(newSeason);
          setStandings([data as Standing]);
          setWeekInput('1');
        }
        setCreatingNew(false);
      },
    });
  }

  /* ── Drag & drop ── */
  function onDragStart(index: number) { dragIndex.current = index; }
  function onDragEnter(index: number) { setDragOver(index); }

  function onDragEnd() {
    setDragOver(null);
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || dragOver === null || from === dragOver) return;
    const reordered = [...standings];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(dragOver, 0, moved);
    const updated = reordered.map((s, i) => ({ ...s, rank: i + 1 }));
    setStandings(updated);
    persistOrder(updated);
  }

  async function persistOrder(rows: Standing[]) {
    setSavingOrder(true);
    const supabase = createClient();
    await Promise.all(rows.map(r => supabase.from('standings').update({ rank: r.rank }).eq('id', r.id)));
    setSavingOrder(false);
  }

  /* ── Inline edit ── */
  function openEdit(s: Standing) {
    setEditingId(s.id);
    setEditForm({ ...s });
  }

  async function saveEdit() {
    if (!editForm) return;
    setSaving(editForm.id);
    await createClient().from('standings').update({
      team:         editForm.team,
      match_wins:   editForm.match_wins,
      match_losses: editForm.match_losses,
      game_wins:    editForm.game_wins,
      game_losses:  editForm.game_losses,
      points:       editForm.points,
    }).eq('id', editForm.id);
    setStandings(prev => prev.map(s => s.id === editForm.id ? { ...editForm } : s));
    setSaving(null);
    setEditingId(null);
  }

  /* ── Delete ── */
  function deleteRow(id: string) {
    setConfirmModal({
      title: 'Delete team?',
      body: 'This will remove the team from standings. This cannot be undone.',
      onOk: async () => {
        setConfirmModal(null);
        setSaving(id);
        await createClient().from('standings').delete().eq('id', id);
        setStandings(prev => {
          const renumbered = prev.filter(s => s.id !== id).map((s, i) => ({ ...s, rank: i + 1 }));
          persistOrder(renumbered);
          return renumbered;
        });
        setSaving(null);
      },
    });
  }

  /* ── Add team ── */
  async function addTeam() {
    if (!addForm.team.trim()) return;
    setAdding(true);
    const { data } = await createClient().from('standings').insert({
      ...addForm,
      season,
      rank: standings.length + 1,
      team: addForm.team.trim(),
    }).select().single();
    if (data) setStandings(prev => [...prev, data as Standing]);
    setAdding(false);
    setAddOpen(false);
    setAddForm({ ...EMPTY_ROW, season });
  }

  /* ── Update week ── */
  async function updateWeek() {
    const w = parseInt(weekInput);
    if (isNaN(w) || w < 1) return;
    setUpdatingWeek(true);
    await createClient().from('standings').update({ week: w }).eq('season', season);
    setStandings(prev => prev.map(s => ({ ...s, week: w })));
    setUpdatingWeek(false);
  }

  /* ── Set active season ── */
  async function setAsActive() {
    setSettingActive(true);
    await createClient().from('settings').update({ value: season }).eq('key', 'active_season');
    setActiveSeason(season);
    setSettingActive(false);
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Standings</h1>
        </div>
        <div className="flex items-center gap-3">
          {savingOrder && (
            <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeDasharray="50" strokeDashoffset="25"/></svg>
              Saving order...
            </span>
          )}
          <select
            value={season}
            onChange={e => setSeason(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-[12px] px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-[#42deef]"
          >
            {allSeasons.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={setAsActive}
            disabled={settingActive || activeSeason === season}
            className={`flex items-center gap-2 text-[12px] font-semibold px-4 py-2 rounded-lg transition-all shadow-sm disabled:opacity-40 ${
              activeSeason === season
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            {activeSeason === season ? 'Active Season' : settingActive ? 'Setting...' : 'Set as Active'}
          </button>
          <button
            onClick={createNewSeason}
            disabled={creatingNew}
            className="flex items-center gap-2 text-[12px] font-semibold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            {creatingNew ? 'Creating...' : 'New Season'}
          </button>
          <button
            onClick={() => { setAddOpen(true); setAddForm({ ...EMPTY_ROW, season }); }}
            className="flex items-center gap-2 text-[12px] font-semibold text-white bg-[#42deef] px-4 py-2 rounded-lg hover:bg-[#0bb8d4] transition-all shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Team
          </button>
        </div>
      </div>

      {/* Week updater */}
      <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 mb-4 flex items-center gap-4">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Current Week</p>
          <p className="text-[11px] text-gray-400">Updates the "Updated after Week X" label on /standings</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input
            type="number" min={1}
            value={weekInput}
            onChange={e => setWeekInput(e.target.value)}
            className="w-16 text-center bg-gray-50 border border-gray-200 text-gray-800 text-[14px] font-bold px-2 py-2 rounded-lg focus:outline-none focus:border-[#42deef]"
            placeholder="1"
          />
          <button
            onClick={updateWeek}
            disabled={updatingWeek}
            className="px-4 py-2 text-[11px] font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            {updatingWeek ? 'Updating...' : 'Set Week'}
          </button>
        </div>
      </div>

      {/* Hint */}
      <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Drag rows by the ⠿ handle to reorder. Ranks update automatically.
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid items-center px-5 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400"
          style={{ gridTemplateColumns: '28px 36px 1fr 52px 52px 52px 52px 52px 90px 36px' }}>
          <div />
          <div className="text-center">#</div>
          <div>Team</div>
          <div className="text-center">W</div>
          <div className="text-center">L</div>
          <div className="text-center">GW</div>
          <div className="text-center">GL</div>
          <div className="text-center">Pts</div>
          <div />
          <div />
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-300 text-sm">Loading...</div>
        ) : standings.length === 0 ? (
          <div className="p-12 text-center text-gray-300 text-sm">No standings for this season yet</div>
        ) : (
          standings.map((row, index) => {
            const isEditing    = editingId === row.id;
            const isDragTarget = dragOver === index;
            return (
              <div
                key={row.id}
                draggable={!isEditing}
                onDragStart={() => onDragStart(index)}
                onDragEnter={() => onDragEnter(index)}
                onDragOver={e => e.preventDefault()}
                onDragEnd={onDragEnd}
                className={`grid items-center px-5 py-3 border-b border-gray-50 last:border-0 transition-all duration-150 ${
                  isDragTarget ? 'border-t-2 border-t-[#42deef] bg-[#42deef]/5' :
                  isEditing    ? 'bg-[#42deef]/5' : 'hover:bg-gray-50/50'
                }`}
                style={{ gridTemplateColumns: '28px 36px 1fr 52px 52px 52px 52px 52px 90px 36px' }}
              >
                {/* Drag handle */}
                <div className={`flex items-center justify-center text-gray-300 select-none ${isEditing ? 'opacity-20' : 'cursor-grab active:cursor-grabbing hover:text-gray-500'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
                </div>

                {/* Rank */}
                <div className="text-center">
                  <span className={`text-[13px] font-bold ${row.rank <= 3 ? 'text-[#42deef]' : 'text-gray-400'}`}>{row.rank}</span>
                </div>

                {/* Team name */}
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm!.team}
                      onChange={e => setEditForm(f => f ? { ...f, team: e.target.value } : f)}
                      className="w-full bg-white border border-[#42deef] text-gray-800 text-[13px] px-2 py-1 rounded focus:outline-none"
                    />
                  ) : (
                    <span className={`text-[13px] font-semibold ${row.is_vamos ? 'text-[#42deef]' : 'text-gray-800'}`}>{row.team}</span>
                  )}
                </div>

                {/* Stats */}
                {(['match_wins', 'match_losses', 'game_wins', 'game_losses', 'points'] as const).map(key => (
                  <div key={key} className="flex justify-center">
                    {isEditing ? (
                      <input
                        type="number" min={0}
                        value={(editForm as any)[key]}
                        onChange={e => setEditForm(f => f ? { ...f, [key]: parseInt(e.target.value) || 0 } : f)}
                        className="w-11 text-center bg-white border border-[#42deef] text-gray-800 text-[12px] px-1 py-1 rounded focus:outline-none"
                      />
                    ) : (
                      <span className={`text-[13px] font-semibold ${
                        key === 'match_wins'   && row.match_wins > 0   ? 'text-emerald-500' :
                        key === 'match_losses' && row.match_losses > 0 ? 'text-red-400' :
                        key === 'points' ? 'text-gray-800 font-bold' : 'text-gray-400'
                      }`}>{(row as any)[key]}</span>
                    )}
                  </div>
                ))}

                {/* Edit / Save */}
                <div className="flex items-center gap-1.5">
                  {isEditing ? (
                    <>
                      <button onClick={saveEdit} disabled={saving === row.id}
                        className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#42deef] rounded hover:bg-[#0bb8d4] transition-colors disabled:opacity-40">
                        {saving === row.id ? '...' : 'Save'}
                      </button>
                      <button onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-[10px] font-bold text-gray-400 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                        ✕
                      </button>
                    </>
                  ) : (
                    <button onClick={() => openEdit(row)}
                      className="px-2.5 py-1 text-[10px] font-semibold text-gray-500 bg-gray-50 rounded hover:bg-[#42deef] hover:text-white transition-all">
                      Edit
                    </button>
                  )}
                </div>

                {/* Delete — locked for Team Vamos */}
                <div className="flex justify-center">
                  {!row.is_vamos && (
                    <button onClick={() => deleteRow(row.id)} disabled={saving === row.id}
                      className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add team modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="text-[13px] font-bold text-gray-800">Add Team to Standings</p>
              <button onClick={() => setAddOpen(false)} className="text-gray-300 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Team Name</label>
                <input
                  type="text"
                  value={addForm.team}
                  onChange={e => setAddForm(f => ({ ...f, team: e.target.value }))}
                  placeholder="e.g. Team Flash"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-[13px] px-4 py-2.5 rounded-lg focus:outline-none focus:border-[#42deef] focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { label: 'W', key: 'match_wins' },
                  { label: 'L', key: 'match_losses' },
                  { label: 'GW', key: 'game_wins' },
                  { label: 'GL', key: 'game_losses' },
                  { label: 'Pts', key: 'points' },
                ] as { label: string; key: keyof EditRow }[]).map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">{label}</label>
                    <input
                      type="number" min={0}
                      value={(addForm as any)[key]}
                      onChange={e => setAddForm(f => ({ ...f, [key]: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-[13px] px-3 py-2 rounded-lg focus:outline-none focus:border-[#42deef] text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setAddOpen(false)}
                className="flex-1 py-2.5 text-[12px] font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={addTeam} disabled={adding || !addForm.team.trim()}
                className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-[#42deef] rounded-lg hover:bg-[#0bb8d4] transition-colors disabled:opacity-40 shadow-sm">
                {adding ? 'Adding...' : 'Add Team'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="text-[15px] font-bold text-gray-900 mb-2">{confirmModal.title}</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">{confirmModal.body}</p>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 text-[12px] font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onOk}
                className="flex-1 py-2.5 text-[12px] font-semibold text-white bg-[#42deef] rounded-lg hover:bg-[#0bb8d4] transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
