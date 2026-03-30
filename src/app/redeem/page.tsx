'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { createRedemption } from '@/lib/db/points';
import { useAuth } from '@/app/providers';
import { getTopSpenders, getActiveSeason } from '@/lib/db/leaderboard';
import type { TopSpender, ActiveSeason } from '@/lib/db/leaderboard';

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'Merchandise' | 'Experience';
  icon: string;
  badge?: string;
  value: string;
  fields: 'merch' | 'experience';
  stock?: number | null;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  size: string;
  address: string;
  date: string;
  guests: string;
}

const EMPTY_FORM: FormData = { name: '', phone: '', email: '', size: 'M', address: '', date: '', guests: '1' };

const MATCH_SCHEDULE = [
  { date: '2026-04-03', label: '3 Apr — Team Vamos vs SRG Esports' },
  { date: '2026-04-11', label: '11 Apr — Team Vamos vs Invictus Gaming' },
  { date: '2026-04-12', label: '12 Apr — Team Vamos vs AC Esports' },
  { date: '2026-04-17', label: '17 Apr — Team Vamos vs RRQ Tora' },
  { date: '2026-04-19', label: '19 Apr — Team Vamos vs Team Flash' },
  { date: '2026-04-24', label: '24 Apr — Team Vamos vs Bigetron MY' },
  { date: '2026-04-25', label: '25 Apr — Team Vamos vs Team Rey' },
  { date: '2026-05-01', label: '1 May — Invictus Gaming vs Team Vamos' },
  { date: '2026-05-02', label: '2 May — Bigetron MY vs Team Vamos' },
  { date: '2026-05-08', label: '8 May — Team Rey vs Team Vamos' },
  { date: '2026-05-09', label: '9 May — RRQ Tora vs Team Vamos' },
  { date: '2026-05-16', label: '16 May — SRG Esports vs Team Vamos' },
  { date: '2026-05-23', label: '23 May — AC Esports vs Team Vamos' },
  { date: '2026-05-24', label: '24 May — Team Flash vs Team Vamos' },
].filter((m) => new Date(m.date) >= new Date());

type ModalStep = 'form' | 'confirm' | 'processing' | 'success';

