import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Search,
  Filter,
  SlidersHorizontal,
  Grid2X2,
  Rows,
  Heart,
  ShoppingBag,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Product, PRODUCTS, CATEGORIES, COLLECTIONS } from '../../data/products';
import { formatPrice } from '../../utils/cart';
import { sound } from '../../utils/audio';

interface CategoryScreenProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  currency: string;
  darkMode: boolean;
}

// Category visual cards data
const CATEGORY_CARDS = [
  {
    id: 'jackets',
    name: 'Jackets',
    subtitle: 'Outerwear & Overshirts',
    count: 3,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/collar-jacket.webp',
    filterCategory: 'Jackets',
  },
  {
    id: 'polos',
    name: 'Polos',
    subtitle: 'Textured & Ribbed Knits',
    count: 2,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/textured-knit-polo.webp',
    filterCategory: 'Polos',
  },
  {
    id: 'sweaters',
    name: 'Sweaters',
    subtitle: 'Cardigans & Half-Zips',
    count: 2,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/fuzzy-cardigan.webp',
    filterCategory: 'Sweaters',
  },
  {
    id: 'trousers',
    name: 'Trousers',
    subtitle: 'Pleated & Utility Pants',
    count: 2,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/pleated-trouser.webp',
    filterCategory: 'Trousers',
  },
  {
    id: 'sweatshirts',
    name: 'Sweatshirts',
    subtitle: '500 GSM Heavyweight Terry',
    count: 2,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/crewneck-sweatshirt.webp',
    filterCategory: 'Sweatshirts',
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    subtitle: 'Boxy Cotton & Jersey',
    count: 2,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/category-oversized-tee.webp',
    filterCategory: 'T-Shirts',
  },
  {
    id: 'shorts',
    name: 'Shorts',
    subtitle: 'Japanese Typewriter Cotton',
    count: 1,
    image: 'https://avignonusa.com/wp-content/uploads/2026/09/category-oversized-tee.webp',
    filterCategory: 'Shorts',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subtitle: 'Tuscan Calfskin & Merino',
    count: 2,
    image: '/src/assets/images/luxury_leather_cardholder_1793406475540.jpg',
    filterCategory: 'Accessories',
  },
  {
    id: 'new',
    name: 'New Arrivals',
    subtitle: 'FW 2026 Atelier Collection',
    count: 5,
    image: '/src/assets/images/editorial_onboarding_look_1793406475024.jpg',
    isNew: true,
  },
  {
    id: 'bestsellers',
    name: 'Best Sellers',
    subtitle: 'Avignon Iconic Silhouettes',
    count: 4,
    image: 'https://avignonusa.com/wp-content/uploads/2026/10/Ribbed-Polo-Minimalist-Fashion-Ad.webp',
    isBest: true,
  },
];

