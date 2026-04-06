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
  const { user, profile, loading, signOut } = useAuth();
  const { itemCount: cartCount } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(scrollY > 20);
        setProgress(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);

        const el = document.elementFromPoint(window.innerWidth / 2, 70);
        let cur: Element | null = el;
        let found = false;
        while (cur && cur !== document.body) {
          const theme = cur.getAttribute('data-header-theme');
          if (theme === 'light') { setIsLight(true);  found = true; break; }
          if (theme === 'dark')  { setIsLight(false); found = true; break; }
          cur = cur.parentElement;
        }
        if (!found) setIsLight(false);

        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bg = isLight
    ? 'bg-white border-b border-black/10'
    : scrolled
      ? 'bg-black/88 backdrop-blur-xl border-b border-white/[0.06]'
      : 'bg-transparent border-b border-transparent';

  const txt    = isLight ? 'text-black'       : 'text-white';
  const txtMut = isLight ? 'text-black/50'    : 'text-white/45';
  const txtNav = isLight ? 'text-black/70 hover:text-black' : 'text-white/60 hover:text-white';
  const txtAct = isLight ? 'text-black'       : 'text-white';

  const dropBg = isLight
    ? 'bg-white border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.12)]'
    : 'bg-[#0a0a0a] border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.9)]';

  const isAdmin = profile?.role === 'admin';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-400 ${bg}`}>

      {/* Scroll progress line */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-[#42deef] transition-all duration-100 ease-linear z-10"
        style={{ width: `${progress}%` }}
      />

      <div className="relative flex items-center h-16 px-6 sm:px-10 lg:px-14">

        {/* ── LEFT: Hamburger (mobile) + Nav (desktop) ── */}
        <div className="flex items-center flex-1">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-1.5 transition-colors hover:text-[#42deef] ${txt}`}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map((item) => {
              if (isGroup(item)) {
                const groupActive = item.children.some(c => c.href && pathname === c.href);
                return (
                  <div key={item.label} className="relative group/nav">
                    <button className={`flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-black uppercase tracking-widest transition-colors duration-200 ${groupActive ? 'text-[#42deef]' : txtNav}`}>
                      {item.label}
                      <svg className="w-2.5 h-2.5 opacity-40 transition-transform duration-200 group-hover/nav:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div className="absolute top-full left-0 pt-3 opacity-0 -translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-250 z-50">
                      <div className="h-[2px] bg-[#42deef] w-full" />
                      <div className={`overflow-hidden ${dropBg} ${item.children.length >= 4 ? 'min-w-[420px]' : 'min-w-[280px]'}`}>
                        <div className={`px-5 pt-4 pb-2 flex items-center gap-2 border-b ${isLight ? 'border-black/6' : 'border-white/[0.05]'}`}>
                          <span className={`text-[9px] font-black uppercase tracking-[0.35em] ${isLight ? 'text-black/30' : 'text-white/20'}`}>{item.label}</span>
                          <div className={`flex-1 h-px ${isLight ? 'bg-black/8' : 'bg-white/[0.06]'}`} />
                        </div>

                        <div className={`p-3 ${item.children.length >= 4 ? 'grid grid-cols-2 gap-1' : 'flex flex-col gap-1'}`}>
                          {item.children.map((child) => {
                            const isActive = !child.soon && pathname === child.href;
                            const inner = (
                              <div className="flex items-center gap-3.5 w-full">
                                <div className={`w-9 h-9 flex items-center justify-center shrink-0 text-base transition-colors duration-200 ${
                                  child.soon
                                    ? isLight ? 'bg-black/4 text-black/20' : 'bg-white/[0.04] text-white/20'
                                    : isActive
                                    ? 'bg-[#42deef]/15 text-[#42deef]'
                                    : isLight ? 'bg-black/5 group-hover/item:bg-[#42deef]/10 group-hover/item:text-[#42deef]' : 'bg-white/[0.05] group-hover/item:bg-[#42deef]/10 group-hover/item:text-[#42deef]'
                                }`}>
                                  {child.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[11px] font-black uppercase tracking-widest leading-none mb-1 transition-colors duration-200 ${
                                    child.soon ? (isLight ? 'text-black/25' : 'text-white/25')
                                    : child.accent || isActive ? 'text-[#42deef]'
                                    : isLight ? 'text-black group-hover/item:text-[#42deef]'
                                    : 'text-white/80 group-hover/item:text-white'
                                  }`}>{child.label}</p>
                                  <p className={`text-[9px] leading-none tracking-wide ${isLight ? 'text-black/35' : 'text-white/25'}`}>{child.desc}</p>
                                </div>
                                {child.soon && (
                                  <span className={`text-[7px] font-black uppercase tracking-[0.25em] px-1.5 py-0.5 shrink-0 ${isLight ? 'bg-black/5 text-black/25' : 'bg-white/[0.06] text-white/25'}`}>
                                    Soon
                                  </span>
                                )}
                                {isActive && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#42deef] shrink-0" />
                                )}
                              </div>
                            );
                            if (child.soon) {
                              return (
                                <div key={child.label} className="flex items-center px-3 py-2.5 cursor-default">
                                  {inner}
                                </div>
                              );
                            }
                            return (
                              <Link key={child.href} href={child.href!}
                                className={`flex items-center px-3 py-2.5 transition-all duration-150 group/item relative overflow-hidden ${
                                  isActive
                                    ? isLight ? 'bg-[#42deef]/8' : 'bg-[#42deef]/6'
                                    : isLight ? 'hover:bg-black/4' : 'hover:bg-white/[0.04]'
                                }`}>
                                <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#42deef] transition-transform duration-200 origin-top ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover/item:scale-y-100'}`} />
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
                <Link key={item.href} href={item.href}
                  className={`px-3.5 py-2 text-[12px] font-black uppercase tracking-widest transition-colors duration-200 ${active ? 'text-[#42deef]' : txtNav}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── CENTER: Logo ── */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="block">
            <Image
              src="/vamos-logo.webp"
              alt="Vamos"
              width={0}
              height={0}
              sizes="200px"
              loading="eager"
              style={{ height: '36px', width: 'auto' }}
              className={`object-contain transition-all duration-300 ${isLight ? 'invert' : 'brightness-100'} hover:opacity-75`}
            />
          </Link>
        </div>

        {/* ── RIGHT: Profile & Auth ── */}
        <div className="flex items-center gap-3 flex-1 justify-end">

          {/* Cart */}
          <Link href="/cart" className={`relative p-1.5 transition-colors hover:text-[#42deef] ${txt}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#42deef] text-black text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {loading ? (
            <div className={`hidden md:block w-4 h-4 border-2 rounded-full animate-spin ${isLight ? 'border-black/20 border-t-black/60' : 'border-white/20 border-t-white/60'}`} />
          ) : user && profile ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/redeem" className="flex items-center gap-1 text-[#42deef] text-[11px] font-black tracking-widest hover:opacity-80 transition-opacity">
                <span className="text-xs">⭐</span>
                <span>{profile.points.toLocaleString()} pts</span>
              </Link>

              <div className={`w-px h-4 ${isLight ? 'bg-black/15' : 'bg-white/15'}`} />

              {isAdmin && (
                <Link href="/admin"
                  className="text-[11px] font-black uppercase tracking-[0.3em] text-[#42deef] hover:text-white transition-colors">
                  Admin
                </Link>
              )}

              <Link href="/profile"
                className={`w-9 h-9 flex items-center justify-center border text-base leading-none transition-all hover:border-[#42deef] ${isLight ? 'border-black/20' : 'border-white/20'}`}
                title="Profile">
                <span>{profile.avatar_url ?? '🦊'}</span>
              </Link>

              <button onClick={signOut}
                className={`text-[11px] font-black uppercase tracking-[0.3em] transition-colors hover:text-[#42deef] ${txtMut}`}>
                Log Out
              </button>
            </div>
          ) : (
            <Link href="/login"
              className={`hidden md:flex items-center justify-center w-9 h-9 border transition-all duration-200 hover:border-[#42deef] hover:text-[#42deef] ${isLight ? 'border-black/20 text-black' : 'border-white/20 text-white'}`}
              title="Login">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className={`border-t py-3 flex flex-col ${isLight ? 'bg-white border-black/8' : 'bg-black border-white/8'}`}>
          {NAV.map((item) => {
            if (isGroup(item)) {
              const expanded = mobileExpanded === item.label;
              return (
                <div key={item.label}>
                  <button onClick={() => setMobileExpanded(expanded ? null : item.label)}
                    className={`w-full flex items-center justify-between text-[11px] font-black uppercase tracking-widest py-3 px-6 transition-colors ${txtNav}`}>
                    <span>{item.label}</span>
                    <svg className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-60' : 'max-h-0'}`}>
                    <div className="pl-6 pb-2">
                      {item.children.map((child) => {
                        if (child.soon) {
                          return (
                            <div key={child.label} className={`flex items-center gap-2.5 py-2 px-2 text-[10px] font-black uppercase tracking-widest opacity-30 cursor-default ${txtAct}`}>
                              <span>{child.icon}</span>{child.label}
                            </div>
                          );
                        }
                        return (
                          <Link key={child.href} href={child.href!}
                            onClick={() => { setMenuOpen(false); setMobileExpanded(null); }}
                            className={`flex items-center gap-2.5 py-2 px-2 text-[10px] font-black uppercase tracking-widest border-l-2 transition-all ${
                              child.accent ? 'border-[#42deef]/20 text-[#42deef]/70 hover:text-[#42deef] hover:border-[#42deef]'
                              : isLight ? 'border-black/10 text-black/50 hover:text-black hover:border-black'
                              : 'border-white/10 text-white/50 hover:text-white hover:border-[#42deef]/50'
                            }`}>
                            <span>{child.icon}</span>{child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className={`text-[11px] font-black uppercase tracking-widest py-3 px-6 border-l-2 border-transparent transition-all ${
                  pathname === item.href ? 'text-[#42deef] border-[#42deef]'
                  : isLight ? 'text-black/60 hover:text-black hover:border-black hover:pl-8'
                  : 'text-white/50 hover:text-white hover:border-[#42deef]/50 hover:pl-8'
                }`}>
                {item.label}
              </Link>
            );
          })}

          <div className={`px-6 pt-3 mt-1 border-t flex items-center gap-4 ${isLight ? 'border-black/8' : 'border-white/8'}`}>
            {user && profile ? (
              <>
                <span className="text-[#42deef] text-[10px] font-black">⭐ {profile.points.toLocaleString()} pts</span>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-lg leading-none">{profile.avatar_url ?? '🦊'}</Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}
                    className="text-[10px] font-black uppercase tracking-widest text-[#42deef] hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                <button onClick={() => { setMenuOpen(false); signOut(); }}
                  className={`ml-auto text-[10px] font-black uppercase tracking-widest hover:text-red-400 transition-colors ${txtMut}`}>
                  Log Out
                </button>
              </>
            ) : !loading ? (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="bg-[#42deef] text-black px-5 py-2 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-colors">
                Login
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
