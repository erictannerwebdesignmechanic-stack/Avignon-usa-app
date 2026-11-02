import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Heart,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Filter,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, PRODUCTS, COLLECTIONS, CATEGORIES } from '../../data/products';
import { UserPreferences } from '../../types/app';
import { formatPrice } from '../../utils/cart';
import { sound } from '../../utils/audio';

interface HomeScreenProps {
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryId: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
  userPreferences: UserPreferences;
  onOpenSearch: () => void;
  currency: string;
  darkMode: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectProduct,
  onSelectCategory,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  userPreferences,
  onOpenSearch,
  currency,
  darkMode,
}) => {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);
  const featured = PRODUCTS.filter((p) => p.isFeatured);

  // Personalized recommendations: products matching user's preferred edits
  const personalized = PRODUCTS.filter((p) =>
    userPreferences.preferredCategories.includes(p.collection)
  ).slice(0, 4);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setVideoPlaying(false);
      }
    }
  };

  return (
    <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-10">
      {/* Editorial Sticky Header */}
      <header
        className={`sticky top-0 z-30 px-5 py-3 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
          darkMode
            ? 'bg-[#0E0F12]/85 border-neutral-800/80 text-white'
            : 'bg-[#FAF9F6]/85 border-neutral-200/80 text-neutral-900'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-editorial text-lg tracking-wider font-semibold">
            AVIGNON
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
            USA
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.tap();
              onOpenSearch();
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              darkMode ? 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
            aria-label="Search catalog"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Marquee Ticker */}
      <div
        className={`py-1.5 px-4 text-[10px] tracking-wider uppercase flex items-center justify-center gap-3 border-b overflow-hidden select-none ${
          darkMode ? 'bg-neutral-900/90 text-neutral-400 border-neutral-800' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
        }`}
      >
        <span className="font-medium text-white dark:text-neutral-200">FW 2026 Atelier</span>
        <span aria-hidden="true">·</span>
        <span>Four Considered Edits</span>
        <span aria-hidden="true">·</span>
        <span>Complimentary Express Courier</span>
      </div>

      {/* Hero Campaign Banner */}
      <section className="relative w-full aspect-[4/5] overflow-hidden">
        <img
          src="/src/assets/images/campaign_fw26_atelier_1793406475469.jpg"
          alt="Fall Winter 2026 Campaign"
          className="w-full h-full object-cover brightness-[0.88]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

        <div className="absolute bottom-6 left-5 right-5 text-white">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-medium">
              Fall / Winter 2026 Collection
            </span>
            <h1 className="font-editorial text-3xl font-normal leading-tight mt-1 mb-2">
              Four Considered Edits
            </h1>
            <p className="text-xs text-neutral-300 line-clamp-2 max-w-xs mb-4">
              Knitwear, outerwear, tailoring and the weekend — cut to work together, season after season.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  sound.tap();
                  onSelectProduct(PRODUCTS[0]); // Collar Jacket
                }}
                className="h-11 px-5 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
              >
                <span>Shop Outerwear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.tap();
                  onSelectCategory('all');
                }}
                className="h-11 px-4 rounded-xl bg-white/10 backdrop-blur-md text-white font-medium text-xs tracking-wider border border-white/20 hover:bg-white/20 transition-all"
              >
                Explore All
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Category Bar */}
      <section className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Shop by Category
          </h3>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-medium text-neutral-500 hover:text-white transition-colors"
          >
            View all ({CATEGORIES.length})
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.slice(1, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.tap();
                onSelectCategory(cat.id);
              }}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                darkMode
                  ? 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:text-neutral-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* New Arrivals Carousel */}
      <section className="pt-6 pb-2">
        <div className="px-5 flex items-center justify-between mb-3.5">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Fresh Off The Loom
            </span>
            <h2 className="font-editorial text-xl font-normal text-white dark:text-neutral-100">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('new')}
            className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 py-1">
          {newArrivals.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
                className="shrink-0 w-[170px] group cursor-pointer"
                onClick={() => {
                  sound.tap();
                  onSelectProduct(product);
                }}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 mb-2.5">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all"
                    aria-label={`Save ${product.title} to wishlist`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-wider font-semibold text-neutral-300">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                    {product.collection}
                  </div>
                  <h4 className="text-xs font-medium text-neutral-200 line-clamp-1">
                    {product.title}
                  </h4>
                  <div className="text-xs font-mono font-semibold text-white">
                    {formatPrice(product.price, currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Four Edits Bento Section */}
      <section className="px-5 pt-8 pb-4">
        <div className="mb-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
            Fall / Winter 2026
          </span>
          <h2 className="font-editorial text-2xl font-normal text-white">
            The Four Edits
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Carefully curated wardrobes designed to interconnect seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => {
                sound.tap();
                onSelectCategory(col.id.toLowerCase());
              }}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
            >
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 brightness-[0.78]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400">
                  {col.count} Silhouettes
                </span>
                <h4 className="font-editorial text-base font-normal leading-tight">
                  {col.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Urban Motion Video Section */}
      <section className="px-5 pt-6 pb-4">
        <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
          <video
            ref={videoRef}
            src="https://avignonusa.com/wp-content/uploads/2026/09/Models_walking_in_urban_environment_20260929110848-1.mp4"
            poster="https://avignonusa.com/wp-content/uploads/2026/10/hero-video-poster.webp"
            autoPlay
            loop
            muted={videoMuted}
            playsInline
            className="w-full h-full object-cover brightness-75"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Video Controls */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setVideoMuted(!videoMuted)}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
            >
              {videoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={toggleVideoPlay}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
            >
              <Play className={`w-3 h-3 fill-current ${videoPlaying ? 'opacity-40' : 'opacity-100'}`} />
            </button>
          </div>

          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <span className="text-[9px] uppercase tracking-widest text-neutral-400">
              Atelier Cinema
            </span>
            <h3 className="font-editorial text-lg leading-tight font-normal">
              Movement in Urban Architecture
            </h3>
          </div>
        </div>
      </section>

      {/* Best Sellers 2-Column Grid */}
      <section className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Timeless Staples
            </span>
            <h2 className="font-editorial text-xl font-normal text-white">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('bestsellers')}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {bestSellers.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <div
                key={product.id}
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
                    title="Quick Add to Bag"
                    aria-label={`Quick add ${product.title} to bag`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                    {product.category}
                  </div>
                  <h4 className="text-xs font-medium text-neutral-200 line-clamp-1">
                    {product.title}
                  </h4>
                  <div className="text-xs font-mono font-semibold text-white">
                    {formatPrice(product.price, currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Personalized Recommendations (Section 3 Requirement) */}
      {personalized.length > 0 && (
        <section className="px-5 pt-6 pb-4">
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 mb-3">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized For Your Style</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Calibrated for your <span className="text-white font-medium">{userPreferences.fit} fit</span> preference and seasonal edits.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {personalized.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  sound.tap();
                  onSelectProduct(product);
                }}
                className="shrink-0 w-[140px] cursor-pointer group"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border border-white/5 mb-1.5">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-[11px] font-medium text-neutral-200 line-clamp-1">
                  {product.title}
                </h4>
                <div className="text-[11px] font-mono text-white font-semibold">
                  {formatPrice(product.price, currency)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brand Craftsmanship / Heritage Story Card */}
      <section className="px-5 pt-6 pb-6">
        <div className="p-5 rounded-2xl bg-[#141519] border border-neutral-800 text-center space-y-3">
          <img
            src="https://avignonusa.com/wp-content/uploads/2026/09/avignon-mark-dark.png"
            alt="Avignon USA"
            className="w-8 h-8 mx-auto filter invert opacity-80"
          />
          <h3 className="font-editorial text-lg text-white">
            American Character, European Restraint
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
            Dense, honest fabrics, unhurried proportions and garments cut to endure well beyond the season.
          </p>
          <div className="pt-1">
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs text-white uppercase tracking-wider font-semibold border-b border-white pb-0.5 hover:opacity-80 transition-opacity"
            >
              Browse Complete Lookbook
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
