import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  X,
  Sparkles,
} from 'lucide-react';
import { CartItem, PromoCode, calculateTotalBreakdown, formatPrice, validatePromoCode } from '../../utils/cart';
import { sound } from '../../utils/audio';

interface CartDrawerProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  onClose: () => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (promo: PromoCode | null) => void;
  currency: string;
  darkMode: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onClose,
  appliedPromo,
  onApplyPromo,
  currency,
  darkMode,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const breakdown = calculateTotalBreakdown(items, 'standard', appliedPromo);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (!promoInput.trim()) return;

    const res = validatePromoCode(promoInput, breakdown.subtotal);
    if (!res.valid) {
      setPromoError(res.error || 'Invalid code');
      sound.tap();
    } else if (res.promo) {
      sound.success();
      onApplyPromo(res.promo);
      setPromoSuccess(`Applied: ${res.promo.description}`);
      setPromoInput('');
    }
  };

  const handleRemovePromo = () => {
    sound.tap();
    onApplyPromo(null);
    setPromoSuccess('');
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between overflow-hidden bg-[#0E0F12] text-neutral-100 select-none">
      {/* Top Header */}
      <header className="px-5 py-3.5 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-neutral-300" />
          <h2 className="font-editorial text-lg text-white">Your Shopping Bag</h2>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          {breakdown.itemCount} {breakdown.itemCount === 1 ? 'item' : 'items'}
        </span>
      </header>

      {/* Free Shipping Progress bar */}
      <div className="px-5 py-2.5 bg-neutral-900/60 border-b border-neutral-800 text-[11px]">
        {breakdown.subtotal >= 150 ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Truck className="w-3.5 h-3.5" />
            <span>Unlocked: Complimentary Express Courier Shipping</span>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Add {formatPrice(150 - breakdown.subtotal, currency)} for Complimentary Courier</span>
              <span className="font-mono">{Math.round((breakdown.subtotal / 150) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${Math.min(100, (breakdown.subtotal / 150) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Items List or Empty State */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-editorial text-xl text-white">Your Bag is Empty</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                Discover modern American silhouettes, honest European wools, and tailored daily essentials.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white text-neutral-900 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex gap-3.5"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details & Controls */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Size: {item.size} · Color: {item.color}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      sound.tap();
                      onRemoveItem(item.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2.5 bg-neutral-800/80 border border-neutral-700/60 rounded-lg px-2 py-0.5">
                    <button
                      onClick={() => {
                        sound.tap();
                        onUpdateQuantity(item.id, item.quantity - 1);
                      }}
                      className="text-xs font-bold text-neutral-400 hover:text-white w-4 text-center"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-semibold w-3 text-center text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        sound.tap();
                        onUpdateQuantity(item.id, item.quantity + 1);
                      }}
                      className="text-xs font-bold text-neutral-400 hover:text-white w-4 text-center"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-mono text-xs font-bold text-white">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Promo code application */}
        {items.length > 0 && (
          <div className="pt-2">
            {appliedPromo ? (
              <div className="p-3 rounded-xl bg-neutral-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Tag className="w-3.5 h-3.5" />
                  <span>
                    <strong>{appliedPromo.code}:</strong> {appliedPromo.description}
                  </span>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-neutral-400 hover:text-white"
                  title="Remove promo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. AVIGNON10)"
                    className="flex-1 h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                  <button
                    type="submit"
                    className="px-4 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-rose-400 pl-1">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-emerald-400 pl-1">{promoSuccess}</p>}
                <p className="text-[9px] text-neutral-500 pl-1">
                  Try codes: <code className="text-neutral-300">AVIGNON10</code>, <code className="text-neutral-300">FREESHIP</code>, <code className="text-neutral-300">ATELIER50</code>
                </p>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Bottom Summary & Checkout CTA */}
      {items.length > 0 && (
        <div className="p-5 border-t border-neutral-800 bg-[#0E0F12]/95 backdrop-blur-md space-y-3">
          <div className="space-y-1.5 text-xs text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white">{formatPrice(breakdown.subtotal, currency)}</span>
            </div>
            {breakdown.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount</span>
                <span className="font-mono">-{formatPrice(breakdown.discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-mono text-white">
                {breakdown.shipping === 0 ? 'Complimentary' : formatPrice(breakdown.shipping, currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax</span>
              <span className="font-mono text-white">{formatPrice(breakdown.tax, currency)}</span>
            </div>
            <div className="h-px bg-neutral-800 my-1" />
            <div className="flex justify-between text-sm font-semibold text-white">
              <span>Estimated Total</span>
              <span className="font-mono text-base font-bold">{formatPrice(breakdown.total, currency)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.tap();
              onProceedToCheckout();
            }}
            className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-xl"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
