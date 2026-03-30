'use client';

import Header from '@/app/components/Header';
import ProductCard from '@/app/components/ProductCard';
import type { Product } from '@/app/data/products';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

import { useState, useEffect } from 'react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [partnerForm, setPartnerForm] = useState({ name: '', company: '', email: '', message: '' });
  const [partnerSent, setPartnerSent] = useState(false);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('sort_order', { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) {
          setFeaturedProducts(data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image ?? '',
            hoverImage: p.hover_image ?? undefined,
            category: p.category,
            collection: p.collection ?? '',
            description: p.description ?? '',
            sizes: p.sizes ?? [],
            rating: p.rating ?? 5.0,
          })));
        }
      });
  }, []);

  const handlePartnerSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setPartnerSent(true);
  };

  /* Scroll-reveal observer — triggers all [data-reveal] elements */
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
      { threshold: 0.07, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#080c10' }}>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/background.jpg" alt="" className="w-full h-full object-cover object-center" />
          {/* Dark overlays for premium depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#040d14]/85 via-[#040d14]/70 to-[#040d14]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040d14]/60 via-transparent to-[#040d14]/40" />
        </div>
        {/* Layered background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-grid-lines opacity-100" />
          {/* Dot grid on top */}
          <div className="absolute inset-0 bg-dot-grid opacity-30" />

          {/* Ambient glows */}
          <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-[#42deef] opacity-[0.09] blur-[160px] anim-drift" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[500px] rounded-full bg-[#42deef] opacity-[0.06] blur-[130px] anim-glow-pulse" />
          <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-[#1cc5d9] opacity-[0.07] blur-[120px]" />
          <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full bg-[#42deef] opacity-[0.05] blur-[80px] anim-glow-pulse" style={{ animationDelay: '1.5s' }} />

          {/* Rotating rings */}
          <div className="ring-deco anim-spin-slow"
            style={{ width: '700px', height: '700px', top: '50%', left: '50%', marginTop: '-350px', marginLeft: '-350px', borderColor: 'rgba(66,222,239,0.08)' }} />
          <div className="ring-deco anim-spin-slow-rev"
            style={{ width: '950px', height: '950px', top: '50%', left: '50%', marginTop: '-475px', marginLeft: '-475px', borderColor: 'rgba(66,222,239,0.05)' }} />
          <div className="ring-deco anim-spin-slow"
            style={{ width: '1200px', height: '1200px', top: '50%', left: '50%', marginTop: '-600px', marginLeft: '-600px', borderColor: 'rgba(66,222,239,0.03)', animationDuration: '35s' }} />

          {/* Diagonal teal shard */}
          <div className="absolute top-0 right-0 w-[40%] h-full opacity-[0.08]"
            style={{ background: 'linear-gradient(to left, rgba(66,222,239,0.2), transparent)', clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }} />

          {/* Horizontal hairlines */}
          <div className="absolute top-[28%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#42deef]/30 to-transparent" />
          <div className="absolute bottom-[28%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#42deef]/15 to-transparent" />
          {/* Vertical accent lines */}
          <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-[#42deef]/25 via-[#42deef]/08 to-transparent" />
          <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-[#42deef]/20 to-transparent" />

          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-[#42deef]/30" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-[#42deef]/30" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-[#42deef]/30" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-[#42deef]/30" />

          <div className="scan-line" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            {/* Team Logo — top */}
            <div className="relative hero-fade hero-d1 mb-10">
              <div className="absolute inset-0 bg-[#42deef] opacity-[0.20] blur-[80px] scale-150 rounded-full anim-glow-pulse" />
              <div className="anim-float">
                <Image
                  src="/team-vamos-logo.png"
                  alt="Team Vamos"
                  width={600}
                  height={157}
                  className="w-64 md:w-80 lg:w-[480px] h-auto object-contain relative z-10 drop-shadow-[0_0_60px_rgba(66,222,239,0.55)]"
                />
              </div>
            </div>

            {/* MPL MY tag */}
            <div className="flex items-center gap-3 hero-fade hero-d2 mb-3">
              <div className="h-px w-12 bg-[#42deef]" />
              <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">MPL Malaysia · Official Store</span>
              <div className="h-px w-12 bg-[#42deef]" />
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tight leading-none hero-fade hero-d3 mb-4">
              TEAM <br />
              <span className="text-shimmer">VAMOS</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-md font-medium hero-fade hero-d4 mb-8">
              Fearless. Competitive. Unstoppable.<br />
              Rep your team. Own the battlefield.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 hero-fade hero-d5">
              <a
                href="#shop"
                className="btn-premium bg-[#42deef] text-[#0A0A0A] px-12 py-4 font-black text-xs tracking-[0.2em] uppercase hover:bg-[#1cc5d9] hover:shadow-[0_0_40px_rgba(66,222,239,0.5)] transition-all"
              >
                Shop Now
              </a>
              <a
                href="/products"
                className="btn-premium border border-[#42deef]/40 text-white px-12 py-4 font-black text-xs tracking-[0.2em] uppercase hover:border-[#42deef] hover:shadow-[0_0_20px_rgba(66,222,239,0.2)] transition-all"
              >
                Full Collection
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#040d14] to-transparent pointer-events-none" />
      </section>

      {/* Stats Strip */}
      <section className="relative py-6 overflow-hidden reveal" data-reveal
        style={{ background: 'linear-gradient(90deg, #0a1a20 0%, #0d2028 50%, #0a1a20 100%)' }}>
        {/* Glow backing */}
        <div className="absolute inset-0 bg-[#42deef] opacity-[0.06]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#42deef]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#42deef]/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Season Wins', value: '12+' },
              { label: 'MPL Titles', value: '2' },
              { label: 'Community', value: '50K+' },
              { label: 'Team Members', value: '10' },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-[#42deef] font-black text-3xl md:text-4xl group-hover:drop-shadow-[0_0_12px_rgba(66,222,239,0.8)] transition-all duration-300">{stat.value}</div>
                <div className="text-gray-400 text-xs uppercase tracking-[0.2em] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" className="py-24 px-4 relative overflow-hidden reveal" data-reveal
        style={{ background: 'linear-gradient(180deg, #040d14 0%, #060b10 100%)' }}>
        <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#42deef]" />
                <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">Official Merchandise</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase">
                Featured <span className="text-[#42deef]">Drops</span>
              </h2>
            </div>
            <a
              href="/products"
              className="text-gray-500 text-xs font-black hover:text-white uppercase tracking-widest transition-colors hidden md:block"
            >
              View All →
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <a
              href="/products"
              className="inline-block border border-[#333] text-white px-8 py-3 font-black text-xs uppercase tracking-widest hover:border-[#42deef] hover:text-[#42deef] transition-colors"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4 border-y border-[#1A1A1A] overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #080e14 0%, #0a1018 50%, #060c12 100%)' }}>
        <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#42deef] opacity-[0.04] blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-left" data-reveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#42deef]" />
                <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6 leading-tight">
                Born From<br />Malaysian{' '}
                <span className="text-[#42deef]">Esports</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-5">
                Team Vamos represents the heart of Malaysian competitive gaming.
                Built on passion, discipline, and relentless drive — we compete in
                MPL MY to bring pride to every fan.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Every piece of merch you wear is a statement — you stand with us,
                believe in the grind, and share our hunger to dominate.
              </p>
              <a
                href="/products"
                className="inline-block bg-[#42deef] text-[#0A0A0A] px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors"
              >
                Shop The Collection
              </a>
            </div>

            {/* Brand visual */}
            <div className="relative reveal-right" data-reveal>
              <div className="aspect-square bg-[#060d14] border border-[#1A1A1A] hover:border-[#42deef]/50 transition-colors duration-500 flex items-center justify-center overflow-hidden relative group"
                style={{ boxShadow: '0 0 60px rgba(66,222,239,0.05)' }}>
                {/* Rotating ring inside box */}
                <div className="absolute w-[130%] h-[130%] ring-deco anim-spin-slow-rev opacity-30"
                  style={{ borderColor: 'rgba(66,222,239,0.15)' }} />
                <div className="absolute w-[90%] h-[90%] ring-deco anim-spin-slow opacity-20"
                  style={{ borderColor: 'rgba(66,222,239,0.10)' }} />
                <Image
                  src="/team-vamos-logo.png"
                  alt="Team Vamos"
                  width={400}
                  height={104}
                  className="w-48 h-auto object-contain opacity-25 group-hover:opacity-40 group-hover:drop-shadow-[0_0_30px_rgba(66,222,239,0.5)] transition-all duration-700 relative z-10"
                />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-10 h-[2px] bg-[#42deef]" />
                <div className="absolute top-0 left-0 w-[2px] h-10 bg-[#42deef]" />
                <div className="absolute bottom-0 right-0 w-10 h-[2px] bg-[#42deef]" />
                <div className="absolute bottom-0 right-0 w-[2px] h-10 bg-[#42deef]" />
                <div className="absolute top-0 right-0 w-6 h-[1px] bg-[#42deef]/40" />
                <div className="absolute bottom-0 left-0 w-6 h-[1px] bg-[#42deef]/40" />
                {/* Center glow */}
                <div className="absolute inset-0 bg-[#42deef] opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-full scale-50 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forza Vamos — Fan Community */}
      <section className="relative overflow-hidden reveal" data-reveal>
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/forza-vamos.jpg"
            alt="Forza Vamos community"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layer dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60" />
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-28 md:py-36">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-[#42deef]/30 bg-[#42deef]/10 px-4 py-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42deef] anim-glow-pulse" />
              <span className="text-[#42deef] text-xs font-black tracking-[0.35em] uppercase">Fan Community</span>
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase leading-none mb-2">
              FORZA
            </h2>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none mb-8">
              <span className="text-shimmer">VAMOS</span>
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-3 max-w-lg">
              The official Team Vamos fan community. Follow every match, get the latest news, exclusive updates and connect with thousands of Vamos supporters across Malaysia.
            </p>
            <p className="text-gray-500 text-sm mb-10">
              Join 2,000+ fans already in the group.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://t.me/ForzaVamos/2616"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#42deef] text-[#0A0A0A] px-8 py-4 font-black text-xs tracking-[0.2em] uppercase hover:bg-[#1cc5d9] hover:shadow-[0_0_30px_rgba(66,222,239,0.4)] transition-all"
              >
                {/* Telegram icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Join Forza Vamos
              </a>
              <a
                href="/news"
                className="inline-flex items-center gap-2 border border-[#444] text-white px-8 py-4 font-black text-xs tracking-[0.2em] uppercase hover:border-[#42deef] hover:text-[#42deef] transition-all"
              >
                Latest News →
              </a>
            </div>
          </div>
        </div>

        {/* Right edge fade */}
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none hidden md:block" />
      </section>

      {/* Sponsors Section */}
      <section className="py-20 px-4 bg-[#080808] border-y border-[#1A1A1A] reveal" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#42deef]" />
              <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">Powered By</span>
              <div className="h-px w-8 bg-[#42deef]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase">
              Our <span className="text-[#42deef]">Sponsors</span>
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto">
              The brands and partners that fuel our journey to the top.
            </p>
          </div>

          {/* Infinite scrolling ticker */}
          <div className="relative overflow-hidden mb-12">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

            <div className="flex anim-marquee" style={{ width: 'max-content' }}>
              {/* Render twice for seamless loop */}
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center">
                  {[
                    '/Sponsor-01.png',
                    '/Sponsor-02.png',
                    '/Sponsor-03.png',
                    '/Sponsor-04.png',
                    '/Sponsor-05.png',
                    '/Sponsor-06.png',
                    '/Sponsor-07.png',
                  ].map((src, i) => (
                    <div key={i} className="flex items-center justify-center w-96 h-48 mx-10 group shrink-0">
                      <img
                        src={src}
                        alt="Sponsor"
                        className="max-h-40 max-w-full object-contain opacity-50 group-hover:opacity-90 group-hover:drop-shadow-[0_0_16px_rgba(66,222,239,0.5)] transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Become a sponsor CTA */}
          <div className="text-center pt-10 border-t border-[#1A1A1A]">
            <p className="text-gray-500 text-sm mb-4">Interested in partnering with Team Vamos?</p>
            <a
              href="mailto:admin@vamos.com.my"
              className="inline-block border border-[#42deef] text-[#42deef] px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#42deef] hover:text-[#0A0A0A] transition-colors"
            >
              Become a Sponsor
            </a>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="py-24 px-4 bg-[#0A0A0A] reveal" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">Watch Us Play</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-12">
            Latest <span className="text-[#42deef]">Highlights</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'EGFnvXaMnSY',
              'VbGflD4nBeM',
              'oxE1ZP1dfp0',
              'O9nB5kGJCNI',
            ].map((videoId) => (
              <div key={videoId} className="aspect-video border border-[#1A1A1A] overflow-hidden">
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

      {/* Social Media Section */}
      <section className="py-20 px-4 bg-[#0D0D0D] border-y border-[#1A1A1A] reveal" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#42deef]" />
              <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">Follow the Journey</span>
              <div className="h-px w-8 bg-[#42deef]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase">
              Join Our <span className="text-[#42deef]">Community</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@officialteamvamos"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111] border border-[#1A1A1A] hover:border-[#42deef] transition-colors duration-300 p-8 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 bg-[#0A0A0A] border border-[#1A1A1A] group-hover:border-[#42deef] flex items-center justify-center mb-5 transition-colors">
                <svg className="w-7 h-7 text-white group-hover:text-[#42deef] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.24 8.24 0 004.81 1.54V6.77a4.85 4.85 0 01-1.04-.08z" />
                </svg>
              </div>
              <div className="text-3xl font-black text-white mb-1">127K</div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-3">Followers</div>
              <div className="text-white font-black text-xs uppercase tracking-widest mb-1">TikTok</div>
              <div className="text-gray-600 text-xs">@officialteamvamos</div>
            </a>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@officialteamvamos"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111] border border-[#1A1A1A] hover:border-[#42deef] transition-colors duration-300 p-8 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 bg-[#0A0A0A] border border-[#1A1A1A] group-hover:border-[#42deef] flex items-center justify-center mb-5 transition-colors">
                <svg className="w-7 h-7 text-white group-hover:text-[#42deef] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 00.5 6.19 31.7 31.7 0 000 12a31.7 31.7 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.45 20.5 12 20.5 12 20.5s7.55 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.7 31.7 0 0024 12a31.7 31.7 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </div>
              <div className="text-3xl font-black text-white mb-1">25.1K</div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-3">Subscribers</div>
              <div className="text-white font-black text-xs uppercase tracking-widest mb-1">YouTube</div>
              <div className="text-gray-600 text-xs">@officialteamvamos</div>
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/officialteamvamos/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111] border border-[#1A1A1A] hover:border-[#42deef] transition-colors duration-300 p-8 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 bg-[#0A0A0A] border border-[#1A1A1A] group-hover:border-[#42deef] flex items-center justify-center mb-5 transition-colors">
                <svg className="w-7 h-7 text-white group-hover:text-[#42deef] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="text-3xl font-black text-white mb-1">48.5K</div>
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-3">Followers</div>
              <div className="text-white font-black text-xs uppercase tracking-widest mb-1">Instagram</div>
              <div className="text-gray-600 text-xs">@officialteamvamos</div>
            </a>
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-24 px-4 bg-[#0A0A0A] relative overflow-hidden reveal" data-reveal>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#42deef] opacity-5 blur-3xl rounded-full" />
        </div>
        <div className="max-w-xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">Stay Connected</span>
            <div className="h-px w-8 bg-[#42deef]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
            Join The <span className="text-[#42deef]">Community</span>
          </h2>
          <p className="text-gray-400 mb-10">
            Get early access to exclusive drops, match schedules, and community events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#111] border border-[#333] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
            />
            <button className="bg-[#42deef] text-[#0A0A0A] px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-24 px-4 bg-[#080808] border-t border-[#1A1A1A] reveal" data-reveal>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left — Copy */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#42deef]" />
                <span className="text-[#42deef] text-xs font-black tracking-[0.3em] uppercase">Partnership</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6 leading-tight">
                Widen Your <span className="text-[#42deef]">Crowd</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-5">
                Join forces with Team Vamos and expand your reach. Together, we can achieve more and create
                lasting partnerships that matter.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                From jersey sponsorships to event collaborations, content partnerships, and brand activations —
                let's build something the Vamos community will love.
              </p>
              <div className="mt-8 space-y-3">
                {['Brand Sponsorship', 'Event Collaboration', 'Content Partnership', 'Product Collaboration'].map((type) => (
                  <div key={type} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#42deef] rounded-full" />
                    <span className="text-gray-400 text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-[#111] border border-[#1A1A1A] p-8">
              {partnerSent ? (
                <div className="text-center py-8">
                  <div className="text-[#42deef] text-4xl font-black mb-4">✓</div>
                  <p className="text-white font-black uppercase tracking-widest text-sm mb-2">Inquiry Received!</p>
                  <p className="text-gray-500 text-xs">Our partnership team will reach out within 2–3 business days.</p>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6 pb-4 border-b border-[#1A1A1A]">
                    Partner with Us
                  </h3>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={partnerForm.name}
                      onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Company</label>
                    <input
                      type="text"
                      value={partnerForm.company}
                      onChange={(e) => setPartnerForm({ ...partnerForm, company: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                      placeholder="Company or brand name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                      placeholder="business@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                    <textarea
                      value={partnerForm.message}
                      onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700 resize-none"
                      placeholder="Tell us about your partnership idea..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#42deef] text-[#0A0A0A] py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors mt-2"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <Image
                src="/vamos-logo.png"
                alt="Vamos"
                width={120}
                height={48}
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Official Team Vamos merchandise store. Representing Malaysian esports on the global stage.
              </p>
              <div className="flex gap-5 mt-6">
                <a href="https://www.tiktok.com/@officialteamvamos" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#42deef] text-xs uppercase tracking-widest transition-colors">TikTok</a>
                <a href="https://www.instagram.com/officialteamvamos/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#42deef] text-xs uppercase tracking-widest transition-colors">Instagram</a>
                <a href="https://www.youtube.com/@officialteamvamos" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#42deef] text-xs uppercase tracking-widest transition-colors">YouTube</a>
              </div>
            </div>
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-5">Shop</h4>
              <ul className="space-y-3">
                <li><a href="/products" className="text-gray-500 hover:text-white text-sm transition-colors">All Products</a></li>
                <li><a href="/products" className="text-gray-500 hover:text-white text-sm transition-colors">Apparel</a></li>
                <li><a href="/products" className="text-gray-500 hover:text-white text-sm transition-colors">Gaming Gear</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-5">Support</h4>
              <ul className="space-y-3">
                <li><a href="/contact" className="text-gray-500 hover:text-white text-sm transition-colors">Contact Us</a></li>
                <li><a href="/refund-policy" className="text-gray-500 hover:text-white text-sm transition-colors">Shipping &amp; Returns</a></li>
                <li><a href="/refund-policy" className="text-gray-500 hover:text-white text-sm transition-colors">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-5">Legal</h4>
              <ul className="space-y-3">
                <li><a href="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                <li><a href="/contact" className="text-gray-500 hover:text-white text-sm transition-colors">Contact Info</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1A1A1A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">
              © 2025 Team Vamos. All rights reserved. MPL MY Official Merchandise.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-[#42deef]" />
              <span className="text-gray-600 text-xs uppercase tracking-[0.3em]">VAMOS</span>
              <div className="h-px w-4 bg-[#42deef]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
