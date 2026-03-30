'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/app/components/Header';

const ACHIEVEMENTS = [
  {
    year: '2022',
    items: [
      { title: 'Champion', event: 'MPL MY Season 10' },
      { title: 'Runner Up', event: 'MPL MY Season 9' },
      { title: '5th Place', event: 'MSC' },
      { title: '9th Place', event: 'M4 World Championship' },
      { title: '5th Place', event: 'One Esports MPLI' },
    ],
  },
  {
    year: '2023',
    items: [
      { title: 'Champion', event: 'MPL MY Season 12' },
      { title: '13th Place', event: 'M5 World Championship' },
      { title: '4th Place', event: 'One Esports MPLI' },
      { title: 'Silver Medal', event: '32nd SEA Games MLBB Men' },
    ],
  },
  {
    year: '2024',
    items: [
      { title: 'Runner Up', event: 'MPL MY Season 13' },
      { title: 'Runner Up', event: 'MPL MY Season 14' },
      { title: '7th Place', event: 'M6 World Championship' },
      { title: '5th Place', event: 'MSC EWC' },
      { title: '5th Place', event: 'Games of Future' },
    ],
  },
];

const PROGRAMS = [
  {
    tier: 'Beginner',
    format: 'Individual',
    pax: '1 Pax',
    description: 'Perfect for beginners looking to master the fundamentals of competitive Mobile Legends.',
    price: 70,
    originalPrice: 89,
    image: '/storage/academy/program-beginner.png',
    tag: 'Early Bird',
    available: true,
    features: [
      'Fundamental mechanics & positioning',
      'Hero role deep-dives',
      'Replay analysis sessions',
      'Mental & discipline coaching',
    ],
  },
  {
    tier: 'Beginner',
    format: 'Squad',
    pax: '5 Pax',
    description: 'Master the fundamentals and build real synergy with your squad under pro-level coaching.',
    price: 300,
    originalPrice: 395,
    image: '/storage/academy/program-beginner.png',
    tag: 'Best Value',
    available: true,
    features: [
      'Everything in Individual plan',
      'Team coordination & shot-calling',
      'Draft & meta strategy',
      'Scrim review sessions',
    ],
  },
  {
    tier: 'Intermediate',
    format: 'Individual',
    pax: '1 Pax',
    description: 'Learn advanced techniques and competitive strategies used by MPL professionals.',
    price: null,
    originalPrice: null,
    image: '/storage/academy/program-intermediate.png',
    tag: 'Coming Soon',
    available: false,
    features: [
      'Advanced mechanics mastery',
      'High-elo decision making',
      'Psychological resilience',
      'Tournament preparation',
    ],
  },
  {
    tier: 'Intermediate',
    format: 'Squad',
    pax: '5 Pax',
    description: 'Compete at the highest level with structured squad training from MPL champions.',
    price: null,
    originalPrice: null,
    image: '/storage/academy/program-intermediate.png',
    tag: 'Coming Soon',
    available: false,
    features: [
      'Everything in Individual plan',
      'Pro-level draft strategy',
      'VOD reviews vs pro teams',
      'Live coaching in scrims',
    ],
  },
];

