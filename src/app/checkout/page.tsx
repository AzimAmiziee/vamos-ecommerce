'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import type { CartItem } from '@/lib/cart';
import { useAuth } from '@/app/providers';
import { createMerchandiseOrder } from '@/lib/db/orders';

type Step = 'method' | 'card-form' | 'processing' | 'confirmed';

const SHIPPING = 15;

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading, refreshProfile } = useAuth();

  const [step, setStep] = useState<Step>('method');

  // Snapshot of order data — captured before cart is cleared
  const [confirmedItems, setConfirmedItems] = useState<CartItem[]>([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [confirmedGrandTotal, setConfirmedGrandTotal] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  // Card form
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const redirected = useRef(false);

  const grandTotal = total + SHIPPING;

  useEffect(() => {
    if (authLoading || redirected.current || step === 'confirmed') return;
    if (!user) { redirected.current = true; router.push('/login?redirect=/checkout'); return; }
    if (items.length === 0) { redirected.current = true; router.push('/cart'); }
  }, [authLoading, user, items, step, router]);

  const handlePay = async () => {
    if (!user) return;
    setStep('processing');

    // Snapshot before clearing
    const snapItems = [...items];
    const snapTotal = total;
    const snapGrand = grandTotal;

    const id = await createMerchandiseOrder({
      userId: user.id,
      items: snapItems,
      subtotal: snapTotal,
      total: snapGrand,
      paymentMethod: 'card',
      cardName,
    });

    await refreshProfile();
    clearCart();

    setConfirmedItems(snapItems);
    setConfirmedTotal(snapTotal);
    setConfirmedGrandTotal(snapGrand);
    setOrderId(id ?? `ORD-${Date.now()}`);
    setOrderDate(new Date().toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' }));
    setPointsEarned(Math.floor(snapTotal * 2));
    setStep('confirmed');
  };

  if ((authLoading || !user) && step !== 'confirmed') return null;

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Page Header */}
        {step !== 'confirmed' && step !== 'processing' && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-[#42deef]" />
              <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Checkout</span>
            </div>
            <h1 className="text-5xl font-black text-white uppercase">Payment</h1>
          </div>
        )}

        {/* ── STEP: METHOD ────────────────────────────────────── */}
        {step === 'method' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Select Payment Method</p>

              {/* FPX — disabled */}
              <div className="border border-[#1A1A1A] p-6 opacity-50 relative select-none">
                <div className="absolute top-3 right-3 bg-[#1A1A1A] text-gray-500 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                  Coming Soon
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6h18M3 12h18M3 18h16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-wide">FPX Online Banking</p>
                    <p className="text-gray-600 text-xs mt-0.5">Maybank, CIMB, Public Bank, RHB and more</p>
                  </div>
                </div>
              </div>

              {/* Debit / Credit Card */}
              <div
                onClick={() => setStep('card-form')}
                className="border border-[#1A1A1A] hover:border-[#42deef]/50 p-6 cursor-pointer transition-all duration-200 group"
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 0 1px rgba(66,222,239,0.25), 0 4px 20px rgba(66,222,239,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#42deef]/30 bg-[#42deef]/5 flex items-center justify-center shrink-0 group-hover:border-[#42deef]/60 transition-colors">
                    <svg className="w-5 h-5 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-sm uppercase tracking-wide group-hover:text-[#42deef] transition-colors">
                      Debit / Credit Card
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">Visa, Mastercard, American Express</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-[#42deef] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <OrderSummary items={items} subtotal={total} grandTotal={grandTotal} />
          </div>
        )}

        {/* ── STEP: CARD FORM ─────────────────────────────────── */}
        {step === 'card-form' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <button
                onClick={() => setStep('method')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#42deef] text-xs uppercase tracking-widest font-black mb-8 transition-colors"
              >
                ← Back
              </button>

              <div className="bg-[#060d14] border border-[#1A1A1A] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 border border-[#42deef]/40 bg-[#42deef]/5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h2 className="text-white font-black text-sm uppercase tracking-widest">Card Details</h2>
                </div>

                <div className="space-y-5">
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="As printed on card"
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700 font-mono tracking-widest"
                    />
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] text-white text-sm focus:outline-none focus:border-[#42deef] transition-colors placeholder-gray-700 font-mono"
                      />
                    </div>
                  </div>

                  {/* Secure note */}
                  <div className="flex items-center gap-2 text-gray-600 text-[11px]">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Your card details are encrypted and secure
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePay}
                    disabled={!cardName.trim() || cardNumber.replace(/\s/g, '').length < 16 || expiry.length < 5 || cvv.length < 3}
                    className="w-full bg-[#42deef] text-[#0A0A0A] py-4 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] hover:shadow-[0_0_24px_rgba(66,222,239,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-2"
                  >
                    Pay RM {grandTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            </div>

            <OrderSummary items={items} subtotal={total} grandTotal={grandTotal} />
          </div>
        )}

        {/* ── STEP: PROCESSING ────────────────────────────────── */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-2 border-[#42deef]/30 border-t-[#42deef] rounded-full animate-spin mb-8" />
            <p className="text-white font-black text-sm uppercase tracking-widest">Processing Payment...</p>
            <p className="text-gray-600 text-xs mt-2 uppercase tracking-widest">Please do not close this page</p>
          </div>
        )}

        {/* ── STEP: CONFIRMED ─────────────────────────────────── */}
        {step === 'confirmed' && (
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 border-2 border-[#42deef] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#42deef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#42deef]" />
                <span className="text-[#42deef] text-xs font-black tracking-[0.4em] uppercase">Order Confirmed</span>
                <div className="h-px w-8 bg-[#42deef]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                Thank You!
              </h1>
              <p className="text-gray-400 text-sm">Your order has been placed and is being processed.</p>
            </div>

            {/* Invoice Card */}
            <div className="bg-[#060d14] border border-[#1A1A1A]" style={{ boxShadow: '0 0 60px rgba(66,222,239,0.04)' }}>

              {/* Invoice Header */}
              <div className="border-b border-[#1A1A1A] px-8 py-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black mb-1">Order ID</p>
                  <p className="text-white font-black text-sm font-mono">#{orderId.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black mb-1">Date</p>
                  <p className="text-white text-xs font-black">{orderDate}</p>
                </div>
              </div>

              {/* Items */}
              <div className="px-8 py-6 border-b border-[#1A1A1A] space-y-4">
                <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black mb-2">Items Ordered</p>
                {confirmedItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover object-top bg-[#0A0A0A] shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-white text-xs font-black uppercase tracking-wide leading-tight truncate">{item.name}</p>
                        <p className="text-gray-600 text-[10px] mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-white text-xs font-black shrink-0">RM {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-8 py-6 border-b border-[#1A1A1A] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-white font-bold">RM {confirmedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-white font-bold">RM {SHIPPING.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-white pt-3 border-t border-[#1A1A1A]">
                  <span className="uppercase tracking-widest text-xs">Total Paid</span>
                  <span className="text-[#42deef] text-lg">RM {confirmedGrandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Points Earned */}
              <div className="px-8 py-5 border-b border-[#1A1A1A] bg-[#42deef]/5 flex items-center justify-between">
                <div>
                  <p className="text-[#42deef] text-[10px] font-black uppercase tracking-widest mb-0.5">Points Earned</p>
                  <p className="text-gray-400 text-xs">Redeemable for free merch and experiences</p>
                </div>
                <span className="text-3xl font-black text-[#42deef]">+{pointsEarned}</span>
              </div>

              {/* Payment Method */}
              <div className="px-8 py-5 flex items-center justify-between">
                <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">Payment Method</p>
                <p className="text-white text-xs font-black uppercase tracking-wide">Debit / Credit Card</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/products"
                className="flex-1 border border-[#42deef] text-[#42deef] py-3 font-black text-xs uppercase tracking-widest text-center hover:bg-[#42deef] hover:text-[#0A0A0A] transition-all"
              >
                Continue Shopping
              </Link>
              <Link
                href="/redeem"
                className="flex-1 bg-[#42deef]/10 border border-[#42deef]/30 text-[#42deef] py-3 font-black text-xs uppercase tracking-widest text-center hover:bg-[#42deef]/20 transition-all"
              >
                View Rewards →
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Shared Order Summary Sidebar ──────────────────────────────
function OrderSummary({ items, subtotal, grandTotal }: {
  items: CartItem[];
  subtotal: number;
  grandTotal: number;
}) {
  return (
    <div className="bg-[#060d14] border border-[#1A1A1A] p-6 h-fit">
      <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-[#1A1A1A]">
        Order Summary
      </h2>

      <div className="space-y-3 mb-6 pb-6 border-b border-[#1A1A1A]">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex justify-between gap-2">
            <div className="min-w-0">
              <p className="text-white text-xs font-black uppercase leading-tight line-clamp-1">{item.name}</p>
              <p className="text-gray-600 text-[10px]">Size: {item.size} · ×{item.quantity}</p>
            </div>
            <p className="text-white text-xs font-black shrink-0">RM {(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6 pb-6 border-b border-[#1A1A1A]">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-white font-bold">RM {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className="text-white font-bold">RM 15.00</span>
        </div>
      </div>

      <div className="flex justify-between font-black text-white">
        <span className="uppercase tracking-widest text-xs">Total</span>
        <span className="text-[#42deef]">RM {grandTotal.toFixed(2)}</span>
      </div>

      <div className="mt-4 pt-4 border-t border-[#1A1A1A] flex items-center justify-between">
        <span className="text-gray-600 text-[10px] uppercase tracking-widest font-black">Points you'll earn</span>
        <span className="text-[#42deef] font-black text-sm">+{Math.floor(subtotal * 2)} pts</span>
      </div>
    </div>
  );
}