function generateCode() {
  return 'VMR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getTier(pts: number) {
  if (pts >= 5000) return { label: 'DIAMOND', color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' };
  if (pts >= 2000) return { label: 'GOLD', color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' };
  if (pts >= 500)  return { label: 'SILVER', color: '#94a3b8', glow: 'rgba(148,163,184,0.2)' };
  return { label: 'BRONZE', color: '#cd7c3a', glow: 'rgba(205,124,58,0.2)' };
}

export default function RedeemPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redeemedIds, setRedeemedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'All' | 'Merchandise' | 'Experience'>('All');
  const [topSpenders, setTopSpenders] = useState<TopSpender[]>([]);
  const [activeSeason, setActiveSeason] = useState<ActiveSeason | null>(null);

  const [activeReward, setActiveReward] = useState<Reward | null>(null);
  const [step, setStep] = useState<ModalStep>('form');
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [code, setCode] = useState('');

  useEffect(() => { setPoints(profile?.points ?? 0); }, [profile]);

  useEffect(() => {
    supabase.from('rewards').select('*').eq('active', true).order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        setRewards(data.map((r) => ({
          id: r.id, title: r.title, description: r.description ?? '',
          points: r.points_required, category: r.category as Reward['category'],
          icon: r.icon ?? '🎁', badge: r.badge ?? undefined,
          value: r.value_label ?? '', fields: r.fields_type as Reward['fields'],
          stock: r.stock ?? null,
        })));
      });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from('redemptions').select('reward_id').eq('user_id', user.id).neq('status', 'cancelled')
      .then(({ data }) => setRedeemedIds((data ?? []).map((r) => r.reward_id)));
  }, [user]);

  useEffect(() => {
    getTopSpenders().then(setTopSpenders);
    getActiveSeason().then(setActiveSeason);
  }, []);

  const filtered = filter === 'All' ? rewards : rewards.filter((r) => r.category === filter);

  useEffect(() => {
    document.body.style.overflow = activeReward ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeReward]);

  function openModal(reward: Reward) {
    setActiveReward(reward); setStep('form'); setForm(EMPTY_FORM); setErrors({}); setCode('');
  }

  function closeModal() {
    if (step === 'processing') return;
    setActiveReward(null);
  }

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    if (activeReward?.fields === 'merch' && !form.address.trim()) e.address = 'Required';
    if (activeReward?.fields === 'experience' && !form.date) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goConfirm() { if (validate()) setStep('confirm'); }

  async function confirmRedeem() {
    if (!activeReward) return;
    setStep('processing');
    const newCode = generateCode();
    if (user) {
      const ok = await createRedemption({
        userId: user.id, rewardId: activeReward.id, pointsSpent: activeReward.points,
        code: newCode, name: form.name, phone: form.phone, email: form.email,
        size: activeReward.fields === 'merch' ? form.size : undefined,
        shippingAddress: activeReward.fields === 'merch' ? form.address : undefined,
        preferredDate: activeReward.fields === 'experience' ? form.date : undefined,
        guests: activeReward.fields === 'experience' ? parseInt(form.guests) : undefined,
      });
      if (ok) {
        await refreshProfile();
        setPoints((p) => p - activeReward.points);
        setRedeemedIds((ids) => [...ids, activeReward.id]);
        setRewards((prev) => prev.map((r) =>
          r.id === activeReward.id && r.stock != null ? { ...r, stock: r.stock - 1 } : r
        ));
      }
    } else {
      setPoints((p) => p - activeReward.points);
      setRedeemedIds((ids) => [...ids, activeReward.id]);
    }
    setCode(newCode);
    setStep('success');
  }

  const isMax = activeReward?.points === 5000;
  const accentColor = isMax ? '#f59e0b' : '#42deef';
  const tier = getTier(points);
  const nextReward = rewards.filter((r) => r.points > points).sort((a, b) => a.points - b.points)[0];
  const progressPct = nextReward ? Math.min((points / nextReward.points) * 100, 100) : 100;

  const podium1 = topSpenders.find((s) => s.rank === 1);
  const podium2 = topSpenders.find((s) => s.rank === 2);
  const podium3 = topSpenders.find((s) => s.rank === 3);
  const others  = topSpenders.filter((s) => s.rank > 3);

  return (
    <div className="bg-[#040810] min-h-screen pt-20">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center px-4 py-12">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid-lines opacity-20 pointer-events-none" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(66,222,239,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #040810, transparent)' }} />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 border border-[#42deef]/20 bg-[#42deef]/5 px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42deef] animate-pulse" />
                <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">Vamos Loyalty Programme</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tight leading-none mb-4">
                Vamos<br />
                <span className="text-shimmer">Rewards</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-8">
                Every ringgit you spend earns points. Stack them up and redeem exclusive Vamos merchandise, live match tickets, and premium experiences.
              </p>

              {/* Earn rates */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: 'Merchandise', rate: '2 pts / RM1', color: '#42deef' },
                  { label: 'Diamond Top-Up', rate: '1 pt / RM1', color: '#a78bfa' },
                  { label: 'Bonus Events', rate: '2× pts', color: '#f59e0b' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2 bg-[#060d14] border border-[#1A1A1A] px-4 py-2.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-black">{r.label}</span>
                    <span className="font-black text-[11px]" style={{ color: r.color }}>{r.rate}</span>
                  </div>
                ))}
              </div>

              {!user && (
                <Link href="/login"
                  className="inline-flex items-center gap-3 bg-[#42deef] text-[#040810] px-8 py-4 font-black uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(66,222,239,0.4)] transition-all duration-300">
                  Sign In to Start Earning
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Right — premium loyalty card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px]">
                {/* Glow behind card */}
                <div className="absolute inset-0 blur-[60px] opacity-40 rounded-xl"
                  style={{ background: `radial-gradient(ellipse, ${tier.color} 0%, transparent 70%)` }} />

                {/* Card */}
                <div className="relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #060f1a 0%, #08141f 40%, #060d18 100%)',
                    border: `1px solid ${tier.color}30`,
                    boxShadow: `0 0 0 1px ${tier.color}15, 0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 ${tier.color}20`,
                    aspectRatio: '1.586 / 1',
                  }}>

                  {/* Card decorative lines */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px]"
                      style={{ background: `linear-gradient(to right, transparent, ${tier.color}60, transparent)` }} />
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5"
                      style={{ background: tier.color, filter: 'blur(40px)' }} />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] opacity-20"
                      style={{ background: `linear-gradient(to right, ${tier.color}, transparent)` }} />
                    <svg className="absolute bottom-0 right-0 w-48 h-48 opacity-[0.04]" viewBox="0 0 200 200">
                      <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeWidth="1" />
                      <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeWidth="1" />
                      <circle cx="200" cy="200" r="50"  fill="none" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>

                  <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-1">Vamos Loyalty</p>
                        <p className="text-white font-black text-lg uppercase tracking-widest">Team Vamos</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="px-3 py-1 font-black text-[10px] uppercase tracking-widest"
                          style={{ background: `${tier.color}20`, border: `1px solid ${tier.color}40`, color: tier.color }}>
                          {tier.label}
                        </div>
                      </div>
                    </div>

                    {/* Points */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: tier.color, opacity: 0.7 }}>
                        Points Balance
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-black text-white leading-none">{points.toLocaleString()}</span>
                        <span className="text-xl font-black mb-1" style={{ color: tier.color }}>pts</span>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-600 mb-1">Member</p>
                        <p className="text-white font-black text-sm truncate max-w-[180px]">
                          {user ? (profile?.full_name ?? user.email ?? 'Guest') : 'Not signed in'}
                        </p>
                      </div>
                      {nextReward && (
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-widest text-gray-600 mb-1">Next Reward</p>
                          <p className="font-black text-sm" style={{ color: tier.color }}>{nextReward.points.toLocaleString()} pts</p>
                          <div className="w-24 h-1 bg-white/10 mt-1 overflow-hidden">
                            <div className="h-full transition-all duration-700"
                              style={{ width: `${progressPct}%`, background: tier.color }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERBOARD ───────────────────────────────────────────── */}
      <section className="relative py-20 px-4 overflow-hidden border-t border-[#0f1923]">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #040810 0%, #060d14 50%, #040810 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#f59e0b]/40" />
              <span className="text-[#f59e0b] text-[10px] font-black tracking-[0.4em] uppercase">Hall of Fame</span>
              <div className="h-px w-12 bg-[#f59e0b]/40" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              Top <span style={{ color: '#f59e0b' }}>Spenders</span>
            </h2>
            {activeSeason && (
              <p className="text-gray-500 text-sm mt-2">
                Season: <span className="text-white font-black">{activeSeason.name}</span>
                <span className="text-gray-700 mx-2">·</span>
                <span className="text-gray-600 text-xs">{activeSeason.start_date} → {activeSeason.end_date}</span>
              </p>
            )}
            <p className="text-gray-600 text-xs mt-1 max-w-md mx-auto">Resets every season. Only orders made during the active season count.</p>
          </div>

          {/* ── SEASON CHAMPION PRIZE ── */}
          <div className="relative overflow-hidden mb-10 border border-[#f59e0b]/30"
            style={{ background: 'linear-gradient(135deg, #0d0a00 0%, #110d00 50%, #0d0900 100%)', boxShadow: '0 0 60px rgba(245,158,11,0.08)' }}>
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(to right, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)' }} />
            {/* Glow orb */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />

            <div className="relative z-10 p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Trophy icon */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-20 h-20 flex items-center justify-center text-5xl border border-[#f59e0b]/30"
                    style={{ background: 'rgba(245,158,11,0.08)', boxShadow: '0 0 30px rgba(245,158,11,0.15)' }}>
                    🏆
                  </div>
                  <div className="mt-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-[#f59e0b]/40"
                    style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.08)' }}>
                    {activeSeason?.short_name ?? 'Season'} Prize
                  </div>
                </div>

                {/* Prize details */}
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2" style={{ color: '#f59e0b' }}>
                    Season Champion Reward
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 leading-tight">
                    Join Team Vamos<br className="hidden md:block" /> Team Building Trip
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-lg">
                    {activeSeason?.prize_desc ?? 'The #1 spender this season wins an exclusive invite to join Team Vamos on their team building trip — fully sponsored by the organisation.'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: '✈️', label: 'Flights', sub: 'Fully covered' },
                      { icon: '🏨', label: 'Hotel', sub: 'Fully covered' },
                      { icon: '🎮', label: 'Activities', sub: 'With the squad' },
                      { icon: '🎽', label: 'Signed Jersey', sub: 'Full S17 squad' },
                    ].map((perk) => (
                      <div key={perk.label} className="border border-[#f59e0b]/15 p-3"
                        style={{ background: 'rgba(245,158,11,0.04)' }}>
                        <div className="text-xl mb-1">{perk.icon}</div>
                        <p className="text-white font-black text-xs uppercase tracking-widest">{perk.label}</p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{perk.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#f59e0b]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-gray-600 text-xs">
                  Winner is determined at the end of <span className="text-[#f59e0b] font-black">{activeSeason?.name ?? 'the current season'}</span> · Spend more = rank higher · Resets next season
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
                  <span className="text-[#f59e0b] text-[10px] font-black uppercase tracking-widest">Season Active</span>
                </div>
              </div>
            </div>
          </div>

          {topSpenders.length === 0 ? (
            <div className="text-center py-16 border border-[#1A1A1A] bg-[#060d14]/50">
              <p className="text-4xl mb-4">🏆</p>
              <p className="text-white font-black uppercase tracking-widest text-sm mb-2">The board is empty</p>
              <p className="text-gray-600 text-xs">Complete your first order to claim the #1 spot</p>
            </div>
          ) : (
            <>
              {/* Podium — top 3 */}
              <div className="flex items-end justify-center gap-4 mb-8">
                {/* Rank 2 */}
                {podium2 && (
                  <div className="flex-1 max-w-[200px]">
                    <div className="relative overflow-hidden border border-[#94a3b8]/20 bg-[#060d14] p-5 text-center"
                      style={{ boxShadow: '0 0 30px rgba(148,163,184,0.06)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent" />
                      <div className="text-3xl mb-2">🥈</div>
                      <p className="text-white font-black text-sm truncate mb-0.5">{podium2.display_name}</p>
                      {user?.id === podium2.user_id && (
                        <span className="inline-block bg-[#42deef] text-[#040810] text-[8px] font-black px-2 py-0.5 uppercase tracking-widest mb-1">You</span>
                      )}
                      <p className="text-gray-500 text-[10px] mb-3">{podium2.order_count} orders</p>
                      <p className="text-[#94a3b8] font-black text-lg">RM {Number(podium2.total_spent).toFixed(0)}</p>
                      <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">{podium2.total_points.toLocaleString()} pts</p>
                    </div>
                    <div className="h-12 bg-[#94a3b8]/10 border-x border-b border-[#94a3b8]/20 flex items-center justify-center">
                      <span className="text-[#94a3b8] text-xs font-black">#2</span>
                    </div>
                  </div>
                )}

                {/* Rank 1 — tallest */}
                {podium1 && (
                  <div className="flex-1 max-w-[220px]">
                    <div className="relative overflow-hidden border border-[#f59e0b]/30 bg-[#060d14] p-6 text-center"
                      style={{ boxShadow: '0 0 50px rgba(245,158,11,0.12), 0 0 0 1px rgba(245,158,11,0.1)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent" />
                      <div className="absolute inset-0 opacity-[0.03]"
                        style={{ background: 'radial-gradient(ellipse at top, #f59e0b, transparent)' }} />
                      <div className="relative z-10">
                        <div className="text-4xl mb-3">👑</div>
                        <p className="text-white font-black text-sm truncate mb-0.5">{podium1.display_name}</p>
                        {user?.id === podium1.user_id && (
                          <span className="inline-block bg-[#42deef] text-[#040810] text-[8px] font-black px-2 py-0.5 uppercase tracking-widest mb-1">You</span>
                        )}
                        <p className="text-gray-500 text-[10px] mb-3">{podium1.order_count} orders</p>
                        <p className="font-black text-2xl" style={{ color: '#f59e0b' }}>RM {Number(podium1.total_spent).toFixed(0)}</p>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">{podium1.total_points.toLocaleString()} pts</p>
                      </div>
                    </div>
                    <div className="h-20 bg-[#f59e0b]/10 border-x border-b border-[#f59e0b]/20 flex items-center justify-center">
                      <span className="text-[#f59e0b] text-sm font-black">#1</span>
                    </div>
                  </div>
                )}

                {/* Rank 3 */}
                {podium3 && (
                  <div className="flex-1 max-w-[200px]">
                    <div className="relative overflow-hidden border border-[#cd7c3a]/20 bg-[#060d14] p-5 text-center"
                      style={{ boxShadow: '0 0 30px rgba(205,124,58,0.06)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#cd7c3a] to-transparent" />
                      <div className="text-3xl mb-2">🥉</div>
                      <p className="text-white font-black text-sm truncate mb-0.5">{podium3.display_name}</p>
                      {user?.id === podium3.user_id && (
                        <span className="inline-block bg-[#42deef] text-[#040810] text-[8px] font-black px-2 py-0.5 uppercase tracking-widest mb-1">You</span>
                      )}
                      <p className="text-gray-500 text-[10px] mb-3">{podium3.order_count} orders</p>
                      <p className="text-[#cd7c3a] font-black text-lg">RM {Number(podium3.total_spent).toFixed(0)}</p>
                      <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-1">{podium3.total_points.toLocaleString()} pts</p>
                    </div>
                    <div className="h-6 bg-[#cd7c3a]/10 border-x border-b border-[#cd7c3a]/20 flex items-center justify-center">
                      <span className="text-[#cd7c3a] text-xs font-black">#3</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ranks 4–5 */}
              {others.length > 0 && (
                <div className="space-y-2 mt-4">
                  {others.map((s) => {
                    const isMe = user?.id === s.user_id;
                    return (
                      <div key={s.user_id}
                        className={`flex items-center gap-4 px-5 py-3.5 border transition-all ${
                          isMe ? 'border-[#42deef]/30 bg-[#42deef]/5' : 'border-[#1A1A1A] bg-[#060d14]'
                        }`}>
                        <span className="w-8 text-center text-gray-600 text-xs font-black shrink-0">#{s.rank}</span>
                        <span className={`flex-1 font-black text-sm truncate ${isMe ? 'text-[#42deef]' : 'text-white'}`}>{s.display_name}</span>
                        {isMe && <span className="bg-[#42deef] text-[#040810] text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest shrink-0">You</span>}
                        <span className="text-gray-500 text-xs shrink-0 hidden sm:block">{s.order_count} orders</span>
                        <span className="text-white font-black text-sm shrink-0">RM {Number(s.total_spent).toFixed(0)}</span>
                        <span className="text-[#42deef] text-xs font-black shrink-0">{s.total_points.toLocaleString()} pts</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
          <p className="text-gray-700 text-[10px] text-center mt-6">
            {activeSeason ? `${activeSeason.name} leaderboard · ` : ''}Updates after every completed order · Top 5 shown · Resets each season
          </p>
        </div>
      </section>

      {/* ── REWARDS CATALOGUE ─────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-[#0f1923]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#42deef]/60" />
                <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">Rewards Catalogue</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                Available <span className="text-shimmer">Rewards</span>
              </h2>
            </div>
            <div className="flex gap-2">
              {(['All', 'Merchandise', 'Experience'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                    filter === f
                      ? 'bg-[#42deef] text-[#040810] shadow-[0_0_20px_rgba(66,222,239,0.3)]'
                      : 'border border-[#1A1A1A] text-gray-500 hover:border-[#42deef]/40 hover:text-white'
                  }`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((reward) => {
              const outOfStock = reward.stock !== null && reward.stock !== undefined && reward.stock <= 0;
              const canRedeem = points >= reward.points && !redeemedIds.includes(reward.id) && !outOfStock;
              const alreadyDone = redeemedIds.includes(reward.id);
              const gold = reward.points >= 4000;
              const accent = gold ? '#f59e0b' : '#42deef';

              return (
                <div key={reward.id}
                  className={`relative group flex flex-col overflow-hidden transition-all duration-300 ${
                    alreadyDone ? 'opacity-50' : !canRedeem && !outOfStock ? 'opacity-60' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(145deg, #060d14 0%, #070f18 100%)',
                    border: `1px solid ${alreadyDone ? accent + '30' : '#1A1A1A'}`,
                  }}
                  onMouseEnter={(e) => {
                    if (canRedeem && !alreadyDone)
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        `0 0 0 1px ${accent}50, 0 16px 50px ${accent}12`;
                  }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                >
                  {/* Top accent bar */}
                  <div className="h-[2px]"
                    style={{ background: canRedeem || alreadyDone
                      ? `linear-gradient(to right, transparent, ${accent}, transparent)`
                      : 'linear-gradient(to right, transparent, #1A1A1A, transparent)' }} />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10">
                    {alreadyDone && (
                      <div className="flex items-center gap-1.5 border border-[#42deef]/40 bg-[#42deef]/5 px-2 py-1">
                        <svg className="w-2.5 h-2.5 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[#42deef] text-[8px] font-black uppercase tracking-widest">Redeemed</span>
                      </div>
                    )}
                    {!alreadyDone && outOfStock && (
                      <span className="text-red-400 text-[8px] font-black uppercase tracking-widest bg-red-400/10 border border-red-400/20 px-2 py-1">Sold Out</span>
                    )}
                    {!alreadyDone && !outOfStock && reward.badge && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1"
                        style={{ background: accent, color: '#040810' }}>{reward.badge}</span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    {/* Icon */}
                    <div className="mb-5">
                      <div className="w-16 h-16 flex items-center justify-center text-3xl mb-4"
                        style={{
                          background: `${accent}10`,
                          border: `1px solid ${accent}25`,
                          boxShadow: canRedeem ? `inset 0 0 20px ${accent}08` : 'none',
                        }}>
                        {reward.icon}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>{reward.category}</span>
                      <h3 className="text-white font-black uppercase text-base leading-tight mt-1">{reward.title}</h3>
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{reward.description}</p>

                    {/* Stock */}
                    {reward.stock !== null && reward.stock !== undefined && !outOfStock && (
                      <div className="mb-4">
                        {reward.stock <= 3 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                            <span className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Only {reward.stock} left</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            <span className="text-gray-600 text-[10px] uppercase tracking-widest">{reward.stock} available</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Points + CTA */}
                    <div className="border-t border-[#1A1A1A] pt-4 mt-auto">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-black text-2xl leading-none" style={{ color: accent }}>
                            {reward.points.toLocaleString()}
                          </div>
                          <div className="text-gray-600 text-[9px] font-black uppercase tracking-widest mt-0.5">pts · {reward.value}</div>
                        </div>
                        {alreadyDone ? (
                          <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Complete ✓</div>
                        ) : (
                          <button
                            onClick={() => canRedeem && openModal(reward)}
                            disabled={!canRedeem}
                            className="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200 shrink-0"
                            style={canRedeem
                              ? { background: accent, color: '#040810', boxShadow: `0 0 0 0 ${accent}` }
                              : { background: '#111', color: '#444', cursor: 'not-allowed' }
                            }
                            onMouseEnter={(e) => {
                              if (canRedeem) (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${accent}50`;
                            }}
                            onMouseLeave={(e) => {
                              if (canRedeem) (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 0 ${accent}`;
                            }}
                          >
                            {outOfStock ? 'Sold Out' : canRedeem ? 'Redeem' : `Need ${(reward.points - points).toLocaleString()} more`}
                          </button>
                        )}
                      </div>

                      {/* Progress bar */}
                      {!canRedeem && !alreadyDone && !outOfStock && (
                        <div className="mt-3">
                          <div className="h-px bg-[#1A1A1A] overflow-hidden">
                            <div className="h-full transition-all duration-700"
                              style={{ width: `${Math.min((points / reward.points) * 100, 100)}%`, background: accent, opacity: 0.4 }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-700 mt-1">
                            <span>{points.toLocaleString()} pts</span>
                            <span>{reward.points.toLocaleString()} pts</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW TO EARN ───────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-[#0f1923]"
        style={{ background: 'linear-gradient(180deg, #060b10 0%, #040810 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#42deef]/40" />
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">How It Works</span>
              <div className="h-px w-12 bg-[#42deef]/40" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase">Earn <span className="text-shimmer">Points</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '🛒', title: 'Shop at Vamos Store', desc: 'Earn 2 points for every RM1 spent on official Vamos merchandise.', rate: '2 pts / RM1', color: '#42deef' },
              { icon: '💎', title: 'Top Up via Marketplace', desc: 'Earn 1 point for every RM1 spent on game diamond top-ups.', rate: '1 pt / RM1', color: '#a78bfa' },
              { icon: '⚡', title: 'Bonus Events', desc: 'Double points on special events, match days and seasonal promotions.', rate: '2× pts', color: '#f59e0b' },
            ].map((item) => (
              <div key={item.title}
                className="relative overflow-hidden group border border-[#1A1A1A] bg-[#060d14] p-7 hover:border-[#1A1A1A]/60 transition-all"
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${item.color}08, 0 0 0 1px ${item.color}20`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(to right, transparent, ${item.color}, transparent)` }} />
                <div className="w-12 h-12 flex items-center justify-center text-2xl mb-5"
                  style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{item.desc}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-[#1A1A1A]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                  <span className="font-black text-xs" style={{ color: item.color }}>{item.rate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Rate visualization */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { from: 'RM 189', to: '378 pts', label: 'Vamos Jersey purchase', color: '#42deef' },
              { from: 'RM 50', to: '50 pts', label: 'Mobile Legends top-up', color: '#a78bfa' },
            ].map((ex) => (
              <div key={ex.label} className="flex items-center gap-4 border border-[#1A1A1A] bg-[#060d14] px-6 py-4">
                <span className="text-2xl font-black text-white shrink-0">{ex.from}</span>
                <svg className="w-5 h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div>
                  <span className="font-black text-2xl" style={{ color: ex.color }}>{ex.to}</span>
                  <p className="text-gray-600 text-[10px] mt-0.5 uppercase tracking-widest">{ex.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIERS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-[#0f1923]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#42deef]/40" />
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">Membership Tiers</span>
              <div className="h-px w-12 bg-[#42deef]/40" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase">Your <span className="text-shimmer">Tier</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'BRONZE', min: 0,    max: 499,  color: '#cd7c3a', icon: '🥉' },
              { label: 'SILVER', min: 500,  max: 1999, color: '#94a3b8', icon: '🥈' },
              { label: 'GOLD',   min: 2000, max: 4999, color: '#f59e0b', icon: '🥇' },
              { label: 'DIAMOND',min: 5000, max: null, color: '#a78bfa', icon: '💎' },
            ].map((t) => {
              const active = tier.label === t.label;
              return (
                <div key={t.label}
                  className="relative overflow-hidden border p-5 text-center transition-all"
                  style={{
                    borderColor: active ? `${t.color}60` : '#1A1A1A',
                    background: active ? `${t.color}08` : '#060d14',
                    boxShadow: active ? `0 0 30px ${t.color}10` : 'none',
                  }}>
                  {active && <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(to right, transparent, ${t.color}, transparent)` }} />}
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: t.color }}>{t.label}</p>
                  <p className="text-gray-600 text-[10px]">
                    {t.max ? `${t.min.toLocaleString()}–${t.max.toLocaleString()} pts` : `${t.min.toLocaleString()}+ pts`}
                  </p>
                  {active && <div className="mt-2 text-[9px] font-black uppercase tracking-widest" style={{ color: t.color }}>← Your Tier</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-[#0f1923]"
        style={{ background: 'linear-gradient(180deg, #060b10 0%, #040810 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Points <span className="text-[#42deef]">FAQ</span></h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { q: 'Do points expire?', a: 'Points are valid for 12 months from the date of your last purchase. Stay active to keep them alive.' },
              { q: 'When do points credit?', a: 'Points are added to your account instantly after a successful purchase is confirmed.' },
              { q: 'Can I gift my points?', a: 'Points are non-transferable and tied to your account. They cannot be gifted or sold.' },
              { q: 'How do I claim a reward?', a: 'Click "Redeem", fill in your details, and confirm. Our team will reach out within 2 business days.' },
            ].map((item) => (
              <div key={item.q} className="border border-[#1A1A1A] bg-[#060d14] p-5 hover:border-[#42deef]/20 transition-colors">
                <p className="text-white font-black text-sm mb-2">{item.q}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-6 px-4 text-center border-t border-[#0f1923]">
        <p className="text-gray-700 text-xs">Vamos Loyalty Programme · Points have no cash value · Subject to terms and conditions</p>
      </div>

      {/* ── MODAL ─────────────────────────────────────────────────── */}
      {activeReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(4,8,16,0.9)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="w-full max-w-lg bg-[#060d14] border border-[#1A1A1A] overflow-hidden relative max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: `0 0 0 1px ${accentColor}30, 0 32px 100px rgba(0,0,0,0.9)` }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeReward.icon}</span>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: accentColor }}>{activeReward.category}</p>
                  <p className="text-white font-black text-sm uppercase leading-tight">{activeReward.title}</p>
                </div>
              </div>
              {step !== 'processing' && (
                <button onClick={closeModal} className="text-gray-600 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Step indicator */}
            {(step === 'form' || step === 'confirm') && (
              <div className="flex items-center gap-0 px-6 pt-5 pb-1">
                {['Your Details', 'Confirm'].map((label, i) => {
                  const active = (i === 0 && step === 'form') || (i === 1 && step === 'confirm');
                  const done = i === 0 && step === 'confirm';
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                        done ? 'bg-[#42deef] text-[#040810]' : active ? 'text-[#040810]' : 'bg-[#1A1A1A] text-gray-600'
                      }`} style={active ? { background: accentColor } : {}}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
                      {i === 0 && <div className="w-8 h-px bg-[#1A1A1A] mx-2" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP: FORM */}
            {step === 'form' && (
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Full Name</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ahmad Razif"
                      className={`w-full px-4 py-3 bg-[#040810] border text-white text-sm focus:outline-none transition-colors placeholder-gray-700 ${errors.name ? 'border-red-500' : 'border-[#1A1A1A] focus:border-[#42deef]'}`} />
                    {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Phone</label>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+60 12 345 6789"
                      className={`w-full px-4 py-3 bg-[#040810] border text-white text-sm focus:outline-none transition-colors placeholder-gray-700 ${errors.phone ? 'border-red-500' : 'border-[#1A1A1A] focus:border-[#42deef]'}`} />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Email</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className={`w-full px-4 py-3 bg-[#040810] border text-white text-sm focus:outline-none transition-colors placeholder-gray-700 ${errors.email ? 'border-red-500' : 'border-[#1A1A1A] focus:border-[#42deef]'}`} />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                  </div>

                  {activeReward.fields === 'merch' && (
                    <>
                      <div>
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Size</label>
                        <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                          className="w-full px-4 py-3 bg-[#040810] border border-[#1A1A1A] focus:border-[#42deef] text-white text-sm focus:outline-none transition-colors">
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Shipping Address</label>
                        <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                          placeholder="Full address including postcode and state" rows={3}
                          className={`w-full px-4 py-3 bg-[#040810] border text-white text-sm focus:outline-none transition-colors placeholder-gray-700 resize-none ${errors.address ? 'border-red-500' : 'border-[#1A1A1A] focus:border-[#42deef]'}`} />
                        {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                      </div>
                    </>
                  )}

                  {activeReward.fields === 'experience' && (
                    <>
                      {activeReward.title.toLowerCase().includes('ticket') ? (
                        <div className="col-span-2">
                          <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Select Match</label>
                          <select value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className={`w-full px-4 py-3 bg-[#040810] border text-white text-sm focus:outline-none transition-colors ${errors.date ? 'border-red-500' : 'border-[#1A1A1A] focus:border-[#42deef]'}`}>
                            <option value="">— Choose a match date —</option>
                            {MATCH_SCHEDULE.map((m) => <option key={m.date} value={m.date}>{m.label}</option>)}
                          </select>
                          {errors.date && <p className="text-red-500 text-[10px] mt-1">{errors.date}</p>}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Preferred Date</label>
                          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                            min={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
                            className={`w-full px-4 py-3 bg-[#040810] border text-white text-sm focus:outline-none transition-colors ${errors.date ? 'border-red-500' : 'border-[#1A1A1A] focus:border-[#42deef]'}`} />
                          {errors.date && <p className="text-red-500 text-[10px] mt-1">{errors.date}</p>}
                        </div>
                      )}
                      {!activeReward.title.toLowerCase().includes('ticket') && (
                        <div>
                          <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">No. of Guests</label>
                          <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                            className="w-full px-4 py-3 bg-[#040810] border border-[#1A1A1A] focus:border-[#42deef] text-white text-sm focus:outline-none transition-colors">
                            {['1', '2', '3', '4'].map((n) => <option key={n} value={n}>{n} {n === '1' ? 'person' : 'people'}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={closeModal}
                    className="flex-1 py-3 border border-[#1A1A1A] text-gray-400 text-xs font-black uppercase tracking-widest hover:border-[#42deef]/40 hover:text-white transition-all">
                    Cancel
                  </button>
                  <button onClick={goConfirm}
                    className="flex-1 py-3 text-[#040810] text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                    style={{ background: accentColor }}>
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* STEP: CONFIRM */}
            {step === 'confirm' && (
              <div className="px-6 py-5 space-y-4">
                <div className="bg-[#040810] border border-[#1A1A1A] p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Redemption Summary</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Reward</span>
                    <span className="text-white font-black text-sm">{activeReward.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Points to deduct</span>
                    <span className="font-black text-sm" style={{ color: accentColor }}>−{activeReward.points.toLocaleString()} pts</span>
                  </div>
                  <div className="h-px bg-[#1A1A1A] my-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Remaining balance</span>
                    <span className="text-white font-black text-sm">{(points - activeReward.points).toLocaleString()} pts</span>
                  </div>
                </div>

                <div className="bg-[#040810] border border-[#1A1A1A] p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Your Details</p>
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'Phone', value: form.phone },
                    { label: 'Email', value: form.email },
                    ...(activeReward.fields === 'merch' ? [
                      { label: 'Size', value: form.size },
                      { label: 'Address', value: form.address },
                    ] : activeReward.title.toLowerCase().includes('ticket') ? [
                      { label: 'Match', value: MATCH_SCHEDULE.find((m) => m.date === form.date)?.label ?? form.date },
                    ] : [
                      { label: 'Date', value: form.date },
                      { label: 'Guests', value: `${form.guests} ${form.guests === '1' ? 'person' : 'people'}` },
                    ]),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-gray-600 text-xs shrink-0">{label}</span>
                      <span className="text-white text-xs text-right break-all">{value}</span>
                    </div>
                  ))}
                </div>

                <p className="text-gray-600 text-[11px] leading-relaxed">
                  By confirming, {activeReward.points.toLocaleString()} points will be deducted. Our team will reach out within 2 business days.
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setStep('form')}
                    className="flex-1 py-3 border border-[#1A1A1A] text-gray-400 text-xs font-black uppercase tracking-widest hover:border-[#42deef]/40 hover:text-white transition-all">
                    ← Edit
                  </button>
                  <button onClick={confirmRedeem}
                    className="flex-1 py-3 text-[#040810] text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                    style={{ background: accentColor }}>
                    Confirm Redemption
                  </button>
                </div>
              </div>
            )}

            {/* STEP: PROCESSING */}
            {step === 'processing' && (
              <div className="px-6 py-16 flex flex-col items-center text-center">
                <div className="w-14 h-14 border-2 border-t-transparent rounded-full animate-spin mb-6"
                  style={{ borderColor: `${accentColor} transparent transparent transparent` }} />
                <p className="text-white font-black uppercase tracking-widest text-sm">Processing Redemption</p>
                <p className="text-gray-600 text-xs mt-2">Deducting {activeReward.points.toLocaleString()} points...</p>
              </div>
            )}

            {/* STEP: SUCCESS */}
            {step === 'success' && (
              <div className="px-6 py-8 text-center">
                <div className="w-16 h-16 border-2 flex items-center justify-center mx-auto mb-5"
                  style={{ borderColor: accentColor, boxShadow: `0 0 30px ${accentColor}30` }}>
                  <svg className="w-8 h-8" fill="none" stroke={accentColor} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-1">Redemption Confirmed!</h3>
                <p className="text-gray-400 text-sm mb-5">{activeReward.title}</p>

                <div className="bg-[#040810] border px-6 py-4 mb-5 mx-auto max-w-xs" style={{ borderColor: `${accentColor}40` }}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Redemption Code</p>
                  <p className="text-2xl font-black tracking-widest" style={{ color: accentColor }}>{code}</p>
                  <p className="text-gray-600 text-[10px] mt-1">Screenshot this for your records</p>
                </div>

                <div className="flex items-center justify-center gap-3 mb-5 text-sm">
                  <span className="text-gray-500">New balance:</span>
                  <span className="font-black text-white">{points.toLocaleString()}<span className="text-[#42deef] text-xs ml-1">pts</span></span>
                </div>

                <div className="bg-[#040810] border border-[#1A1A1A] p-4 text-left mb-5 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">What Happens Next</p>
                  {activeReward.fields === 'merch' ? (
                    <>
                      <p className="text-gray-400 text-xs">📦 Our team will process your order within 1 business day.</p>
                      <p className="text-gray-400 text-xs">🚚 Shipping takes 5–7 business days to your address.</p>
                      <p className="text-gray-400 text-xs">📧 Tracking info will be sent to <span className="text-white">{form.email}</span></p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-400 text-xs">📅 We will confirm your slot for <span className="text-white">{form.date}</span>.</p>
                      <p className="text-gray-400 text-xs">📞 Our team will call <span className="text-white">{form.phone}</span> within 2 business days.</p>
                      <p className="text-gray-400 text-xs">📍 Venue details and instructions will be shared upon confirmation.</p>
                    </>
                  )}
                </div>

                <button onClick={closeModal}
                  className="w-full py-3 border text-xs font-black uppercase tracking-widest hover:text-white transition-all"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
