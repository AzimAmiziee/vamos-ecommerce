'use client';

import Header from '@/app/components/Header';
import { products } from '@/app/data/products';
import type { Product } from '@/app/data/products';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

type EditorialCardProps = {
  product: Product;
  className?: string;
};

function EditorialCard({ product, className = "" }: EditorialCardProps) {
  const [hovered, setHovered] = useState(false);
  const img = hovered && product.hoverImage ? product.hoverImage : product.image;

  return (
    <a
      href="/products"
      className={`relative block w-full h-full overflow-hidden group bg-[#0a0a0a] ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={img}
        alt={product.name}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />

      {/* Price chip */}
      <div className="absolute top-0 left-0 bg-[#42deef] text-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10">
        RM {product.price}
      </div>

      {/* Collection chip */}
      <div className="absolute top-0 right-0 bg-black/65 text-gray-400 px-3 py-1.5 text-[9px] uppercase tracking-widest z-10 backdrop-blur-sm">
        {product.collection}
      </div>

      {/* Hover curtain */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-end p-5 z-20">
        <div className="text-[#42deef] text-[9px] font-black uppercase tracking-[0.35em] mb-1">
          {product.category}
        </div>
        <h3 className="text-white font-black uppercase leading-tight mb-4 text-sm lg:text-base">
          {product.name}
        </h3>
        <span className="inline-flex items-center gap-2 bg-[#42deef] text-black px-5 py-2.5 font-black text-[10px] uppercase tracking-[0.3em] w-fit">
          Shop Now <span>→</span>
        </span>
      </div>
    </a>
  );
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [partnerForm, setPartnerForm] = useState({ name: '', company: '', email: '', message: '' });
  const [partnerStatus, setPartnerStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');

  useEffect(() => {
    setFeaturedProducts(products.slice(0, 6));
  }, []);

  const handlePartnerSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setPartnerStatus('loading');
    const res = await fetch('/api/inquiries', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ type: 'partnership', ...partnerForm }),
    });
    if (res.ok) {
      setPartnerStatus('success');
      setPartnerForm({ name: '', company: '', email: '', message: '' });
    } else {
      setPartnerStatus('error');
    }
  };

  const handleSubscribe = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubStatus('loading');
    const res = await fetch('/api/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: subEmail }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSubStatus('success');
      setSubEmail('');
    } else if (data.error === 'duplicate') {
      setSubStatus('duplicate');
    } else {
      setSubStatus('error');
    }
  };

  /* Scroll reveal observer */
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const [heroMode, setHeroMode] = useState<'image' | 'video'>('video');
  const videoRef = useRef<HTMLVideoElement>(null);
  const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToImage = () => {
    setHeroMode('image');
    cycleTimer.current = setTimeout(() => setHeroMode('video'), 5000);
  };

  useEffect(() => {
    if (heroMode === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [heroMode]);

  useEffect(() => {
    return () => { if (cycleTimer.current) clearTimeout(cycleTimer.current); };
  }, []);

  const MARQUEE_WORDS = [
    'MPL MALAYSIA', 'TEAM VAMOS', 'SEASON 15', 'FEARLESS',
    'OFFICIAL STORE', 'REP YOUR TEAM', 'OWN THE BATTLEFIELD',
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">

      <Header />

      {/* ══════════════════════════════════════════════════
          HERO — Full Screen Cinematic
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

        {/* Background — image */}
        <div className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${heroMode === 'image' ? 'opacity-100' : 'opacity-0'}`}>
          <img
            src="/background.webp"
            alt=""
            className="w-full h-full object-cover object-center anim-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />
        </div>

        {/* Background — video */}
        <div className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${heroMode === 'video' ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={goToImage}
            className="w-full h-full object-cover object-center"
          >
            <source src="/brand_assets/vamos-bg-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />
        </div>

        {/* Subtle noise */}
        <div className="absolute inset-0 noise-overlay pointer-events-none" />

        {/* Content — bottom anchored */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 sm:px-14 lg:px-20 pb-16 pt-36">

          {/* Overline */}
          <div className="hero-fade hero-d1 flex items-center gap-4 mb-10">
            <div className="w-2 h-2 rounded-full bg-[#42deef] anim-glow-pulse shrink-0" />
            <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">
              <span className="block md:hidden">MPL Malaysia<br />Official Esports Store</span>
              <span className="hidden md:inline">MPL Malaysia · Official Esports Store</span>
            </span>
          </div>

          {/* Headline */}
          <div className="overflow-hidden hero-fade hero-d2 mb-0">
            <h1
              className="font-black uppercase leading-[0.83] tracking-[-0.02em] text-white/10"
              style={{
                fontSize: 'clamp(3rem, 10vw, 10rem)',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.55)',
                color: 'transparent',
              }}
            >
              TEAM
            </h1>
          </div>
          <div className="overflow-hidden hero-fade hero-d3">
            <h1
              className="font-black uppercase leading-[0.83] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(3rem, 10vw, 10rem)', color: '#42deef' }}
            >
              VAMOS
            </h1>
          </div>

          {/* Bottom row */}
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 hero-fade hero-d4">
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Fearless. Competitive. Unstoppable.<br />
              Rep your team. Own the battlefield.
            </p>
            <div className="flex flex-col sm:flex-row gap-0 shrink-0">
              <a
                href="#shop"
                className="bg-[#42deef] text-black px-10 py-4 font-black text-[11px] tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300"
              >
                Shop Now
              </a>
              <a
                href="/products"
                className="border border-white/25 text-white px-10 py-4 font-black text-[11px] tracking-[0.3em] uppercase hover:bg-white/8 hover:border-white/50 transition-all duration-300"
              >
                Full Collection
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-10 hero-fade hero-d6 hidden md:flex flex-col items-center gap-3">
          <span className="text-[9px] text-gray-500 uppercase tracking-[0.4em] rotate-90 mb-4">Scroll</span>
          <div className="w-px h-14 bg-gradient-to-b from-[#42deef] to-transparent anim-scroll-line" />
        </div>

        {/* Hero mode toggle */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-2 hero-fade hero-d5">
          <button
            onClick={() => setHeroMode('image')}
            title="Photo"
            className={`w-9 h-9 flex items-center justify-center border transition-all duration-300 ${
              heroMode === 'image'
                ? 'bg-[#42deef] border-[#42deef] text-black'
                : 'border-white/25 text-white/40 hover:border-white/60 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <button
            onClick={() => setHeroMode('video')}
            title="Video"
            className={`w-9 h-9 flex items-center justify-center border transition-all duration-300 ${
              heroMode === 'video'
                ? 'bg-[#42deef] border-[#42deef] text-black'
                : 'border-white/25 text-white/40 hover:border-white/60 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </button>
        </div>

        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════
          MARQUEE STRIP
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#42deef] py-3.5 overflow-hidden border-y border-[#42deef]">
        <div
          className="flex anim-marquee whitespace-nowrap"
          style={{ width: 'max-content', animationDuration: '16s' }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {MARQUEE_WORDS.map((word, j) => (
                <span key={j} className="text-black font-black text-[11px] tracking-[0.45em] uppercase mx-5">
                  {word} <span className="opacity-20 mx-2">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════ */}
      <section className="bg-black reveal" data-reveal>
        <div className="max-w-[1600px] mx-auto px-8 sm:px-14 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {[
              { label: 'Season Wins', value: '12+', sub: 'and counting' },
              { label: 'MPL Titles',  value: '2',   sub: 'back to back' },
              { label: 'Community',   value: '50K+', sub: 'strong & growing' },
              { label: 'Team',        value: '10',   sub: 'elite players' },
            ].map((s) => (
              <div key={s.label} className="group py-12 px-8 hover:bg-white/[0.02] transition-colors duration-500 cursor-default">
                <div
                  className="font-black leading-none tracking-tighter mb-2 group-hover:text-white transition-colors duration-300"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#42deef' }}
                >
                  {s.value}
                </div>
                <div className="text-white text-xs font-black uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-gray-600 text-[10px] uppercase tracking-widest">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-px bg-white/[0.06]" />
      </section>

      {/* ══════════════════════════════════════════════════
          PRODUCTS — Editorial layout
      ══════════════════════════════════════════════════ */}
      <section id="shop" className="bg-white pt-24 pb-28 relative overflow-hidden" data-header-theme="light">
        <div
          className="absolute -bottom-8 right-0 font-black uppercase leading-none select-none pointer-events-none"
          style={{
            fontSize: 'clamp(8rem, 28vw, 26rem)',
            WebkitTextStroke: '1px rgba(0,0,0,0.035)',
            color: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          DROPS
        </div>

        <div className="max-w-[1600px] mx-auto px-8 sm:px-14 lg:px-20 relative z-10">
          <div className="flex items-end justify-between mb-2 reveal" data-reveal>
            <div>
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">
                Official Merchandise
              </span>
              <div className="mt-2">
                <span
                  className="font-black uppercase leading-[0.88] tracking-tighter block mask-clip"
                  style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)' }}
                >
                  <span className="mask-clip-inner d1 inline-block">
                    <span style={{ WebkitTextStroke: '1.5px #000', color: 'transparent' }}>LATEST&nbsp;</span>
                    <span className="text-black">DROPS</span>
                  </span>
                </span>
              </div>
            </div>

            <a
              href="/products"
              className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover-underline hover:text-black transition-colors duration-300 hidden md:block pb-3"
            >
              View All →
            </a>
          </div>

          <div className="w-full h-px bg-black/8 mb-6" />

          {featuredProducts.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {/* Row 1 */}
              <div className="flex gap-1.5 min-h-0" style={{ height: 'clamp(420px, 58vh, 640px)' }}>
                <div className="w-[42%] h-full min-h-0">
                  {featuredProducts[0] && (
                    <EditorialCard product={featuredProducts[0]} className="h-full" />
                  )}
                </div>
                <div className="w-[58%] h-full flex flex-row gap-1.5 min-h-0">
                  <div className="flex-1 min-h-0">
                    {featuredProducts[1] && (
                      <EditorialCard product={featuredProducts[1]} className="h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-h-0">
                    {featuredProducts[2] && (
                      <EditorialCard product={featuredProducts[2]} className="h-full" />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex gap-1.5 min-h-0" style={{ height: 'clamp(260px, 36vh, 420px)' }}>
                {featuredProducts.slice(3, 6).map((product) => (
                  <div key={product.id} className="flex-1 h-full min-h-0">
                    <EditorialCard product={product} className="h-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1.5 h-[480px]">
                <div className="w-[42%] bg-black/5 animate-pulse" />
                <div className="w-[58%] flex flex-col gap-1.5">
                  <div className="flex-1 bg-black/5 animate-pulse" />
                  <div className="flex-1 bg-black/5 animate-pulse" />
                </div>
              </div>
              <div className="flex gap-1.5 h-[300px]">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex-1 bg-black/5 animate-pulse" />
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <a
              href="/products"
              className="inline-block border-2 border-black text-black px-10 py-4 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors duration-300"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BRAND STORY
      ══════════════════════════════════════════════════ */}
      <section className="flex flex-col md:flex-row min-h-[85vh]">
        <div
          className="relative w-full md:w-1/2 h-80 md:h-auto min-h-[450px] overflow-hidden reveal-left"
          data-reveal
        >
          <Image
            src="/about-us.webp"
            alt="Team Vamos"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute top-0 right-0 w-14 h-14 bg-[#42deef] z-10" />
          <div className="absolute bottom-0 left-0 w-7 h-7 bg-[#42deef] z-10" />
        </div>

        <div className="w-full md:w-1/2 bg-black flex items-center reveal" data-reveal>
          <div className="px-10 lg:px-16 xl:px-20 py-16 lg:py-24">
            <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">Our Story</span>

            <div className="mt-4 mb-8 space-y-0">
              {['Born From', 'Malaysian', 'Esports'].map((line, i) => (
                <div key={i} className="mask-clip">
                  <span
                    className={`mask-clip-inner d${i + 1} block font-black text-white uppercase leading-[0.9] tracking-tighter`}
                    style={{
                      fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
                      color: i === 2 ? '#42deef' : undefined,
                    }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-gray-400 leading-relaxed mb-4 max-w-sm">
              Team Vamos represents the heart of Malaysian competitive gaming.
              Built on passion, discipline, and relentless drive — we compete in
              MPL MY to bring pride to every fan.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-12 max-w-sm">
              Every piece of merch you wear is a statement — you stand with us,
              believe in the grind, and share our hunger to dominate.
            </p>

            <a
              href="/products"
              className="btn-wipe inline-block border border-[#42deef] text-[#42deef] px-10 py-4 font-black text-[11px] uppercase tracking-[0.3em]"
            >
              Shop The Collection
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DOUBLE MARQUEE
      ══════════════════════════════════════════════════ */}
      <div className="overflow-hidden">
        <div className="bg-black py-3 border-y border-white/[0.06] overflow-hidden">
          <div
            className="flex anim-marquee whitespace-nowrap"
            style={{ width: 'max-content', animationDuration: '20s' }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                {MARQUEE_WORDS.map((word, j) => (
                  <span key={j} className="text-white/20 font-black text-[11px] tracking-[0.45em] uppercase mx-5">
                    {word} <span className="opacity-40 mx-2">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#42deef] py-3 overflow-hidden">
          <div
            className="flex anim-marquee-rev whitespace-nowrap"
            style={{ width: 'max-content', animationDuration: '20s' }}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                {[...MARQUEE_WORDS].reverse().map((word, j) => (
                  <span key={j} className="text-black/40 font-black text-[11px] tracking-[0.45em] uppercase mx-5">
                    {word} <span className="opacity-40 mx-2">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          FORZA VAMOS
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center reveal" data-reveal>
        <div className="absolute inset-0">
          <img
            src="/forza-vamos.webp"
            alt="Forza Vamos community"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/93 via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
          <div className="absolute inset-0 noise-overlay" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 sm:px-14 lg:px-20 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 border border-[#42deef]/40 bg-[#42deef]/8 px-4 py-2 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42deef] anim-glow-pulse shrink-0" />
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.45em] uppercase">Fan Community</span>
            </div>

            <h2
              className="font-black text-white uppercase leading-none"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
            >
              FORZA
            </h2>
            <h2
              className="font-black uppercase leading-none mb-10"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: '#42deef' }}
            >
              VAMOS
            </h2>

            <p className="text-gray-300 text-base leading-relaxed mb-2 max-w-md">
              The official Team Vamos fan community. Follow every match, get the latest
              news, exclusive updates and connect with thousands of supporters.
            </p>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-10">
              Join 2,000+ fans already in the group
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://t.me/ForzaVamos/2616"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#42deef] text-black px-8 py-4 font-black text-[11px] tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Join Forza Vamos
              </a>
              <a
                href="/news"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 font-black text-[11px] tracking-[0.25em] uppercase hover:bg-white/8 hover:border-white/60 transition-all duration-300"
              >
                Latest News →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SPONSORS
      ══════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-black reveal" data-reveal>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#42deef]" />
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">Powered By</span>
              <div className="h-px w-8 bg-[#42deef]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Our <span style={{ color: '#42deef' }}>Sponsors</span>
            </h2>
            <p className="text-gray-600 text-sm mt-3">
              The brands and partners that fuel our journey to the top.
            </p>
          </div>

          <div className="relative overflow-hidden mb-12">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            <div className="flex anim-marquee" style={{ width: 'max-content' }}>
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center">
                  {[
                    '/Sponsor-01.webp', '/Sponsor-02.webp', '/Sponsor-03.webp',
                    '/Sponsor-04.webp', '/Sponsor-05.webp', '/Sponsor-06.webp',
                    '/Sponsor-07.webp',
                  ].map((src, i) => (
                    <div key={i} className="flex items-center justify-center w-96 h-48 mx-8 group shrink-0">
                      <img
                        src={src}
                        alt="Sponsor"
                        className="max-h-40 max-w-full object-contain opacity-40 group-hover:opacity-100 transition-opacity duration-400"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-10 border-t border-white/[0.06]">
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-5">
              Interested in partnering with Team Vamos?
            </p>
            <a
              href="mailto:admin@vamos.com.my"
              className="btn-wipe inline-block border border-[#42deef] text-[#42deef] px-10 py-3.5 font-black text-[11px] uppercase tracking-[0.3em]"
            >
              Become a Sponsor
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          YOUTUBE
      ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-white reveal" data-reveal data-header-theme="light">
        <div className="max-w-[1600px] mx-auto px-8 sm:px-14 lg:px-20">
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">Watch Us Play</span>
              <h2
                className="font-black text-black uppercase mt-2 leading-none tracking-tighter"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
              >
                Latest{' '}
                <span style={{ WebkitTextStroke: '1.5px #000', color: 'transparent' }}>
                  Highlights
                </span>
              </h2>
            </div>
          </div>
          <div className="w-full h-px bg-black/8 mb-12" />
          <div className="grid md:grid-cols-2 gap-5">
            {['EGFnvXaMnSY', 'VbGflD4nBeM', 'oxE1ZP1dfp0', 'O9nB5kGJCNI'].map((videoId) => (
              <div
                key={videoId}
                className="aspect-video overflow-hidden border border-black/8 card-lift"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`Team Vamos highlight ${videoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SOCIAL
      ══════════════════════════════════════════════════ */}
      <section className="bg-black reveal" data-reveal>
        <div className="max-w-[1600px] mx-auto px-8 sm:px-14 lg:px-20 pt-20 pb-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">Follow the Journey</span>
              <h2
                className="font-black text-white uppercase mt-2 leading-none tracking-tighter"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Our{' '}
                <span style={{ color: '#42deef' }}>Community</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#42deef]/15">
          {[
            {
              href: 'https://www.tiktok.com/@officialteamvamos',
              count: '127K', label: 'Followers', platform: 'TikTok', handle: '@officialteamvamos',
              icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.81 1.54V6.77a4.85 4.85 0 01-1.04-.08z" /></svg>,
            },
            {
              href: 'https://www.youtube.com/@officialteamvamos',
              count: '25.1K', label: 'Subscribers', platform: 'YouTube', handle: '@officialteamvamos',
              icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 00.5 6.19 31.7 31.7 0 000 12a31.7 31.7 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.45 20.5 12 20.5 12 20.5s7.55 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.7 31.7 0 0024 12a31.7 31.7 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>,
            },
            {
              href: 'https://www.instagram.com/officialteamvamos/',
              count: '48.5K', label: 'Followers', platform: 'Instagram', handle: '@officialteamvamos',
              icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
            },
          ].map((s) => (
            <a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-[#080808] transition-colors duration-400 p-12 flex flex-col items-start group"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-8 text-gray-600 group-hover:text-[#42deef] transition-colors duration-300">
                {s.icon}
              </div>
              <div
                className="font-black text-white leading-none mb-2 tracking-tighter group-hover:text-[#42deef] transition-colors duration-300"
                style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
              >
                {s.count}
              </div>
              <div className="text-gray-600 text-[10px] uppercase tracking-[0.35em] mb-6">{s.label}</div>
              <div className="mt-auto">
                <div className="text-white font-black text-xs uppercase tracking-widest mb-1">{s.platform}</div>
                <div className="text-gray-700 text-xs hover-underline">{s.handle}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMMUNITY CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-8 bg-[#42deef] reveal" data-reveal data-header-theme="light">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-black text-black uppercase leading-none tracking-tighter mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            Stay<br />Connected
          </h2>
          <p className="text-black/60 text-sm mb-10 max-w-sm mx-auto">
            Get early access to exclusive drops, match schedules, and community events.
          </p>
          {subStatus === 'success' ? (
            <div className="max-w-md mx-auto py-4 px-6 bg-black/30 border border-[#42deef]/30 text-center">
              <p className="text-[#42deef] font-black text-sm uppercase tracking-widest">You&apos;re in! 🎉</p>
              <p className="text-black/50 text-xs mt-1">Thanks for subscribing. Watch out for exclusive drops.</p>
            </div>
          ) : subStatus === 'duplicate' ? (
            <div className="max-w-md mx-auto py-4 px-6 bg-black/20 border border-black/20 text-center">
              <p className="text-black/70 font-black text-sm uppercase tracking-widest">Already subscribed!</p>
              <p className="text-black/40 text-xs mt-1">You&apos;re already on the list.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-black text-white border-0 px-5 py-4 text-sm focus:outline-none placeholder-white/30"
              />
              <button
                type="submit"
                disabled={subStatus === 'loading'}
                className="bg-white text-black px-8 py-4 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors duration-300 whitespace-nowrap disabled:opacity-60"
              >
                {subStatus === 'loading' ? '…' : 'Subscribe'}
              </button>
            </form>
          )}
          {subStatus === 'error' && (
            <p className="text-red-500 text-[10px] text-center mt-2 font-black uppercase tracking-wider">Something went wrong. Try again.</p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PARTNER
      ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-white reveal" data-reveal data-header-theme="light">
        <div className="max-w-[1600px] mx-auto px-8 sm:px-14 lg:px-20">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">Partnership</span>
              <h2
                className="font-black text-black uppercase mt-3 mb-8 leading-none tracking-tighter"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)' }}
              >
                Widen<br />Your{' '}
                <span style={{ WebkitTextStroke: '1.5px #42deef', color: 'transparent' }}>Crowd</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5 max-w-sm">
                Join forces with Team Vamos and expand your reach. Together, we create
                lasting partnerships that matter to the community.
              </p>
              <div className="mt-10 space-y-4">
                {['Brand Sponsorship', 'Event Collaboration', 'Content Partnership', 'Product Collaboration'].map((type) => (
                  <div key={type} className="flex items-center gap-4 group">
                    <div className="w-6 h-px bg-[#42deef] group-hover:w-10 transition-all duration-300" />
                    <span className="text-gray-500 text-sm group-hover:text-black transition-colors duration-300">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-black/8 p-8 lg:p-10">
              {partnerStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="text-5xl font-black text-[#42deef] mb-4">✓</div>
                  <p className="text-black font-black uppercase tracking-widest text-sm mb-2">Inquiry Received!</p>
                  <p className="text-gray-400 text-xs">Our team will reach out within 2–3 business days.</p>
                  <button
                    onClick={() => setPartnerStatus('idle')}
                    className="mt-6 text-[#42deef] text-xs uppercase tracking-widest hover:underline"
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-5">
                  <h3 className="text-black font-black uppercase tracking-[0.3em] text-xs mb-8 pb-5 border-b border-black/8">
                    Partner with Us
                  </h3>
                  {[
                    { label: 'Name', type: 'text', key: 'name', ph: 'Your full name' },
                    { label: 'Company', type: 'text', key: 'company', ph: 'Company or brand name' },
                    { label: 'Email', type: 'email', key: 'email', ph: 'business@email.com' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{f.label}</label>
                      <input
                        type={f.type}
                        value={partnerForm[f.key as keyof typeof partnerForm]}
                        onChange={(e) => setPartnerForm({ ...partnerForm, [f.key]: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#f7f7f7] border-0 border-b-2 border-transparent text-black text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-300"
                        placeholder={f.ph}
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Message</label>
                    <textarea
                      value={partnerForm.message}
                      onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3.5 bg-[#f7f7f7] border-0 border-b-2 border-transparent text-black text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-300 resize-none"
                      placeholder="Tell us about your partnership idea..."
                      required
                    />
                  </div>
                  {partnerStatus === 'error' && (
                    <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={partnerStatus === 'loading'}
                    className="btn-wipe btn-wipe-invert w-full border border-black text-black py-4 font-black text-[11px] uppercase tracking-[0.3em] mt-2 disabled:opacity-50"
                  >
                    {partnerStatus === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="bg-black border-t border-white/[0.06] py-16 px-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="grid md:grid-cols-5 gap-12 mb-14">
            <div className="md:col-span-2">
              <Image
                src="/vamos-logo.webp"
                alt="Vamos"
                width={120}
                height={48}
                className="h-9 w-auto object-contain mb-5"
              />
              <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                Official Team Vamos merchandise store. Representing Malaysian esports on the global stage.
              </p>
              <div className="flex gap-5 mt-6">
                {[
                  { href: 'https://www.tiktok.com/@officialteamvamos', label: 'TikTok' },
                  { href: 'https://www.instagram.com/officialteamvamos/', label: 'Instagram' },
                  { href: 'https://www.youtube.com/@officialteamvamos', label: 'YouTube' },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="text-gray-700 hover:text-[#42deef] text-[10px] uppercase tracking-widest transition-colors hover-underline">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            {[
              {
                title: 'Shop',
                links: [
                  { href: '/products', label: 'All Products' },
                  { href: '/products', label: 'Apparel' },
                  { href: '/store', label: 'Vault' },
                ],
              },
              {
                title: 'Support',
                links: [
                  { href: '/contact', label: 'Contact Us' },
                  { href: '/refund-policy', label: 'Shipping & Returns' },
                  { href: '/refund-policy', label: 'Refund Policy' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { href: '/privacy-policy', label: 'Privacy Policy' },
                  { href: '/terms-of-service', label: 'Terms of Service' },
                  { href: '/contact', label: 'Contact Info' },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-black text-white uppercase tracking-[0.3em] text-[10px] mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-gray-600 hover:text-white text-sm transition-colors hover-underline">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-700 text-xs">
              © 2025 Team Vamos. All rights reserved. MPL MY Official Merchandise.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-[#42deef]" />
              <span className="text-gray-700 text-[10px] uppercase tracking-[0.4em]">VAMOS</span>
              <div className="h-px w-4 bg-[#42deef]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
