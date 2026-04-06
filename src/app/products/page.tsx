'use client';

import Header from '@/app/components/Header';
import ProductCard from '@/app/components/ProductCard';
import { useState, useEffect } from 'react';
import type { DBProduct } from '@/lib/db/products';
import { createClient } from '@/lib/supabase/client';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('sort_order', { ascending: true })
      .then(({ data }: { data: DBProduct[] | null }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-[#0A0A0A] min-h-screen pt-20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#42deef]" />
            <span className="text-[#42deef] text-xs font-black uppercase tracking-[0.3em]">Official Store</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-none mb-3">
            The <span className="text-[#42deef]">Collection</span>
          </h1>
          <p className="text-gray-500 text-sm">Official Team Vamos merchandise. Rep the grind.</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs font-black uppercase tracking-widest transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#42deef] text-[#0A0A0A] border-[#42deef]'
                  : 'bg-transparent text-gray-400 border-[#1A1A1A] hover:border-[#42deef]/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#060d14] border border-[#1A1A1A] h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">No products in this category.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage${product.image}`
                    : '',
                  hoverImage: product.hover_image
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage${product.hover_image}`
                    : undefined,
                  category: product.category,
                  collection: product.collection ?? '',
                  description: product.description ?? '',
                  sizes: product.sizes,
                  rating: product.rating,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
