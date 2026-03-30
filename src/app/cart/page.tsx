'use client';

import Header from '@/app/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/app/providers';

const SHIPPING = 15;

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }
    router.push('/checkout');
  };

  const grandTotal = total + (items.length > 0 ? SHIPPING : 0);

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Checkout</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="border border-[#1A1A1A] p-16 text-center">
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-6">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-[#42deef] text-[#0A0A0A] px-8 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 bg-[#111] border border-[#1A1A1A] p-5 hover:border-[#333] transition-colors"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover object-top shrink-0 bg-[#0A0A0A]"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white uppercase text-xs tracking-wide leading-tight">{item.name}</h3>
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Size: {item.size}</p>
                    <p className="text-gray-600 text-xs">{item.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-white text-sm mb-2">RM {(item.price * item.quantity).toFixed(2)}</p>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="w-6 h-6 border border-[#333] text-gray-400 hover:border-[#42deef] hover:text-[#42deef] transition-colors text-xs flex items-center justify-center"
                      >−</button>
                      <span className="text-white text-xs font-black w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-6 h-6 border border-[#333] text-gray-400 hover:border-[#42deef] hover:text-[#42deef] transition-colors text-xs flex items-center justify-center"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="text-[#42deef] text-xs uppercase tracking-widest hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-[#111] border border-[#1A1A1A] p-6 h-fit">
              <h2 className="text-xs font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-[#1A1A1A]">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-[#1A1A1A]">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-white font-bold">RM {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-white font-bold">RM {SHIPPING.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-white mb-6">
                <span className="uppercase tracking-widest text-xs">Total</span>
                <span>RM {grandTotal.toFixed(2)}</span>
              </div>

              {!user && (
                <p className="text-yellow-500/80 text-[10px] uppercase tracking-widest text-center mb-3 font-black">
                  Login required to checkout
                </p>
              )}

              <button
                onClick={handleCheckout}
                className="w-full bg-[#42deef] text-[#0A0A0A] py-3 font-black text-xs uppercase tracking-widest hover:bg-[#1cc5d9] transition-colors mb-3"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              <Link
                href="/products"
                className="block text-center text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors py-2"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
