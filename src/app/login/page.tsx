'use client';

import Header from '@/app/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !user) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      router.push('/admin');
    } else if (profile?.role === 'vendor') {
      router.push('/vendor');
    } else {
      router.push(redirect);
    }
    router.refresh();
  };

  return (
    <div className="bg-black min-h-screen" data-header-theme="dark">
      <Header />

      <div className="flex min-h-screen">

        {/* ── Left: Brand panel ── */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <Image
            src="/about-us.webp"
            alt="Team Vamos"
            fill
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="relative z-10 flex flex-col justify-end p-16 pb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#42deef]" />
              <span className="text-[#42deef] text-[10px] font-black tracking-[0.5em] uppercase">
                MPL Malaysia
              </span>
            </div>
            <h2
              className="font-black text-white uppercase leading-none tracking-tighter mb-4"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
            >
              Join The<br /><span style={{ color: '#42deef' }}>Team</span>
            </h2>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Access exclusive drops, earn loyalty points, and be part of the Vamos community.
            </p>
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-16 pt-28 pb-16">
          <div className="w-full max-w-md">

            <div className="mb-12">
              <Image
                src="/team-vamos-logo.webp"
                alt="Team Vamos"
                width={0}
                height={0}
                sizes="200px"
                style={{ height: '48px', width: 'auto' }}
                className="object-contain mb-8"
              />
              <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
                Sign In
              </h1>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.4em] font-black">
                Access your Team Vamos account
              </p>
            </div>

            {error && (
              <div className="border border-red-500/30 bg-red-500/8 text-red-400 text-[10px] px-4 py-3 mb-6 font-black uppercase tracking-wider">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.35em] text-white/30 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-transparent border border-white/10 text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-white/15"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.35em] text-white/30 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-transparent border border-white/10 text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-white/15"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#42deef] text-black py-4 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-colors duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/[0.06]">
              <p className="text-white/20 text-[10px] uppercase tracking-widest font-black text-center">
                No account?{' '}
                <Link href="/signup" className="text-[#42deef] hover:text-white transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
