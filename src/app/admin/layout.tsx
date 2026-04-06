'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

const NAV = [
  { href: '/admin',          label: 'Overview',  icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  )},
  { href: '/admin/orders',   label: 'Orders',    icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
  )},
  { href: '/admin/products', label: 'Products',  icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
  )},
  { href: '/admin/news',     label: 'News',      icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>
  )},
  { href: '/admin/users',       label: 'Users',       icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
  )},
  { href: '/admin/standings',   label: 'Standings',   icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  )},
  { href: '/admin/inquiries',   label: 'Inquiries',   icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  )},
  { href: '/admin/subscribers', label: 'Subscribers', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  )},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || profile?.role !== 'admin') router.replace('/');
  }, [user, profile, loading, router]);

  if (loading || !user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#42deef]/30 border-t-[#42deef] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full z-30">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/">
            <Image src="/vamos-logo.webp" alt="Vamos" width={80} height={28} className="h-6 w-auto object-contain" style={{ filter: 'invert(1)' }} />
          </Link>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#42deef]" />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#42deef]">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-[#42deef] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className={active ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="px-3 py-3 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
            Back to Site
          </Link>
        </div>

        {/* User */}
        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-[#42deef]/20 flex items-center justify-center text-[#42deef] text-xs font-bold shrink-0">
              {(profile.full_name ?? profile.username ?? 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-800 truncate">{profile.full_name ?? profile.username ?? 'Admin'}</p>
              <p className="text-[9px] text-[#42deef] font-semibold uppercase tracking-wide">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 ml-56 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
