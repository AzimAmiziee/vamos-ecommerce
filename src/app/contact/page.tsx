'use client';

import Header from '@/app/components/Header';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Get in Touch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none mb-3">
            Contact <span className="text-[#42deef]">Us</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-[#1A1A1A]">
              Our Details
            </h2>
            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-[#42deef] text-xs font-black uppercase tracking-widest mb-1">Trade Name</dt>
                <dd className="text-gray-300">VAMOS ESPORTS SDN. BHD.</dd>
              </div>
              <div>
                <dt className="text-[#42deef] text-xs font-black uppercase tracking-widest mb-1">Registration</dt>
                <dd className="text-gray-300">202401000356 (1546207-A)</dd>
              </div>
              <div>
                <dt className="text-[#42deef] text-xs font-black uppercase tracking-widest mb-1">Address</dt>
                <dd className="text-gray-300 leading-relaxed">
                  NO. 10-G, JALAN ECO SANTUARI 8/1B,<br />
                  ECO SANTUARI, TELOK PANGLIMA GARANG,<br />
                  42500, SELANGOR, MALAYSIA
                </dd>
              </div>
              <div>
                <dt className="text-[#42deef] text-xs font-black uppercase tracking-widest mb-1">Email</dt>
                <dd>
                  <a href="mailto:admin@vamos.com.my" className="text-gray-300 hover:text-[#42deef] transition-colors">
                    admin@vamos.com.my
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[#42deef] text-xs font-black uppercase tracking-widest mb-1">Phone</dt>
                <dd className="text-gray-300">+60 16-517 2085</dd>
                <dd className="text-gray-300">011 3533 4469</dd>
              </div>
              <div>
                <dt className="text-[#42deef] text-xs font-black uppercase tracking-widest mb-1">Website</dt>
                <dd>
                  <a href="https://www.vamos.com.my" className="text-gray-300 hover:text-[#42deef] transition-colors">
                    www.vamos.com.my
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-[#1A1A1A]">
              Send a Message
            </h2>

            {submitted ? (
              <div className="bg-[#111] border border-[#42deef]/30 p-8 text-center">
                <div className="text-[#42deef] text-3xl font-black mb-3">✓</div>
                <p className="text-white font-black uppercase tracking-widest text-sm mb-2">Message Sent!</p>
                <p className="text-gray-500 text-xs">Our team will get back to you shortly.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 text-[#42deef] text-xs uppercase tracking-widest hover:underline"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                    placeholder="How can we help?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700 resize-none"
                    placeholder="Your message..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#42deef] text-[#0A0A0A] py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors mt-2"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
