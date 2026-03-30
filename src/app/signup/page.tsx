'use client';

import Header from '@/app/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { suppressNextSignIn } from '@/app/providers';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    // Prevent auto-login before signUp fires the SIGNED_IN event
    suppressNextSignIn();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen pt-20">
        <Header />
        <div className="flex items-center justify-center px-4 py-24">
          <div className="bg-[#060d14] border border-[#42deef]/25 p-10 w-full max-w-md text-center"
            style={{ boxShadow: '0 0 60px rgba(66,222,239,0.08)' }}>
            <div className="w-14 h-14 border-2 border-[#42deef] flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-3">Account Created!</h2>
            <p className="text-gray-400 text-sm mb-6">
              Check your inbox at <span className="text-white font-black">{email}</span> to confirm your account.
            </p>
            <Link href="/login"
              className="inline-block bg-[#42deef] text-[#0A0A0A] px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="flex items-center justify-center px-4 py-24">
        <div className="bg-[#060d14] border border-[#1A1A1A] p-10 w-full max-w-md"
          style={{ boxShadow: '0 0 60px rgba(66,222,239,0.05)' }}>

          <div className="text-center mb-10">
            <Image
              src="/team-vamos-logo.webp"
              alt="Team Vamos"
              width={300}
              height={78}
              className="w-40 h-auto object-contain mx-auto mb-5"
            />
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Create Account</h1>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
              Join the Vamos community
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 mb-5 font-black uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                placeholder="Ahmad Razif"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
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
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                placeholder="+60 12-345 6789"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                placeholder="Min. 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs uppercase tracking-widest mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#42deef] font-black hover:text-[#1cc5d9] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
