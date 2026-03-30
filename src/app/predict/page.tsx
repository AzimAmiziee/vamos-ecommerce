'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Link from 'next/link';
import { useAuth } from '@/app/providers';
import { getMatches, getUserPredictions, submitPrediction } from '@/lib/db/predictions';
import type { DBMatch, DBPrediction } from '@/lib/db/predictions';

const VAMOS_PRIMARY = '#42deef';
const POINTS_PER_CORRECT = 20;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

// Max score for a format
function maxScore(format: string) {
  if (format === 'Bo1') return 1;
  if (format === 'Bo3') return 2;
  if (format === 'Bo5') return 3;
  return 2;
}

export default function PredictPage() {
  const { user } = useAuth();

  const [matches, setMatches] = useState<DBMatch[]>([]);
  const [predictions, setPredictions] = useState<Record<string, DBPrediction>>({});
  const [loading, setLoading] = useState(true);

  // Per-match form state: { [matchId]: { home: number, away: number } }
  const [inputs, setInputs] = useState<Record<string, { home: number; away: number }>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getMatches().then((data) => {
      setMatches(data);
      // Init inputs to 0/0
      const init: Record<string, { home: number; away: number }> = {};
      data.forEach((m) => { init[m.id] = { home: 0, away: 0 }; });
      setInputs(init);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserPredictions(user.id).then((data) => {
      const map: Record<string, DBPrediction> = {};
      data.forEach((p) => { map[p.match_id] = p; });
      setPredictions(map);
      // Pre-fill inputs with existing predictions
      setInputs((prev) => {
        const next = { ...prev };
        data.forEach((p) => {
          next[p.match_id] = { home: p.pred_home, away: p.pred_away };
        });
        return next;
      });
    });
  }, [user]);

  const handleSubmit = async (match: DBMatch) => {
    if (!user) return;
    const input = inputs[match.id] ?? { home: 0, away: 0 };
    const max = maxScore(match.format);

    // At least one side must equal the max (valid Bo result)
    if (input.home !== max && input.away !== max) return;
    if (input.home === input.away) return;

    setSubmitting((p) => ({ ...p, [match.id]: true }));
    const ok = await submitPrediction(user.id, match.id, input.home, input.away);
    if (ok) {
      setPredictions((p) => ({
        ...p,
        [match.id]: {
          id: '', user_id: user.id, match_id: match.id,
          pred_home: input.home, pred_away: input.away,
          is_correct: null, points_awarded: 0,
        },
      }));
      setSubmitted((p) => ({ ...p, [match.id]: true }));
      setTimeout(() => setSubmitted((p) => ({ ...p, [match.id]: false })), 3000);
    }
    setSubmitting((p) => ({ ...p, [match.id]: false }));
  };

  const upcoming = matches.filter((m) => m.status === 'upcoming' || m.status === 'live');
  const completed = matches.filter((m) => m.status === 'completed');
  const totalCorrect = Object.values(predictions).filter((p) => p.is_correct).length;
  const totalPoints = totalCorrect * POINTS_PER_CORRECT;

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #040d14 0%, #071219 50%, #040d14 100%)' }}>
        <div className="absolute inset-0 bg-grid-lines opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#42deef] opacity-[0.05] blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">Vamos Community</span>
            <div className="h-px w-10 bg-[#42deef]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
            Predict <span className="text-shimmer">&amp; Win</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Predict match scores, earn <span className="text-[#42deef] font-black">{POINTS_PER_CORRECT} points</span> per correct call. Redeem for free merch and exclusive experiences.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: '🎯', label: `${upcoming.length} Upcoming Match${upcoming.length !== 1 ? 'es' : ''}` },
              { icon: '⭐', label: `${POINTS_PER_CORRECT} pts per Correct Pick` },
              { icon: '🏆', label: 'Redeem for Free Merch' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 bg-[#42deef]/10 border border-[#42deef]/20 px-4 py-2">
                <span>{b.icon}</span>
                <span className="text-[#42deef] text-xs font-black uppercase tracking-widest">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* User stats bar (if logged in and has predictions) */}
        {user && Object.keys(predictions).length > 0 && (
          <div className="bg-[#060d14] border border-[#42deef]/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">Your Predictions</p>
                <p className="text-white font-black text-xl">{Object.keys(predictions).length}</p>
              </div>
              <div className="w-px h-8 bg-[#1A1A1A]" />
              <div>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">Correct</p>
                <p className="text-[#42deef] font-black text-xl">{totalCorrect}</p>
              </div>
              <div className="w-px h-8 bg-[#1A1A1A]" />
              <div>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">Points Earned</p>
                <p className="text-[#42deef] font-black text-xl">+{totalPoints}</p>
              </div>
            </div>
            <Link href="/redeem"
              className="text-[#42deef] text-xs font-black uppercase tracking-widest hover:underline">
              View Rewards →
            </Link>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-52 bg-[#060d14] border border-[#1A1A1A] animate-pulse" />
            ))}
          </div>
        )}

        {/* ── UPCOMING MATCHES ──────────────────────────────── */}
        {!loading && upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#42deef]" />
              <h2 className="text-white font-black text-xs uppercase tracking-[0.3em]">Upcoming Matches</h2>
            </div>

            <div className="space-y-4">
              {upcoming.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  existing={predictions[match.id]}
                  input={inputs[match.id] ?? { home: 0, away: 0 }}
                  onInput={(home, away) => setInputs((p) => ({ ...p, [match.id]: { home, away } }))}
                  onSubmit={() => handleSubmit(match)}
                  submitting={submitting[match.id] ?? false}
                  submitSuccess={submitted[match.id] ?? false}
                  user={user}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && upcoming.length === 0 && (
          <div className="border border-[#1A1A1A] p-12 text-center">
            <p className="text-gray-600 text-xs uppercase tracking-widest">No upcoming matches right now. Check back soon.</p>
          </div>
        )}

        {/* ── PAST RESULTS ──────────────────────────────────── */}
        {!loading && completed.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#42deef]/40" />
              <h2 className="text-gray-500 font-black text-xs uppercase tracking-[0.3em]">Past Results</h2>
            </div>

            <div className="space-y-3">
              {completed.map((match) => (
                <PastMatchRow
                  key={match.id}
                  match={match}
                  prediction={predictions[match.id]}
                />
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="border-t border-[#1A1A1A] pt-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[#42deef]" />
            <h2 className="text-white font-black text-xs uppercase tracking-[0.3em]">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: '01', title: 'Pick the Score', desc: `Predict the exact score for any Bo3/Bo5 match before it starts.` },
              { n: '02', title: 'Watch Live',     desc: 'Tune in to the match and cheer Team Vamos to victory.' },
              { n: '03', title: 'Earn Points',    desc: `Correct prediction = ${POINTS_PER_CORRECT} points added to your account automatically.` },
            ].map((s) => (
              <div key={s.n} className="bg-[#060d14] border border-[#1A1A1A] hover:border-[#42deef]/30 p-6 transition-colors group">
                <div className="text-[#42deef]/15 font-black text-6xl mb-4 leading-none group-hover:text-[#42deef]/25 transition-colors">{s.n}</div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Match Prediction Card ─────────────────────────────────────
function MatchCard({
  match, existing, input, onInput, onSubmit, submitting, submitSuccess, user,
}: {
  match: DBMatch;
  existing?: DBPrediction;
  input: { home: number; away: number };
  onInput: (home: number, away: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitSuccess: boolean;
  user: { id: string } | null;
}) {
  const max = maxScore(match.format);
  const locked = !!existing || isPast(match.match_date);
  const displayHome = locked && existing ? existing.pred_home : input.home;
  const displayAway = locked && existing ? existing.pred_away : input.away;

  // Valid if one side = max and they're not equal
  const isValid = (input.home === max || input.away === max) && input.home !== input.away;

  const vamosTeam  = match.is_vamos_home ? match.home_team : match.away_team;
  const vamosLogo  = match.is_vamos_home ? match.home_logo : match.away_logo;
  const oppTeam    = match.is_vamos_home ? match.away_team : match.home_team;
  const oppLogo    = match.is_vamos_home ? match.away_logo : match.home_logo;

  return (
    <div className="bg-[#060d14] border border-[#1A1A1A] hover:border-[#42deef]/20 transition-all duration-300 overflow-hidden">
      {/* Top bar: season/week + date */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <span className="text-[#42deef] text-[10px] font-black uppercase tracking-widest">
            MPL MY {match.season}
          </span>
          {match.week && (
            <>
              <div className="w-px h-3 bg-[#2A2A2A]" />
              <span className="text-gray-600 text-[10px] uppercase tracking-widest">Week {match.week}</span>
            </>
          )}
          <div className="w-px h-3 bg-[#2A2A2A]" />
          <span className="bg-[#42deef]/10 border border-[#42deef]/20 text-[#42deef] text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
            {match.format}
          </span>
        </div>
        <div className="text-right">
          <p className="text-white text-xs font-black">{formatDate(match.match_date)}</p>
          <p className="text-gray-600 text-[10px]">{formatTime(match.match_date)}</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex items-center gap-6">

          {/* Teams + score inputs */}
          <div className="flex-1 flex items-center justify-between gap-4 min-w-0">

            {/* Home Team */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center shrink-0 overflow-hidden">
                {match.home_logo
                  ? <img src={match.home_logo} alt={match.home_team} className="w-8 h-8 object-contain" />
                  : <span className="text-gray-600 font-black text-xs">{match.home_team.slice(0, 2)}</span>
                }
              </div>
              <p className={`font-black text-sm uppercase tracking-wide truncate ${match.is_vamos_home ? 'text-[#42deef]' : 'text-white'}`}>
                {match.home_team}
              </p>
            </div>

            {/* Score inputs */}
            <div className="flex items-center gap-3 shrink-0">
              <ScoreInput
                value={locked ? displayHome : input.home}
                max={max}
                disabled={locked}
                onChange={(v) => onInput(v, input.away)}
                highlight={match.is_vamos_home}
              />
              <span className="text-gray-600 font-black text-xs">VS</span>
              <ScoreInput
                value={locked ? displayAway : input.away}
                max={max}
                disabled={locked}
                onChange={(v) => onInput(input.home, v)}
                highlight={!match.is_vamos_home}
              />
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3 min-w-0 flex-row-reverse md:flex-row">
              <div className="w-10 h-10 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center shrink-0 overflow-hidden">
                {match.away_logo
                  ? <img src={match.away_logo} alt={match.away_team} className="w-8 h-8 object-contain" />
                  : <span className="text-gray-600 font-black text-xs">{match.away_team.slice(0, 2)}</span>
                }
              </div>
              <p className={`font-black text-sm uppercase tracking-wide truncate ${!match.is_vamos_home ? 'text-[#42deef]' : 'text-white'}`}>
                {match.away_team}
              </p>
            </div>
          </div>

          {/* Submit area */}
          <div className="shrink-0 w-36 text-right">
            {!user ? (
              <Link href="/login?redirect=/predict"
                className="inline-block border border-[#42deef]/40 text-[#42deef] text-[10px] font-black uppercase tracking-widest px-3 py-2 hover:bg-[#42deef]/10 transition-colors">
                Login to Predict
              </Link>
            ) : locked ? (
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#42deef]/10 border border-[#42deef]/30 px-3 py-1.5">
                  <svg className="w-3 h-3 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#42deef] text-[10px] font-black uppercase tracking-widest">Submitted</span>
                </div>
                <p className="text-gray-600 text-[10px] mt-1.5 uppercase tracking-widest">
                  {existing?.pred_home} – {existing?.pred_away}
                </p>
              </div>
            ) : submitSuccess ? (
              <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-3 py-1.5">
                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Saved!</span>
              </div>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!isValid || submitting}
                className="w-full bg-[#42deef] text-[#0A0A0A] py-2.5 font-black text-[10px] uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? '...' : `Predict → +${POINTS_PER_CORRECT} pts`}
              </button>
            )}

            {!locked && !user && null}
            {!locked && user && !existing && (
              <p className="text-gray-700 text-[10px] mt-1.5 uppercase tracking-widest">
                {isValid ? 'Looks good!' : `Pick a valid ${match.format} score`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Score stepper ─────────────────────────────────────────────
function ScoreInput({ value, max, disabled, onChange, highlight }: {
  value: number; max: number; disabled: boolean;
  onChange: (v: number) => void; highlight: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {!disabled && (
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-6 h-5 flex items-center justify-center text-gray-500 hover:text-[#42deef] transition-colors text-xs"
        >▲</button>
      )}
      <div className={`w-10 h-10 flex items-center justify-center border font-black text-xl transition-colors ${
        highlight
          ? 'border-[#42deef]/60 bg-[#42deef]/10 text-[#42deef]'
          : disabled
          ? 'border-[#1A1A1A] bg-[#0A0A0A] text-white'
          : 'border-[#2A2A2A] bg-[#0A0A0A] text-white'
      }`}>
        {value}
      </div>
      {!disabled && (
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-5 flex items-center justify-center text-gray-500 hover:text-[#42deef] transition-colors text-xs"
        >▼</button>
      )}
    </div>
  );
}

// ── Past match result row ─────────────────────────────────────
function PastMatchRow({ match, prediction }: { match: DBMatch; prediction?: DBPrediction }) {
  const hasResult = match.home_score !== null && match.away_score !== null;

  return (
    <div className="bg-[#060d14] border border-[#1A1A1A] px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="text-right shrink-0">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest">{formatDate(match.match_date)}</p>
          <p className="text-[#42deef] text-[9px] font-black uppercase tracking-widest">{match.format}</p>
        </div>
        <div className="min-w-0">
          <p className="text-white font-black text-xs uppercase tracking-wide truncate">
            {match.home_team} <span className="text-gray-600 font-normal">vs</span> {match.away_team}
          </p>
          {hasResult && (
            <p className="text-gray-500 text-[10px] mt-0.5">
              Result: <span className="text-white font-black">{match.home_score} – {match.away_score}</span>
            </p>
          )}
        </div>
      </div>

      {/* Prediction result */}
      {prediction ? (
        <div className="text-right shrink-0">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">
            Your pick: <span className="text-white font-black">{prediction.pred_home} – {prediction.pred_away}</span>
          </p>
          {prediction.is_correct === true && (
            <span className="inline-flex items-center gap-1 text-green-400 text-[10px] font-black uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              +{POINTS_PER_CORRECT} pts
            </span>
          )}
          {prediction.is_correct === false && (
            <span className="inline-flex items-center gap-1 text-red-400 text-[10px] font-black uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Incorrect
            </span>
          )}
          {prediction.is_correct === null && (
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Pending result</span>
          )}
        </div>
      ) : (
        <p className="text-gray-700 text-[10px] uppercase tracking-widest shrink-0">No prediction</p>
      )}
    </div>
  );
}
