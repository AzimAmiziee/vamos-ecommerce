'use client';

import Header from '@/app/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="flex items-center justify-center px-4 py-24">
        <div className="bg-[#060d14] border border-[#1A1A1A] p-10 w-full max-w-md"
          style={{ boxShadow: '0 0 60px rgba(66,222,239,0.05)' }}>

          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#42deef]/40 to-transparent" />

          {/* Logo */}
          <div className="text-center mb-10">
            <Image
              src="/team-vamos-logo.png"
              alt="Team Vamos"
              width={300}
              height={78}
              className="w-40 h-auto object-contain mx-auto mb-5"
            />
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Sign In</h1>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
              Access your Team Vamos account
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 mb-5 font-black uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#42deef] text-[#0A0A0A] py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs uppercase tracking-widest mt-8">
            No account?{' '}
            <Link href="/signup" className="text-[#42deef] font-black hover:text-[#1cc5d9] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
