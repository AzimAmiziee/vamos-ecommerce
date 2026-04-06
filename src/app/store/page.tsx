'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Link from 'next/link';
import type { DBGame } from '@/lib/db/games';

const CATEGORIES = ['All', 'Mobile Game', 'PC Game', 'Voucher'] as const;
type Category = typeof CATEGORIES[number];

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [games, setGames] = useState<DBGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('games')
      .select('*, game_packages(*)')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setGames((data ?? []) as DBGame[]);
        setLoading(false);
      });
  }, []);

  const filtered = activeCategory === 'All'
    ? games
    : games.filter((g) => g.category === activeCategory);

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #040d14 0%, #07101a 50%, #040d14 100%)' }}>
        <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#42deef] opacity-[0.06] blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">Vamos Marketplace</span>
            <div className="h-px w-10 bg-[#42deef]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-4">
            Diamond <span className="text-shimmer">Top Up</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Cheapest game diamonds in Malaysia. Instant delivery. All major games supported.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: '⚡', label: 'Instant Delivery' },
              { icon: '🔒', label: 'Secure Payment' },
              { icon: '💎', label: 'Cheapest Price' },
              { icon: '🎮', label: `${loading ? '...' : games.length} Products` },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 bg-[#42deef]/10 border border-[#42deef]/20 px-4 py-2">
                <span>{b.icon}</span>
                <span className="text-[#42deef] text-xs font-black uppercase tracking-widest">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category tabs + Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const count = loading ? 0 : (cat === 'All' ? games.length : games.filter((g) => g.category === cat).length);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-5 py-2.5 font-black text-xs uppercase tracking-widest transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-[#42deef] text-[#0A0A0A] border-[#42deef] shadow-[0_0_20px_rgba(66,222,239,0.3)]'
                      : 'bg-transparent text-gray-400 border-[#1A1A1A] hover:border-[#42deef]/50 hover:text-white'
                  }`}
                >
                  {cat}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                    activeCategory === cat ? 'bg-[#0A0A0A]/20' : 'bg-[#1A1A1A] text-gray-600'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Games grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#060d14] border border-[#1A1A1A] h-64 animate-pulse" />
            ))}
            {!loading && filtered.map((game) => { return (
              <Link key={game.id} href={`/store/${game.slug}`} className="group block">
                <div className="relative overflow-hidden border border-[#1A1A1A] group-hover:border-transparent transition-all duration-500"
                  style={{ boxShadow: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${game.color}80, 0 8px 40px ${game.color}25`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.border = '1px solid #1A1A1A'; }}
                >
                  {/* Image area */}
                  <div className="relative h-52 overflow-hidden"
                    style={{ background: `linear-gradient(160deg, ${game.color_secondary} 0%, #060d14 100%)` }}>

                    {/* Game logo image */}
                    <img
                      src={game.image ?? ''}
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                    />

                    {/* Ambient glow behind image */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                        style={{ background: game.color }} />
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-[#0A0A0A]/80 backdrop-blur-sm border px-2 py-0.5 z-10"
                      style={{ borderColor: game.color + '60' }}>
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: game.color }}>
                        {game.category}
                      </span>
                    </div>

                    {/* Hover overlay — slides up from bottom */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out z-20"
                      style={{ background: `linear-gradient(to top, ${game.color_secondary}f0 0%, ${game.color_secondary}cc 100%)` }}>
                      <div className="px-4 py-4">
                        <p className="text-white font-black text-xs uppercase tracking-widest mb-1">{game.name}</p>
                        <p className="text-xs mb-3 font-black" style={{ color: game.color }}>
                          From RM {Math.min(...(game.game_packages ?? []).map(p => p.price)).toFixed(2)}
                        </p>
                        <div className="inline-flex items-center gap-2 text-[#0A0A0A] text-[11px] font-black uppercase tracking-widest px-4 py-2"
                          style={{ background: game.color }}>
                          Top Up Now →
                        </div>
                      </div>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#060d14] to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Bottom info bar */}
                  <div className="bg-[#060d14] px-4 py-3 flex items-center justify-between border-t border-[#1A1A1A]">
                    <div>
                      <h3 className="text-white font-black text-xs uppercase tracking-wide leading-tight group-hover:transition-colors"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = game.color)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                      >{game.name}</h3>
                      <p className="text-gray-600 text-[10px] mt-0.5">{game.currency} · {(game.game_packages ?? []).length} packages</p>
                    </div>
                    <span className="text-xs font-black" style={{ color: game.color }}>
                      RM {Math.min(...(game.game_packages ?? []).map(p => p.price)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ); })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-t border-[#1A1A1A]"
        style={{ background: 'linear-gradient(180deg, #060b10 0%, #0A0A0A 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">How It Works</span>
            <div className="h-px w-8 bg-[#42deef]" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase mb-12">Top Up In <span className="text-[#42deef]">3 Steps</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Select Game', desc: 'Choose your game and the diamond package you want to top up.' },
              { step: '02', title: 'Enter ID',    desc: 'Enter your Game ID or User ID. No password required.' },
              { step: '03', title: 'Pay & Done',  desc: 'Complete payment and receive your diamonds in 1–5 minutes.' },
            ].map((s) => (
              <div key={s.step} className="bg-[#060d14] border border-[#1A1A1A] hover:border-[#42deef]/40 p-8 transition-colors group">
                <div className="text-[#42deef]/15 font-black text-7xl mb-4 leading-none group-hover:text-[#42deef]/25 transition-colors">{s.step}</div>
                <h3 className="text-white font-black uppercase tracking-widest mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-6 px-4 text-center border-t border-[#1A1A1A]">
        <p className="text-gray-700 text-xs">All prices in Malaysian Ringgit (MYR) · Powered by Kedai Runcit Soloz · Instant delivery guaranteed</p>
      </div>
    </div>
  );
}
