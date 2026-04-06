'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string | null;
  category: string;
  collection: string | null;
  sizes: string[];
  rating: number;
  in_stock: boolean;
  sort_order: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<{ id: string; value: string } | null>(null);
  const [filterStock, setFilterStock] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select('id, name, price, original_price, image, category, collection, sizes, rating, in_stock, sort_order')
      .order('sort_order');

    if (filterStock === 'in_stock')     query = query.eq('in_stock', true);
    if (filterStock === 'out_of_stock') query = query.eq('in_stock', false);

    const { data } = await query;
    setProducts(data ?? []);
    setLoading(false);
  }, [filterStock]);

  useEffect(() => { load(); }, [load]);

  const toggleStock = async (id: string, current: boolean) => {
    setUpdating(id);
    await createClient().from('products').update({ in_stock: !current }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: !current } : p));
    setUpdating(null);
  };

  const savePrice = async (id: string) => {
    if (!editingPrice || editingPrice.id !== id) return;
    const price = parseFloat(editingPrice.value);
    if (isNaN(price) || price <= 0) return;
    setUpdating(id);
    await createClient().from('products').update({ price }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price } : p));
    setEditingPrice(null);
    setUpdating(null);
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#42deef] text-[11px] font-bold uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <div className="flex items-center gap-3 text-[12px] font-semibold">
          <span className="text-gray-400">{products.length} total</span>
          <span className="text-emerald-500">{products.filter(p => p.in_stock).length} in stock</span>
          <span className="text-red-400">{products.filter(p => !p.in_stock).length} out</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-lg p-1 shadow-sm w-fit">
        {(['all', 'in_stock', 'out_of_stock'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterStock(f)}
            className={`px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide rounded-md transition-all ${
              filterStock === f ? 'bg-[#42deef] text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Products list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-5 px-5 py-4 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0" />
                <div className="flex-1"><div className="h-3 bg-gray-100 rounded w-48 mb-2" /><div className="h-2 bg-gray-50 rounded w-32" /></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-300 text-sm">No products found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-5 px-5 py-4 hover:bg-gray-50/50 transition-colors">

                {/* Image */}
                <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage${product.image}`}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-[13px] font-semibold truncate">{product.name}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{product.category}{product.collection ? ` · ${product.collection}` : ''}</p>
                  {product.sizes.length > 0 && (
                    <p className="text-gray-300 text-[10px] mt-0.5">{product.sizes.join(', ')}</p>
                  )}
                </div>

                {/* Price edit */}
                <div className="shrink-0 text-right">
                  {editingPrice?.id === product.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-[11px]">RM</span>
                      <input
                        type="number"
                        value={editingPrice.value}
                        onChange={e => setEditingPrice({ id: product.id, value: e.target.value })}
                        onKeyDown={e => { if (e.key === 'Enter') savePrice(product.id); if (e.key === 'Escape') setEditingPrice(null); }}
                        className="w-16 bg-white border border-[#42deef] text-gray-800 text-[12px] px-2 py-1 rounded focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => savePrice(product.id)} className="text-[#42deef] text-[12px] font-bold hover:text-[#0bb8d4]">✓</button>
                      <button onClick={() => setEditingPrice(null)} className="text-gray-300 text-[12px] hover:text-gray-500">✕</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingPrice({ id: product.id, value: String(product.price) })}
                      className="text-gray-800 font-bold text-[14px] hover:text-[#42deef] transition-colors"
                      title="Click to edit price"
                    >
                      RM {product.price}
                    </button>
                  )}
                  {product.original_price && (
                    <p className="text-gray-300 text-[11px] line-through">RM {product.original_price}</p>
                  )}
                </div>

                {/* Stock toggle */}
                <div className="shrink-0">
                  <button
                    onClick={() => toggleStock(product.id, product.in_stock)}
                    disabled={updating === product.id}
                    className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide rounded-full border transition-all disabled:opacity-40 ${
                      product.in_stock
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                        : 'bg-red-50 text-red-500 border-red-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                    }`}
                  >
                    {updating === product.id ? '...' : product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
