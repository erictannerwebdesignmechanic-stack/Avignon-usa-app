import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Heart,
  Share2,
  ZoomIn,
  X,
  Check,
  Ruler,
  ShoppingBag,
  Sparkles,
  Shield,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Product, PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/cart';
import { sound } from '../../utils/audio';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  currency: string;
  darkMode: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  currency,
  darkMode,
}) => {
  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'details' | 'fabric' | 'shipping' | null>('details');
  const [addedToast, setAddedToast] = useState(false);

  const currentStock = product.stock[selectedSize] ?? 5;

  const handleAdd = () => {
    sound.addToBag();
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const pairsWellWith = PRODUCTS.filter((p) =>
    product.pairsWellWithIds?.includes(p.id)
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#0E0F12] text-neutral-100 overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-neutral-800/80 bg-[#0E0F12]/90 backdrop-blur-md">
        <button
          onClick={() => {
            sound.tap();
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Close product details"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-editorial text-sm tracking-wider uppercase text-neutral-400">
          Avignon Atelier
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.tap();
              onToggleWishlist(product.id);
            }}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Scrollable PDP Content */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-24">
        {/* Image Gallery with Zoom trigger */}
        <div className="relative aspect-[4/5] w-full bg-neutral-900 overflow-hidden">
          <img
            src={product.images[activeImageIdx] || product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setIsZoomOpen(true)}
          />

          {/* Zoom button */}
          <button
            onClick={() => setIsZoomOpen(true)}
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-lg hover:scale-105 transition-transform"
            title="Zoom image"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Dot Indicators if multiple images */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImageIdx === i ? 'bg-white w-4' : 'bg-white/40'
                  }`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail row */}
        {product.images.length > 1 && (
          <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-neutral-800">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  sound.tap();
                  setActiveImageIdx(i);
                }}
                className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIdx === i ? 'border-white' : 'border-neutral-800 opacity-60'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Title, Subtitle, Price */}
        <div className="px-5 pt-4 pb-4 space-y-1.5 border-b border-neutral-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
              {product.collection} · {product.category}
            </span>
            {product.badge && (
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-neutral-300">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="font-editorial text-2xl font-normal text-white">
            {product.title}
          </h1>

          <p className="text-xs text-neutral-400">{product.subtitle}</p>

          <div className="pt-1 flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-white">
              {formatPrice(product.price, currency)}
            </span>
            <span className="text-[11px] text-neutral-400">
              Taxes calculated at checkout
            </span>
          </div>
        </div>

        {/* COLOR SELECTION */}
        <div className="px-5 py-4 border-b border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Color: <span className="text-white normal-case">{selectedColor}</span>
            </label>
          </div>

          <div className="flex gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  sound.tap();
                  setSelectedColor(c.name);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                  selectedColor === c.name
                    ? 'border-white bg-white/10 text-white'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SIZE SELECTION & STOCK BADGE */}
        <div className="px-5 py-4 border-b border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Select Size
              </label>
              {currentStock <= 3 && (
                <span className="text-[10px] text-amber-400 font-medium">
                  · Only {currentStock} remaining
                </span>
              )}
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Size Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {product.sizes.map((size) => {
              const stockCount = product.stock[size] ?? 5;
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => {
                    sound.tap();
                    setSelectedSize(size);
                  }}
                  className={`h-11 rounded-xl text-xs font-semibold flex flex-col items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-white text-neutral-900 border-white shadow-md'
                      : 'bg-neutral-900/80 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span>{size}</span>
                  <span className={`text-[8px] ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>
                    {stockCount > 0 ? `${stockCount} left` : 'Sold out'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUANTITY SELECTOR */}
        <div className="px-5 py-3 border-b border-neutral-800/80 flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-400">Quantity</span>
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1">
            <button
              onClick={() => {
                if (quantity > 1) {
                  sound.tap();
                  setQuantity(quantity - 1);
                }
              }}
              className="w-7 h-7 rounded text-sm font-bold text-neutral-400 hover:text-white"
            >
              -
            </button>
            <span className="font-mono text-xs font-semibold w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => {
                sound.tap();
                setQuantity(quantity + 1);
              }}
              className="w-7 h-7 rounded text-sm font-bold text-neutral-400 hover:text-white"
            >
              +
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="px-5 py-4 border-b border-neutral-800/80 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Description
          </h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* EXPANDABLE ACCORDIONS (Details, Fabric, Shipping) */}
        <div className="px-5 divide-y divide-neutral-800 border-b border-neutral-800/80">
          {/* Garment Details */}
          <div className="py-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
              className="w-full flex items-center justify-between text-xs font-semibold text-neutral-200"
            >
              <span>Silhouettes & Construction</span>
              {expandedSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection === 'details' && (
              <ul className="mt-2 space-y-1.5 text-xs text-neutral-400 list-disc list-inside">
                {product.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Fabric & Care */}
          <div className="py-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'fabric' ? null : 'fabric')}
              className="w-full flex items-center justify-between text-xs font-semibold text-neutral-200"
            >
              <span>Fabric & Care Instructions</span>
              {expandedSection === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection === 'fabric' && (
              <div className="mt-2 space-y-2 text-xs text-neutral-400">
                <p><strong className="text-white font-medium">Composition:</strong> {product.fabric}</p>
                <p><strong className="text-white font-medium">Care:</strong> {product.care}</p>
              </div>
            )}
          </div>

          {/* Delivery & Returns */}
          <div className="py-3">
            <button
              onClick={() => setExpandedSection(expandedSection === 'shipping' ? null : 'shipping')}
              className="w-full flex items-center justify-between text-xs font-semibold text-neutral-200"
            >
              <span>Complimentary Delivery & Returns</span>
              {expandedSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandedSection === 'shipping' && (
              <div className="mt-2 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Complimentary standard shipping on all orders over $150.</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>30-day atelier returns with prepaid courier labels.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAIRS WELL WITH */}
        {pairsWellWith.length > 0 && (
          <div className="px-5 pt-6 pb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
              Considered Pairings
            </span>
            <h3 className="font-editorial text-lg text-white mb-3">
              Pairs Well With
            </h3>

            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {pairsWellWith.map((pair) => (
                <div
                  key={pair.id}
                  onClick={() => {
                    sound.tap();
                    onSelectProduct(pair);
                  }}
                  className="shrink-0 w-[140px] cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border border-white/5 mb-1.5">
                    <img
                      src={pair.images[0]}
                      alt={pair.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h5 className="text-[11px] font-medium text-neutral-200 line-clamp-1">
                    {pair.title}
                  </h5>
                  <div className="text-[11px] font-mono text-white font-semibold">
                    {formatPrice(pair.price, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM PURCHASE BAR */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800 bg-[#0E0F12]/95 backdrop-blur-xl flex items-center gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Total</span>
          <span className="text-base font-mono font-bold text-white">
            {formatPrice(product.price * quantity, currency)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-xl"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Bag</span>
        </button>
      </div>

      {/* ADDED TO BAG TOAST */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-20 left-4 right-4 z-50 p-3 rounded-2xl bg-neutral-900/95 border border-white/20 text-white backdrop-blur-xl shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold">{product.title} Added</p>
                <p className="text-[10px] text-neutral-400">Size: {selectedSize} · {selectedColor}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold">{formatPrice(product.price * quantity, currency)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 flex flex-col justify-between p-4"
          >
            <div className="flex justify-between items-center text-white">
              <span className="text-xs font-mono text-neutral-400">High-Resolution Studio Loupe</span>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden py-4">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <p className="text-center text-xs text-neutral-400">
              Pinch or pan to explore fabric weave and stitching
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-[430px] rounded-t-3xl bg-[#141519] border-t border-neutral-800 p-5 text-white max-h-[85vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-xl font-normal">Garment Sizing Matrix</h3>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-neutral-400 mb-4">
                All measurements are taken with the garment laid flat. Avignon silhouettes feature a modern, relaxed drape.
              </p>

              <div className="overflow-x-auto text-xs font-mono mb-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 text-[10px] uppercase">
                      <th className="py-2">Size</th>
                      <th className="py-2">Chest (in)</th>
                      <th className="py-2">Waist (in)</th>
                      <th className="py-2">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 text-neutral-300">
                    <tr><td className="py-2 font-bold text-white">S</td><td>38–40</td><td>30–31</td><td>27.5</td></tr>
                    <tr><td className="py-2 font-bold text-white">M</td><td>41–43</td><td>32–33</td><td>28.5</td></tr>
                    <tr><td className="py-2 font-bold text-white">L</td><td>44–46</td><td>34–35</td><td>29.5</td></tr>
                    <tr><td className="py-2 font-bold text-white">XL</td><td>47–49</td><td>36–38</td><td>30.5</td></tr>
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full h-11 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase"
              >
                Close Guide
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
