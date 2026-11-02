import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product, PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/cart';
import { sound } from '../../utils/audio';

interface WishlistScreenProps {
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onExplore: () => void;
  currency: string;
  darkMode: boolean;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  onExplore,
  currency,
  darkMode,
}) => {
  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-10 bg-[#0E0F12] text-neutral-100 select-none">
      <header className="sticky top-0 z-30 px-5 py-3.5 border-b border-neutral-800/80 bg-[#0E0F12]/90 backdrop-blur-md flex items-center justify-between">
        <h1 className="font-editorial text-lg tracking-wider font-semibold text-white">
          SAVED PIECES
        </h1>
        <span className="text-xs font-mono text-neutral-400">
          {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'silhouette' : 'silhouettes'}
        </span>
      </header>

      <div className="p-5">
        {wishlistedProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-editorial text-xl text-white">Your Saved List is Empty</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                Tap the heart on any Avignon jacket, knit polo, or tailored trouser to curate your seasonal wardrobe.
              </p>
            </div>
            <button
              onClick={onExplore}
              className="px-6 py-2.5 rounded-xl bg-white text-neutral-900 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              Browse Edits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {wishlistedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => {
                  sound.tap();
                  onSelectProduct(product);
                }}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 mb-2.5">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Remove from wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.tap();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all"
                    title="Remove from saved"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Move to bag button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.addToBag();
                      onQuickAdd(product);
                    }}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-xl bg-white text-neutral-900 text-[10px] font-semibold flex items-center gap-1 shadow-lg active:scale-95 transition-transform"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Move to Bag</span>
                  </button>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                    {product.collection}
                  </span>
                  <h4 className="text-xs font-medium text-neutral-200 line-clamp-1">
                    {product.title}
                  </h4>
                  <div className="text-xs font-mono font-semibold text-white">
                    {formatPrice(product.price, currency)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
