'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { createTopupOrder } from '@/lib/db/orders';
import { useAuth } from '@/app/providers';
import type { DBGame, DBGamePackage } from '@/lib/db/games';

export default function GameStorePage() {
  const params = useParams();
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [game, setGame] = useState<DBGame | null>(null);
  const [allGames, setAllGames] = useState<DBGame[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPackage, setSelectedPackage] = useState<DBGamePackage | null>(null);
  const [userId, setUserId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const slug = params.game as string;
    Promise.all([
      supabase.from('games').select('*, game_packages(*)').eq('slug', slug).eq('active', true).single(),
      supabase.from('games').select('*, game_packages(*)').eq('active', true).order('sort_order', { ascending: true }),
    ]).then(([gameRes, allRes]) => {
      if (gameRes.data) {
        const g = gameRes.data as DBGame;
        if (g.game_packages) g.game_packages = g.game_packages.sort((a, b) => a.sort_order - b.sort_order);
        setGame(g);
      }
      setAllGames((allRes.data ?? []) as DBGame[]);
      setLoading(false);
    });
  }, [params.game]);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!selectedPackage || !userId.trim() || !game) return;

    if (!user) {
      router.push(`/login?redirect=/store/${game.slug}`);
      return;
    }

    setSubmitting(true);

    await createTopupOrder({
      userId: user.id,
      gameId: game.id,
      packageId: selectedPackage.id,
      gameName: game.name,
      packageAmount: selectedPackage.amount,
      price: selectedPackage.price,
      gameUserId: userId,
    });
    await refreshProfile();

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen pt-20">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="h-40 bg-[#060d14] border border-[#1A1A1A] animate-pulse mb-8" />
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 h-96 bg-[#060d14] border border-[#1A1A1A] animate-pulse" />
            <div className="h-64 bg-[#060d14] border border-[#1A1A1A] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen pt-20 flex items-center justify-center">
        <Header />
        <div className="text-center">
          <p className="text-gray-500 mb-4">Game not found.</p>
          <Link href="/store" className="text-[#42deef] font-black uppercase text-xs tracking-widest hover:underline">← Back to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-14 px-4"
        style={{ background: `linear-gradient(135deg, #040d14 0%, ${game.color_secondary}55 60%, #040d14 100%)` }}>
        <div className="absolute inset-0 bg-grid-lines opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: game.color }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/store" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#42deef] text-xs uppercase tracking-widest font-black mb-8 transition-colors">
            ← Back to Store
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 border flex items-center justify-center shrink-0 overflow-hidden"
              style={{ borderColor: game.color + '60', background: `linear-gradient(135deg, ${game.color_secondary}, ${game.color}22)` }}>
              {game.image && (
                <img src={game.image} alt={game.name} className="w-full h-full object-contain p-2 drop-shadow-lg" />
              )}
            </div>
            <div>
              <div className="inline-block border px-3 py-1 mb-2"
                style={{ borderColor: game.color + '40', background: game.color + '15' }}>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: game.color }}>{game.category}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{game.name}</h1>
              <p className="text-gray-400 text-sm mt-1">{game.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {submitted ? (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-16 h-16 border-2 border-[#42deef] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white uppercase mb-3">Order Received!</h2>
              <p className="text-gray-400 text-sm mb-1">
                <span className="font-black" style={{ color: game.color }}>{selectedPackage?.amount}</span> for <span className="text-white font-black">{game.name}</span>
              </p>
              <p className="text-gray-600 text-xs mb-5">User ID: {userId} · Your {game.currency} will arrive in 1–5 minutes.</p>

              <div className="bg-[#42deef]/8 border border-[#42deef]/25 px-6 py-4 mb-8 text-left">
                <p className="text-[#42deef] text-[10px] font-black uppercase tracking-widest mb-1">Points Earned</p>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-black">RM {selectedPackage?.price.toFixed(2)} purchase</span>
                  <span className="text-2xl font-black" style={{ color: '#42deef' }}>+{Math.floor(selectedPackage?.price ?? 0)} pts</span>
                </div>
                <p className="text-gray-600 text-[10px] mt-2">
                  {user ? 'Points added to your account · ' : 'Log in to track your points · '}
                  <a href="/redeem" className="text-[#42deef] hover:underline">View rewards →</a>
                </p>
              </div>

              <button
                onClick={() => { setSubmitted(false); setSelectedPackage(null); setUserId(''); }}
                className="border border-[#42deef] text-[#42deef] px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#42deef] hover:text-[#0A0A0A] transition-colors"
              >
                Top Up Again
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">

              {/* Package selector */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-black text-white uppercase mb-1">
                  Select <span style={{ color: game.color }}>Package</span>
                </h2>
                <p className="text-gray-600 text-xs uppercase tracking-widest mb-6">
                  {game.currency} · {(game.game_packages ?? []).length} options
                </p>

                {(['currency', 'subscription', 'bundle'] as const).map((type) => {
                  const pkgs = (game.game_packages ?? []).filter(p => (p.package_type ?? 'currency') === type);
                  if (!pkgs.length) return null;
                  const labels: Record<string, string> = {
                    currency: game.currency,
                    subscription: 'Subscriptions & Passes',
                    bundle: 'Bundles',
                  };
                  return (
                    <div key={type} className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{labels[type]}</span>
                        <div className="flex-1 h-px bg-[#1A1A1A]" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {pkgs.map((pkg) => (
                          <button
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            className={`relative text-left p-4 border transition-all duration-200 ${
                              selectedPackage?.id === pkg.id
                                ? 'bg-[#060d14]'
                                : 'border-[#1A1A1A] bg-[#060d14] hover:border-[#333]'
                            }`}
                            style={selectedPackage?.id === pkg.id ? {
                              borderColor: game.color,
                              boxShadow: `0 0 20px ${game.color}25`,
                            } : undefined}
                          >
                            {pkg.popular && (
                              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: game.color }} />
                            )}
                            {pkg.popular && (
                              <div className="absolute top-2 right-2 text-[#0A0A0A] text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5"
                                style={{ background: game.color }}>
                                Popular
                              </div>
                            )}
                            <div className="text-white font-black text-sm mb-1 pr-8 leading-tight">{pkg.amount}</div>
                            {pkg.bonus && (
                              <div className="text-xs font-black mb-1" style={{ color: game.color }}>Bonus {pkg.bonus}</div>
                            )}
                            <div className="font-black text-lg" style={{ color: game.color }}>RM {pkg.price.toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order form */}
              <div>
                <h2 className="text-xl font-black text-white uppercase mb-6">
                  Complete <span className="text-[#42deef]">Order</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className={`p-4 border transition-all ${selectedPackage ? 'border-[#42deef]/40 bg-[#42deef]/5' : 'border-[#1A1A1A] bg-[#060d14]'}`}>
                    {selectedPackage ? (
                      <>
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Selected Package</p>
                        <p className="text-white font-black text-sm">{selectedPackage.amount}</p>
                        {selectedPackage.bonus && (
                          <p className="text-xs font-black mt-0.5" style={{ color: game.color }}>Bonus {selectedPackage.bonus}</p>
                        )}
                        <p className="font-black text-2xl mt-1 text-[#42deef]">RM {selectedPackage.price.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-gray-600 text-sm">← Select a package first</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-black">
                      {game.name} User ID
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter your User ID"
                      className="w-full px-4 py-3 bg-[#060d14] border border-[#1A1A1A] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                      required
                    />
                    <p className="text-gray-700 text-[10px] mt-1.5">No password required · ID only</p>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedPackage || !userId.trim() || submitting}
                    className="btn-premium w-full bg-[#42deef] text-[#0A0A0A] py-4 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] hover:shadow-[0_0_24px_rgba(66,222,239,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : !selectedPackage ? 'Select a Package' : !user ? 'Login to Top Up' : `Pay RM ${selectedPackage.price.toFixed(2)}`}
                  </button>

                  {selectedPackage && (
                    <div className="bg-[#42deef]/5 border border-[#42deef]/20 px-4 py-3 flex items-center justify-between">
                      <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">Points Earned</span>
                      <span className="text-[#42deef] font-black text-sm">+{Math.floor(selectedPackage.price)} pts</span>
                    </div>
                  )}

                  <div className="border border-[#1A1A1A] p-3 space-y-1.5">
                    {['⚡ Delivery in 1–5 minutes', '🔒 No password required', '💎 Guaranteed lowest price'].map((t) => (
                      <p key={t} className="text-gray-600 text-[11px]">{t}</p>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Other games */}
      <section className="py-10 px-4 border-t border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-5">Other <span className="text-[#42deef]">Games</span></h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {allGames.filter((g) => g.id !== game.id).map((g) => (
              <Link key={g.id} href={`/store/${g.slug}`} className="group">
                <div className="border border-[#1A1A1A] group-hover:border-transparent transition-all duration-300 overflow-hidden"
                  style={{ boxShadow: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${g.color}80, 0 4px 20px ${g.color}20`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.border = '1px solid #1A1A1A'; }}
                >
                  <div className="h-16 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${g.color_secondary}, ${g.color}22)` }}>
                    {g.image && (
                      <img src={g.image} alt={g.name}
                        className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110 drop-shadow-lg" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                        style={{ background: g.color }} />
                    </div>
                  </div>
                  <div className="px-2 py-1.5 bg-[#060d14]">
                    <p className="text-[10px] font-black uppercase truncate transition-colors duration-200" style={{ color: 'white' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = g.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                    >{g.short_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