export default function AcademyPage() {
  return (
    <div className="bg-[#040810] min-h-screen pt-20">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-[#040810]">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          {/* Left — text */}
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 border border-[#42deef]/20 bg-[#42deef]/5 px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42deef] animate-pulse" />
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">Official Esports Training</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none mb-4">
              Vamos<br /><span className="text-shimmer">Academy</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-8">
              Malaysia's premier esports development programme. Train like a pro under MPL champions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#programs"
                className="inline-flex items-center gap-3 bg-[#42deef] text-[#040810] px-8 py-4 font-black uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(66,222,239,0.4)] transition-all duration-300">
                View Programs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="#coach"
                className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 font-black uppercase tracking-widest text-sm hover:border-[#42deef]/50 hover:text-[#42deef] transition-all duration-300">
                Meet the Coach
              </Link>
            </div>
          </div>

          {/* Right — crest image, fully visible */}
          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src="/storage/academy/hero.png"
              alt="Vamos Academy Crest"
              width={1117}
              height={997}
              className="w-full max-w-sm md:max-w-full h-auto block"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="border-y border-[#0f1923]"
        style={{ background: 'linear-gradient(to right, #060d14, #07101a, #060d14)' }}>
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#0f1923]">
          {[
            { num: '3×', label: 'MPL MY Champions' },
            { num: '10+', label: 'Competitive Titles' },
            { num: '2', label: 'SEA Games Medals' },
            { num: '100%', label: 'Pro-Level Coaching' },
          ].map((s) => (
            <div key={s.label} className="text-center px-6 py-2">
              <p className="text-3xl font-black text-[#42deef]">{s.num}</p>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="relative overflow-hidden border border-[#1A1A1A] bg-[#060d14] p-10"
              style={{ boxShadow: '0 0 40px rgba(66,222,239,0.04)' }}>
              <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#42deef]" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#42deef] via-[#42deef]/30 to-transparent" />
              <div className="w-10 h-10 flex items-center justify-center border border-[#42deef]/30 bg-[#42deef]/5 mb-6">
                <svg className="w-5 h-5 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#42deef] mb-3">Our Mission</p>
              <ul className="space-y-3">
                {[
                  'Provide a professional-level training platform for youth interested in esports.',
                  'Combine technical training, discipline, and strategy as the foundation of a player\'s career.',
                  'Establish strategic collaborations with institutions, government agencies, and industry stakeholders.',
                  'Offer career pathways and character development through a structured esports framework.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                    <span className="text-[#42deef] font-black shrink-0 mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vision */}
            <div className="relative overflow-hidden border border-[#1A1A1A] bg-[#060d14] p-10"
              style={{ boxShadow: '0 0 40px rgba(167,139,250,0.04)' }}>
              <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-[#a78bfa]" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#a78bfa] via-[#a78bfa]/30 to-transparent" />
              <div className="w-10 h-10 flex items-center justify-center border border-[#a78bfa]/30 bg-[#a78bfa]/5 mb-6">
                <svg className="w-5 h-5 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a78bfa] mb-3">Our Vision</p>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">
                To become the leading esports development academy in Malaysia, dedicated to discovering, guiding, and producing professional players who are ethical and competitive at the international level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COACH PROFILE ────────────────────────────────────────── */}
      <section id="coach" className="py-24 px-6 border-t border-[#0f1923]"
        style={{ background: 'linear-gradient(180deg, #060b10 0%, #040810 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-10 bg-[#42deef]/60" />
            <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">Head Coach</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-12">
            The <span className="text-shimmer">Mastermind</span>
          </h2>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Coach photo */}
            <div className="md:col-span-2">
              <div className="relative overflow-hidden border border-[#1A1A1A]"
                style={{ boxShadow: '0 0 60px rgba(66,222,239,0.08)' }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#42deef] to-transparent z-10" />
                <Image
                  src="/storage/academy/coach-pabz.png"
                  alt="Coach Pabz"
                  width={500}
                  height={600}
                  className="w-full object-cover object-top"
                  style={{ aspectRatio: '4/5' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: 'linear-gradient(to top, rgba(4,8,16,0.95) 0%, transparent 100%)' }}>
                  <p className="text-[#42deef] text-[10px] font-black uppercase tracking-widest">Head Coach</p>
                  <p className="text-white font-black text-xl uppercase mt-0.5">Coach Pabz</p>
                  <p className="text-gray-500 text-xs mt-0.5">Khairul Azman bin Mohd Sharif</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="md:col-span-3 space-y-6">
              <div className="border border-[#1A1A1A] bg-[#060d14] p-6">
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Coach Pabz is one of Malaysia's most decorated Mobile Legends coaches, having guided teams to multiple MPL MY championships, SEA Games medals, and top placements on the world stage. Under his coaching philosophy of discipline, strategy, and mental fortitude, he has shaped dozens of aspiring players into professional competitors.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Now, through Vamos Academy, he brings the same system used at the highest level of Malaysian esports directly to the next generation.
                </p>
              </div>

              {/* Achievement timeline */}
              <div className="space-y-4">
                {ACHIEVEMENTS.map((yr) => (
                  <div key={yr.year} className="border border-[#1A1A1A] bg-[#060d14] overflow-hidden">
                    <div className="flex items-center gap-4 px-5 py-3 border-b border-[#1A1A1A]"
                      style={{ background: 'linear-gradient(to right, rgba(66,222,239,0.05), transparent)' }}>
                      <div className="text-[#42deef] font-black text-2xl">{yr.year}</div>
                      <div className="h-px flex-1 bg-[#1A1A1A]" />
                      <div className="text-gray-700 text-[10px] font-black uppercase tracking-widest">{yr.items.length} titles</div>
                    </div>
                    <div className="px-5 py-4 flex flex-wrap gap-2">
                      {yr.items.map((item) => (
                        <div key={item.event} className="flex items-center gap-2 border border-[#1A1A1A] px-3 py-1.5">
                          <span className="text-[#42deef] text-[10px] font-black uppercase tracking-widest shrink-0">{item.title}</span>
                          <span className="text-gray-600 text-[10px]">·</span>
                          <span className="text-gray-400 text-[10px]">{item.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────────────────────── */}
      <section id="programs" className="py-24 px-6 border-t border-[#0f1923]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-10 bg-[#42deef]/60" />
            <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">Training Programmes</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              Choose Your <span className="text-shimmer">Path</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-xs text-right">All sessions conducted online. Game: Mobile Legends: Bang Bang.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PROGRAMS.map((prog) => {
              const accent = prog.available ? '#42deef' : '#333';
              return (
                <div key={`${prog.tier}-${prog.format}`}
                  className={`relative overflow-hidden border flex flex-col transition-all duration-300 ${
                    prog.available ? 'border-[#1A1A1A] hover:border-[#42deef]/30' : 'border-[#111] opacity-60'
                  }`}
                  style={{
                    background: 'linear-gradient(145deg, #060d14 0%, #070f18 100%)',
                    boxShadow: prog.available ? undefined : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (prog.available)
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 1px rgba(66,222,239,0.3), 0 16px 50px rgba(66,222,239,0.06)';
                  }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
                >
                  {/* Top accent */}
                  <div className="h-[2px]" style={{
                    background: prog.available
                      ? 'linear-gradient(to right, transparent, #42deef, transparent)'
                      : 'linear-gradient(to right, transparent, #333, transparent)'
                  }} />

                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5"
                      style={prog.available
                        ? { background: prog.tag === 'Best Value' ? '#f59e0b' : '#42deef', color: '#040810' }
                        : { background: '#1A1A1A', color: '#666' }
                      }>{prog.tag}</span>
                  </div>

                  {/* Program image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={prog.image}
                      alt={`${prog.tier} ${prog.format}`}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, #060d14 0%, transparent 60%)' }} />
                    {!prog.available && (
                      <div className="absolute inset-0 bg-[#040810]/60 flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-black uppercase tracking-widest border border-[#333] px-4 py-2">Coming Soon</span>
                      </div>
                    )}
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 border"
                          style={{ borderColor: `${accent}30`, color: accent, background: `${accent}0d` }}>
                          {prog.tier}
                        </span>
                        <span className="text-gray-600 text-[10px]">{prog.pax}</span>
                      </div>
                      <h3 className="text-white font-black text-xl uppercase tracking-tight">{prog.format} Plan</h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{prog.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-6 flex-1">
                      {prog.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke={prog.available ? '#42deef' : '#444'} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={prog.available ? 'text-gray-400' : 'text-gray-700'}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price + CTA */}
                    <div className="border-t border-[#1A1A1A] pt-5 flex items-center justify-between gap-4">
                      {prog.price ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-white">RM {prog.price}</span>
                            {prog.originalPrice && (
                              <span className="text-gray-600 text-sm line-through">RM {prog.originalPrice}</span>
                            )}
                          </div>
                          <p className="text-[#42deef] text-[10px] font-black uppercase tracking-widest mt-0.5">
                            Save RM {(prog.originalPrice ?? 0) - prog.price} · Early Bird
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 font-black text-sm uppercase tracking-widest">TBA</p>
                          <p className="text-gray-700 text-[10px] mt-0.5">Price to be announced</p>
                        </div>
                      )}

                      {prog.available ? (
                        <a href="#programs"
                          className="px-6 py-3 bg-[#42deef] text-[#040810] font-black uppercase tracking-widest text-xs hover:shadow-[0_0_25px_rgba(66,222,239,0.4)] transition-all duration-200 shrink-0">
                          Enroll Now →
                        </a>
                      ) : (
                        <button disabled
                          className="px-6 py-3 border border-[#1A1A1A] text-gray-600 font-black uppercase tracking-widest text-xs cursor-not-allowed shrink-0">
                          Notify Me
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border border-[#42deef]/15 bg-[#42deef]/5 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <svg className="w-4 h-4 text-[#42deef] shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-xs leading-relaxed">
              All programs are conducted online via Discord & custom coaching tools. Sessions are scheduled weekly. For group/institutional enquiries, contact us at <span className="text-[#42deef]">academy@teamvamos.gg</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY VAMOS ACADEMY ────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-[#0f1923]"
        style={{ background: 'linear-gradient(180deg, #060b10 0%, #040810 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#42deef]/40" />
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase">Why Train With Us</span>
              <div className="h-px w-12 bg-[#42deef]/40" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase">The Vamos <span className="text-shimmer">Difference</span></h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: '🏆',
                title: 'Coached by Champions',
                desc: 'Learn directly from Coach Pabz — the mastermind behind multiple MPL MY championship wins and international placements.',
              },
              {
                icon: '📊',
                title: 'Data-Driven Training',
                desc: 'Every session backed by replay analysis, performance metrics, and structured feedback loops used by MPL professionals.',
              },
              {
                icon: '🧠',
                title: 'Mental & Discipline',
                desc: 'Beyond mechanics — we build the mental toughness, team discipline, and competitive mindset needed at the pro level.',
              },
              {
                icon: '🤝',
                title: 'Industry Network',
                desc: 'Strategic collaborations with institutions, government agencies, and esports industry stakeholders open real career pathways.',
              },
              {
                icon: '🎯',
                title: 'Structured Framework',
                desc: 'A complete progression system from beginner to competitive. Clear milestones, curriculum, and character development built in.',
              },
              {
                icon: '🌏',
                title: 'International Standard',
                desc: 'Our curriculum is benchmarked against international esports training programmes, preparing players for regional and world stages.',
              },
            ].map((card) => (
              <div key={card.title}
                className="border border-[#1A1A1A] bg-[#060d14] p-7 hover:border-[#42deef]/20 transition-all group"
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 30px rgba(66,222,239,0.05)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest mb-2 group-hover:text-[#42deef] transition-colors">{card.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[#0f1923]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden border border-[#42deef]/20 p-12 md:p-16"
            style={{ background: 'linear-gradient(135deg, #040e16 0%, #07121c 50%, #040e16 100%)', boxShadow: '0 0 80px rgba(66,222,239,0.06)' }}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#42deef] to-transparent" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(66,222,239,0.08) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <p className="text-[#42deef] text-[10px] font-black tracking-[0.4em] uppercase mb-4">Limited Slots Available</p>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                Ready to Go <span className="text-shimmer">Pro?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                Join Vamos Academy today. Early bird pricing is limited — secure your slot before it runs out.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#programs"
                  className="inline-flex items-center gap-3 bg-[#42deef] text-[#040810] px-10 py-4 font-black uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(66,222,239,0.4)] transition-all duration-300">
                  Enroll Now — From RM 70
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 border border-white/20 text-gray-400 px-8 py-4 font-black uppercase tracking-widest text-sm hover:border-[#42deef]/40 hover:text-white transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 px-6 border-t border-[#0f1923] text-center">
        <p className="text-gray-700 text-xs">Vamos Academy · Mobile Legends: Bang Bang · Malaysia · academy@teamvamos.gg</p>
      </div>
    </div>
  );
}
