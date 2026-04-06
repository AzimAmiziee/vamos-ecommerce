'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import { useAuth } from '@/app/providers';

const AVATARS = [
  '🦊','🐺','🦁','🐯','🦅','🐉','⚔️','🎮','🏆','🔥',
  '💎','⭐','🎯','🛡️','🚀','👾','🤖','🦾','🌟','💥',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setPhone((profile as { phone?: string }).phone ?? '');
      if ((profile as { avatar_url?: string }).avatar_url) {
        setAvatar((profile as { avatar_url?: string }).avatar_url!);
      }
    }
  }, [profile]);

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSaving(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim(), avatar_url: avatar })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (authLoading || !user) return null;

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-[10px] font-black uppercase tracking-[0.4em]">Account</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase">Profile</h1>
        </div>

        {/* Avatar picker */}
        <div className="bg-[#060d14] border border-[#1A1A1A] p-8 mb-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-[#0A0A0A] border border-[#42deef]/20 flex items-center justify-center text-5xl">
              {avatar}
            </div>
            <div>
              <p className="text-white font-black text-lg">{fullName || 'Your Name'}</p>
              <p className="text-gray-500 text-xs mt-1">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px]">⭐</span>
                <span className="text-[#42deef] text-xs font-black">{(profile?.points ?? 0).toLocaleString()} pts</span>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Choose Avatar</p>
          <div className="grid grid-cols-10 gap-2">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={`w-full aspect-square rounded-lg text-2xl flex items-center justify-center transition-all duration-150 ${
                  avatar === emoji
                    ? 'bg-[#42deef]/15 border border-[#42deef]/60 scale-110'
                    : 'bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#42deef]/30 hover:bg-[#42deef]/5'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-[#060d14] border border-[#1A1A1A] p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 mb-6 font-black uppercase tracking-wider">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                placeholder="Your full name"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                placeholder="+60 12-345 6789"
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email ?? ''}
                  readOnly
                  className="w-full px-4 py-3 bg-[#0A0A0A]/50 border border-[#222] text-gray-500 text-sm cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 text-[10px] mt-2 uppercase tracking-widest">
                To change your email,{' '}
                <a href="/contact" className="text-[#42deef]/60 hover:text-[#42deef] transition-colors">
                  contact customer service
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#42deef] text-[#0A0A0A] px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="text-[#42deef] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