export const CategoryScreen: React.FC<CategoryScreenProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onSelectProduct,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  currency,
  darkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'single'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // In collection view vs hub view
  const isDetailView = selectedCategoryId !== '' && selectedCategoryId !== 'hub';

  // Filter products for the selected category
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (isDetailView && selectedCategoryId !== 'all') {
      if (selectedCategoryId === 'new') {
        list = list.filter((p) => p.isNewArrival);
      } else if (selectedCategoryId === 'bestsellers') {
        list = list.filter((p) => p.isBestSeller);
      } else {
        const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);
        const name = cat ? cat.name.toLowerCase() : selectedCategoryId.toLowerCase();
        list = list.filter(
          (p) =>
            p.category.toLowerCase() === name ||
            p.collection.toLowerCase() === name ||
            p.slug.includes(name)
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedSizeFilter !== 'all') {
      list = list.filter((p) => p.sizes.includes(selectedSizeFilter));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return list;
  }, [selectedCategoryId, searchQuery, selectedSizeFilter, sortBy, isDetailView]);

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === selectedCategoryId) || {
    id: 'all',
    name: 'All Collection',
    count: PRODUCTS.length,
  };

  return (
    <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-10">
      {/* Sticky Top Bar */}
      <header
        className={`sticky top-0 z-30 px-5 py-3 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
          darkMode
            ? 'bg-[#0E0F12]/85 border-neutral-800/80 text-white'
            : 'bg-[#FAF9F6]/85 border-neutral-200/80 text-neutral-900'
        }`}
      >
        <div className="flex items-center gap-2">
          {isDetailView ? (
            <button
              onClick={() => {
                sound.tap();
                onSelectCategory('hub');
              }}
              className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Categories</span>
            </button>
          ) : (
            <h1 className="font-editorial text-lg tracking-wider font-semibold">
              COLLECTIONS & EDITS
            </h1>
          )}
        </div>

        {isDetailView && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayoutMode(layoutMode === 'grid' ? 'single' : 'grid')}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
              title="Toggle Layout"
            >
              {layoutMode === 'grid' ? <Rows className="w-3.5 h-3.5" /> : <Grid2X2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowFiltersModal(true)}
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
              title="Sort & Filter"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* SEARCH BAR */}
      <div className="px-5 pt-4 pb-2">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wool, polo, jacket, trousers..."
            className={`w-full h-11 pl-10 pr-4 rounded-xl text-xs transition-colors focus:outline-none ${
              darkMode
                ? 'bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600'
                : 'bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-neutral-500 hover:text-neutral-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: CATEGORY HUB (Animated Staggered Cards) */}
      {!isDetailView ? (
        <div className="px-5 pt-2">
          <div className="mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
              Avignon Wardrobe Taxonomy
            </span>
            <h2 className="font-editorial text-2xl font-normal text-white">
              Browse Categories
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select an edit to explore tailored silhouettes and tactile fabrics.
            </p>
          </div>

          <div className="space-y-3">
            {CATEGORY_CARDS.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                onClick={() => {
                  sound.tap();
                  onSelectCategory(card.id);
                }}
                className="relative h-28 rounded-2xl overflow-hidden cursor-pointer group border border-white/10 shadow-lg"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 brightness-[0.72]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-4 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
                      {card.count} Silhouettes
                    </span>
                    <h3 className="font-editorial text-2xl font-normal leading-tight">
                      {card.name}
                    </h3>
                    <p className="text-[11px] text-neutral-300 mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-neutral-900 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW 2: COLLECTION DETAIL GRID */
        <div className="px-5 pt-2">
          {/* Collection Header Banner */}
          <div className="mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
              Collection
            </span>
            <div className="flex items-baseline justify-between">
              <h2 className="font-editorial text-2xl font-normal text-white">
                {activeCategoryMeta.name}
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                {filteredProducts.length} items
              </span>
            </div>
          </div>

          {/* Quick Size Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-2">
            {['all', 'S', 'M', 'L', 'XL', '28', '30', '32', '34'].map((size) => (
              <button
                key={size}
                onClick={() => {
                  sound.tap();
                  setSelectedSizeFilter(size);
                }}
                className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  selectedSizeFilter === size
                    ? 'bg-white text-neutral-900 border-white font-semibold'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {size === 'all' ? 'All Sizes' : size}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-neutral-400 mb-2">No matching silhouettes found.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSizeFilter('all');
                }}
                className="text-xs text-white underline underline-offset-4"
              >
                Reset filters
              </button>
            </div>
          ) : layoutMode === 'grid' ? (
            /* 2-Column Grid */
            <div className="grid grid-cols-2 gap-3.5">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                        loading="lazy"
                      />

                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'
                          }`}
                        />
                      </button>

                      {/* Quick Add Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.addToBag();
                          onQuickAdd(product);
                        }}
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>

                      {product.badge && (
                        <span className="absolute bottom-2.5 left-2.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] uppercase font-semibold text-neutral-300">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {product.colors.slice(0, 3).map((c) => (
                          <span
                            key={c.name}
                            className="w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                      <h4 className="text-xs font-medium text-neutral-200 line-clamp-1 mt-1">
                        {product.title}
                      </h4>
                      <div className="text-xs font-mono font-semibold text-white">
                        {formatPrice(product.price, currency)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Single-Column Large Editorial Lookbook */
            <div className="space-y-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      sound.tap();
                      onSelectProduct(product);
                    }}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-neutral-900/50 border border-neutral-800"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-neutral-400">
                            {product.collection} · {product.category}
                          </span>
                          <h3 className="font-editorial text-lg text-white font-normal">
                            {product.title}
                          </h3>
                        </div>
                        <div className="text-sm font-mono font-bold text-white">
                          {formatPrice(product.price, currency)}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                        <div className="flex items-center gap-1.5">
                          {product.colors.map((c) => (
                            <span
                              key={c.name}
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.addToBag();
                            onQuickAdd(product);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-white text-neutral-900 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FILTER & SORT MODAL */}
      <AnimatePresence>
        {showFiltersModal && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-[430px] rounded-t-3xl bg-[#141519] border-t border-neutral-800 p-5 text-white shadow-2xl"
            >
              <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-lg">Sort & Filter</h3>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Done
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Sort Order
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'featured', label: 'Featured' },
                      { id: 'newest', label: 'Newest Arrivals' },
                      { id: 'price-asc', label: 'Price: Low to High' },
                      { id: 'price-desc', label: 'Price: High to Low' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id as typeof sortBy);
                          sound.tap();
                        }}
                        className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                          sortBy === opt.id
                            ? 'bg-white text-neutral-900 border-white font-semibold'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowFiltersModal(false)}
                className="w-full h-12 mt-6 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
