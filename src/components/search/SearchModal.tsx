import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product, PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/cart';
import { sound } from '../../utils/audio';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  currency: string;
  darkMode: boolean;
}

const POPULAR_SEARCHES = [
  'Collar Jacket',
  'Textured Knit Polo',
  'Pleated Trouser',
  'Italian Wool',
  'Puffer Jacket',
  'Fuzzy Cardigan',
  'French Terry',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  currency,
  darkMode,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#0E0F12] text-white">
      {/* Search Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search silhouettes, fabrics, colors..."
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-white font-medium"
        >
          Cancel
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        {/* Popular Tags */}
        {!query.trim() && (
          <div className="space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    sound.tap();
                    setQuery(tag);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Results */}
        {query.trim() && (
          <div className="space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              {results.length} Silhouettes Found
            </span>

            {results.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs">
                No matching pieces found for "{query}".
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      sound.tap();
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between cursor-pointer hover:border-neutral-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-14 object-cover rounded-xl"
                      />
                      <div>
                        <span className="text-[9px] uppercase font-mono text-neutral-400">
                          {product.collection}
                        </span>
                        <h4 className="text-xs font-semibold text-white">
                          {product.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400">{product.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-white">
                        {formatPrice(product.price, currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
