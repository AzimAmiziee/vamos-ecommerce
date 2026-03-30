'use client';

import { Product } from '@/app/data/products';
import { useState } from 'react';
import { useCart } from '@/lib/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);

  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }

    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      collection: product.collection,
      size: selectedSize || 'One Size',
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const displayImage = hovered && product.hoverImage ? product.hoverImage : product.image;

  return (
    <div className="bg-[#060d14] border border-[#1A1A1A] hover:border-[#42deef]/60 card-hover group overflow-hidden relative">
      {/* Product Image */}
      <div
        className="relative h-72 bg-[#0A0A0A] overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        {/* Price badge */}
        <div className="absolute top-0 left-0 bg-[#42deef] text-[#0A0A0A] px-3 py-1 text-xs font-black uppercase tracking-widest">
          RM {product.price}
        </div>
        {/* Collection badge */}
        <div className="absolute top-0 right-0 bg-[#0A0A0A]/80 text-gray-400 px-3 py-1 text-xs uppercase tracking-widest">
          {product.collection}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60" />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="text-[#42deef] text-xs font-black uppercase tracking-[0.2em] mb-2">
          {product.category}
        </div>

        <h3 className="text-sm font-black text-white uppercase mb-2 line-clamp-2 tracking-wide">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Sizes */}
        {hasSizes && (
          <div className="mb-4">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 transition-colors ${sizeError ? 'text-red-400' : 'text-gray-600'}`}>
              {sizeError ? 'Select a size to continue' : selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes!.slice(0, 8).map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`border text-xs px-2 py-0.5 uppercase tracking-wide transition-colors ${
                    selectedSize === size
                      ? 'border-[#42deef] bg-[#42deef]/10 text-[#42deef]'
                      : sizeError
                      ? 'border-red-500/50 text-red-400/70 hover:border-red-400 hover:text-red-400'
                      : 'border-[#2A2A2A] text-gray-500 hover:border-[#42deef] hover:text-[#42deef]'
                  }`}
                >
                  {size}
                </button>
              ))}
              {product.sizes!.length > 8 && (
                <span className="text-gray-600 text-xs px-1 py-0.5">+{product.sizes!.length - 8}</span>
              )}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center mb-5">
          <div className="flex text-[#42deef] text-xs">
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
          </div>
          <span className="text-gray-600 text-xs ml-2">({product.rating})</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`btn-premium w-full py-3 px-4 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
            isAdded
              ? 'bg-green-600 text-white'
              : sizeError
              ? 'bg-red-500/20 border border-red-500/50 text-red-400'
              : 'bg-[#42deef] text-[#0A0A0A] hover:bg-[#1cc5d9] hover:shadow-[0_0_20px_rgba(66,222,239,0.4)]'
          }`}
        >
          {isAdded ? '✓ Added to Cart' : sizeError ? 'Select a Size First' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
