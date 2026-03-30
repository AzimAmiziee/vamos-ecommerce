'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { useCart } from '@/lib/cart';

type NavChild = { href?: string; label: string; desc: string; icon: string; accent?: boolean; soon?: boolean };
type NavGroup = { label: string; children: NavChild[] };
type NavLink  = { href: string; label: string };
type NavItem  = NavLink | NavGroup;

function isGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

const NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  {
    label: 'Store',
    children: [
      { href: '/products', label: 'Merchandise', desc: 'Official team merchandise',    icon: '🛍️' },
      { href: '/store',    label: 'Vault',        desc: 'Digital goods & collectibles', icon: '🏪' },
      { href: '/redeem',   label: 'Rewards',      desc: 'Redeem your loyalty points',   icon: '⭐' },
    ],
  },
  { href: '/academy', label: 'Academy' },
  {
    label: 'MPL',
    children: [
      { href: '/predict',   label: 'Predict & Win', desc: 'Earn 20 pts per correct pick', icon: '🎯', accent: true },
      { href: '/standings', label: 'Standings',     desc: 'MPL MY season rankings',       icon: '🏆' },
    ],
  },
  {
    label: 'Team',
    children: [
      { href: '/free-fire', label: 'Free Fire',  desc: 'Vamos Free Fire division',   icon: '🔥', accent: true },
      { label: 'PUBG',      desc: 'Coming soon', icon: '🪖', soon: true },
      { label: 'MPL',       desc: 'Coming soon', icon: '⚔️', soon: true },
      { label: 'Valorant',  desc: 'Coming soon', icon: '🔺', soon: true },
    ],
  },
  { href: '/news', label: 'News' },
];

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { itemCount: cartCount } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(scrollY > 40);
        setProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl transition-all duration-500 rounded-2xl ${
        scrolled
          ? 'bg-[#060d14]/92 backdrop-blur-2xl border border-[#42deef]/25 shadow-[0_8px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(66,222,239,0.08),inset_0_1px_0_rgba(255,255,255,0.04)]'
          : 'bg-[#060d14]/70 backdrop-blur-xl border border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-[#42deef] transition-all duration-100 ease-linear z-10 rounded-full"
        style={{ width: `${progress}%` }}
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[#42deef]/60 to-transparent" />

      <div className="px-5 sm:px-6">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <Image
              src="/vamos-logo.webp"
              alt="Vamos"
              width={90}
              height={32}
              className="h-7 w-auto object-contain transition-all duration-300 group-hover:opacity-80 group-hover:drop-shadow-[0_0_8px_rgba(66,222,239,0.5)]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map((item) => {
              if (isGroup(item)) {
                const groupActive = item.children.some(c => c.href && pathname === c.href);
                return (
                  <div key={item.label} className="relative group/nav">
                    <button
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
                        groupActive
                          ? 'text-white bg-white/6'
                          : 'text-gray-400 group-hover/nav:text-white group-hover/nav:bg-white/4'
                      }`}
                    >
                      {item.label}
                      <svg
                        className="w-2.5 h-2.5 opacity-50 transition-transform duration-200 group-hover/nav:rotate-180"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown — CSS-only, no JS hover state */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 -translate-y-1.5 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-200">
                      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#07101a] border-l border-t border-[#42deef]/15 rotate-45 z-10" />
                      <div className="relative bg-[#07101a]/98 backdrop-blur-2xl border border-[#42deef]/15 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(66,222,239,0.04)] overflow-hidden min-w-[240px]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-[#42deef]/25 to-transparent" />
                        <div className="p-1.5">
                          {item.children.map((child) => {
                            const inner = (
                              <>
                                <span className="text-base w-5 text-center flex-shrink-0 leading-none">{child.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[11px] font-black uppercase tracking-widest leading-none mb-1 transition-colors ${
                                    child.soon
                                      ? 'text-gray-600'
                                      : child.accent
                                        ? 'text-[#42deef]/80 group-hover/item:text-[#42deef]'
                                        : 'text-gray-300 group-hover/item:text-white'
                                  }`}>
                                    {child.label}
                                  </p>
                                  <p className="text-[10px] text-gray-600 group-hover/item:text-gray-500 transition-colors leading-none">
                                    {child.desc}
                                  </p>
                                </div>
                                {child.soon && (
                                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded flex-shrink-0">
                                    Soon
                                  </span>
                                )}
                                {!child.soon && pathname === child.href && (
                                  <div className="w-1 h-1 rounded-full bg-[#42deef] flex-shrink-0" />
                                )}
                              </>
                            );
                            if (child.soon) {
                              return (
                                <div key={child.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-50 cursor-default">
                                  {inner}
                                </div>
                              );
                            }
                            return (
                              <Link
                                key={child.href}
                                href={child.href!}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group/item ${
                                  pathname === child.href
                                    ? 'bg-[#42deef]/8'
                                    : child.accent
                                      ? 'hover:bg-[#42deef]/6'
                                      : 'hover:bg-white/4'
                                }`}
                              >
                                {inner}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-200 ${
                    active
                      ? 'text-white bg-white/6'
                      : 'text-gray-400 hover:text-white hover:bg-white/4'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative text-gray-400 hover:text-white transition-colors group p-2 rounded-lg hover:bg-white/4"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#42deef] text-[#0A0A0A] text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/redeem" className="flex items-center gap-1.5 text-[#42deef] text-[11px] font-black">
                  <span className="text-[10px]">⭐</span>
                  <span>{(profile?.points ?? 0).toLocaleString()} pts</span>
                </Link>
                <div className="w-px h-4 bg-[#42deef]/20" />
                <Link
                  href="/profile"
                  className="bg-[#42deef]/10 border border-[#42deef]/30 text-[11px] px-3 py-1.5 rounded-lg hover:bg-[#42deef]/20 transition-all duration-300 flex items-center justify-center leading-none"
                  title="Profile"
                >
                  <span className="text-base leading-none">{(profile as { avatar_url?: string })?.avatar_url ?? '🦊'}</span>
                </Link>
                <button
                  onClick={signOut}
                  className="bg-[#42deef]/10 border border-[#42deef]/30 text-[#42deef] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block bg-[#42deef]/10 border border-[#42deef]/30 text-[#42deef] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg hover:bg-[#42deef] hover:text-[#0A0A0A] hover:shadow-[0_0_16px_rgba(66,222,239,0.3)] transition-all duration-300"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/4"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="border-t border-[#1A1A1A] py-3 flex flex-col">
            {NAV.map((item) => {
              if (isGroup(item)) {
                const expanded = mobileExpanded === item.label;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileExpanded(expanded ? null : item.label)}
                      className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-widest py-2.5 px-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-48' : 'max-h-0'}`}>
                      <div className="pl-4 pb-1">
                        {item.children.map((child) => {
                          if (child.soon) {
                            return (
                              <div
                                key={child.label}
                                className="flex items-center justify-between gap-2.5 py-2 px-2 text-[10px] font-bold uppercase tracking-widest border-l-2 border-[#1A1A1A] text-gray-600 opacity-50 cursor-default"
                              >
                                <span className="flex items-center gap-2.5">
                                  <span>{child.icon}</span>
                                  {child.label}
                                </span>
                                <span className="text-[8px] border border-gray-700 px-1.5 py-0.5 rounded">Soon</span>
                              </div>
                            );
                          }
                          return (
                            <Link
                              key={child.href}
                              href={child.href!}
                              onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}
                              className={`flex items-center gap-2.5 py-2 px-2 text-[10px] font-bold uppercase tracking-widest border-l-2 transition-all ${
                                child.accent
                                  ? 'border-[#42deef]/20 text-[#42deef]/70 hover:text-[#42deef] hover:border-[#42deef]'
                                  : 'border-[#1A1A1A] text-gray-500 hover:text-white hover:border-[#42deef]/50'
                              }`}
                            >
                              <span>{child.icon}</span>
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[11px] font-bold uppercase tracking-widest py-2.5 px-2 transition-colors border-l-2 border-transparent hover:border-[#42deef] hover:pl-4 text-gray-400 hover:text-white"
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-[#1A1A1A] mt-2 pt-2">
              {user ? (
                <>
                  <div className="flex items-center gap-1.5 text-[#42deef] text-[11px] font-black py-2.5 px-2">
                    <span>⭐</span>
                    <span>{(profile?.points ?? 0).toLocaleString()} pts</span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest py-2.5 px-2 transition-colors border-l-2 border-transparent hover:border-[#42deef] hover:pl-4 text-gray-400 hover:text-white"
                  >
                    <span className="text-base leading-none">{(profile as { avatar_url?: string })?.avatar_url ?? '🦊'}</span>
                    Profile
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="text-[11px] font-bold uppercase tracking-widest py-2.5 px-2 transition-colors border-l-2 border-transparent hover:border-red-500 hover:pl-4 text-gray-400 hover:text-red-400 text-left w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-[11px] font-bold uppercase tracking-widest py-2.5 px-2 transition-colors border-l-2 border-transparent hover:border-[#42deef] hover:pl-4 text-gray-400 hover:text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
