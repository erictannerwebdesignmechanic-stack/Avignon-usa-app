import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Check,
  CreditCard,
  ShieldCheck,
  Truck,
  MapPin,
  Lock,
  ArrowRight,
  Package,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CartItem, PromoCode, DeliverySpeed, DELIVERY_OPTIONS, calculateTotalBreakdown, formatPrice, generateOrderNumber } from '../../utils/cart';
import { OrderRecord, SavedAddress } from '../../types/app';
import { sound } from '../../utils/audio';

interface CheckoutModalProps {
  items: CartItem[];
  appliedPromo: PromoCode | null;
  onClose: () => void;
  onOrderCompleted: (order: OrderRecord) => void;
  currency: string;
  darkMode: boolean;
}

type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review' | 'success';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  appliedPromo,
  onClose,
  onOrderCompleted,
  currency,
  darkMode,
}) => {
  const [step, setStep] = useState<CheckoutStep>('address');

  // Address form
  const [fullName, setFullName] = useState('Eric Tanner');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [apt, setApt] = useState('Suite 4B');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97477');
  const [phone, setPhone] = useState('+1 (555) 392-1084');

  // Delivery option
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'klarna'>('apple_pay');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('891');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Resulting completed order
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  const breakdown = calculateTotalBreakdown(items, deliverySpeed, appliedPromo);

  const handleNextStep = () => {
    sound.tap();
    if (step === 'address') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else if (step === 'payment') setStep('review');
  };

  const handleAuthorizeOrder = () => {
    sound.tap();
    setIsAuthorizing(true);

    setTimeout(() => {
      setIsAuthorizing(false);
      sound.success();

      const newOrder: OrderRecord = {
        id: generateOrderNumber(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        items: [...items],
        subtotal: breakdown.subtotal,
        discount: breakdown.discount,
        shipping: breakdown.shipping,
        tax: breakdown.tax,
        total: breakdown.total,
        status: 'Atelier Processing',
        trackingNumber: `DHL-AV-${Math.floor(10000000 + Math.random() * 90000000)}`,
        deliverySpeed,
        shippingAddress: {
          id: 'addr-active',
          label: 'Primary Residence',
          fullName,
          street,
          apt,
          city,
          state,
          postalCode,
          country: 'United States',
          phone,
          isDefault: true,
        },
        paymentMethod:
          paymentMethod === 'apple_pay'
            ? 'Apple Pay (Face ID authorized)'
            : paymentMethod === 'klarna'
            ? 'Klarna 4 Interest-Free Payments'
            : 'Visa ending in 4242',
        estimatedDelivery:
          deliverySpeed === 'express'
            ? 'Tomorrow by 12:00 PM'
            : deliverySpeed === 'white_glove'
            ? 'Today evening between 6–8 PM'
            : 'In 3–4 business days',
      };

      setCompletedOrder(newOrder);
      setStep('success');
      onOrderCompleted(newOrder);
    }, 1400);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#0E0F12] text-neutral-100 overflow-hidden select-none">
      {/* Top Header */}
      <header className="px-4 py-3.5 border-b border-neutral-800/80 bg-[#0E0F12]/90 backdrop-blur-md flex items-center justify-between">
        {step !== 'success' ? (
          <button
            onClick={() => {
              sound.tap();
              if (step === 'review') setStep('payment');
              else if (step === 'payment') setStep('delivery');
              else if (step === 'delivery') setStep('address');
              else onClose();
            }}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{step === 'address' ? 'Bag' : 'Back'}</span>
          </button>
        ) : (
          <div />
        )}

        <div className="text-center">
          <span className="font-editorial text-sm tracking-wider uppercase text-white">
            {step === 'success' ? 'Order Confirmed' : 'Atelier Checkout'}
          </span>
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              {['address', 'delivery', 'payment', 'review'].map((s, idx) => (
                <div
                  key={s}
                  className={`w-3.5 h-1 rounded-full transition-colors ${
                    step === s ? 'bg-white' : idx < ['address', 'delivery', 'payment', 'review'].indexOf(step) ? 'bg-neutral-500' : 'bg-neutral-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {step !== 'success' ? (
          <div className="text-xs font-mono font-semibold text-white">
            {formatPrice(breakdown.total, currency)}
          </div>
        ) : (
          <button
            onClick={onClose}
            className="text-xs text-white uppercase tracking-wider font-semibold"
          >
            Done
          </button>
        )}
      </header>

      {/* Main Checkout View Area */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar p-5">
        <AnimatePresence mode="wait">
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 'address' && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                  Step 1 of 4
                </span>
                <h3 className="font-editorial text-2xl text-white">
                  Shipping Destination
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Orders are dispatched in custom sealed matte black Avignon packaging.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Apt, Suite, Unit</label>
                    <input
                      type="text"
                      value={apt}
                      onChange={(e) => setApt(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Phone Number (Courier Dispatch)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNextStep}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Continue to Delivery Options</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DELIVERY OPTIONS */}
          {step === 'delivery' && (
            <motion.div
              key="delivery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                  Step 2 of 4
                </span>
                <h3 className="font-editorial text-2xl text-white">
                  Courier Delivery
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select your preferred atelier transport velocity.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {(['standard', 'express', 'white_glove'] as DeliverySpeed[]).map((spd) => {
                  const opt = DELIVERY_OPTIONS[spd];
                  const fee = appliedPromo?.freeShipping ? 0 : breakdown.subtotal >= opt.thresholdForFree ? 0 : opt.baseFee;
                  const isSelected = deliverySpeed === spd;

                  return (
                    <div
                      key={spd}
                      onClick={() => {
                        sound.tap();
                        setDeliverySpeed(spd);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-white bg-neutral-900/90 shadow-md'
                          : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center ${
                            isSelected ? 'border-white bg-white text-neutral-900' : 'border-neutral-600'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-white">
                              {opt.name}
                            </h4>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              {opt.estimate}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono text-xs font-bold text-white">
                          {fee === 0 ? 'Complimentary' : formatPrice(fee, currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNextStep}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                  Step 3 of 4
                </span>
                <h3 className="font-editorial text-2xl text-white">
                  Payment Authorization
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Encrypted 256-bit SSL transaction via Apple Secure Enclave.
                </p>
              </div>

              {/* Payment selector tabs */}
              <div className="space-y-3 pt-2">
                {/* Apple Pay */}
                <div
                  onClick={() => {
                    sound.tap();
                    setPaymentMethod('apple_pay');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-white bg-neutral-900/90'
                      : 'border-neutral-800 bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                        
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Apple Pay</h4>
                        <p className="text-[11px] text-neutral-400">One-touch biometric authorization</p>
                      </div>
                    </div>
                    {paymentMethod === 'apple_pay' && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => {
                    sound.tap();
                    setPaymentMethod('card');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-white bg-neutral-900/90'
                      : 'border-neutral-800 bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Credit / Debit Card</h4>
                        <p className="text-[11px] text-neutral-400">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    {paymentMethod === 'card' && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-3 border-t border-neutral-800 space-y-3">
                      <div>
                        <label className="block text-[10px] text-neutral-400 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-1">Exp Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 mb-1">CVC</label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Klarna Installments */}
                <div
                  onClick={() => {
                    sound.tap();
                    setPaymentMethod('klarna');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'klarna'
                      ? 'border-white bg-neutral-900/90'
                      : 'border-neutral-800 bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFB3C7] text-neutral-900 flex items-center justify-center font-bold text-xs">
                        K.
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Klarna 4 Installments</h4>
                        <p className="text-[11px] text-neutral-400">
                          4 interest-free payments of {formatPrice(breakdown.total / 4, currency)}
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'klarna' && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNextStep}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ORDER REVIEW & PLACE ORDER */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                  Step 4 of 4
                </span>
                <h3 className="font-editorial text-2xl text-white">
                  Final Review
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Confirm shipping details and authorize your atelier acquisition.
                </p>
              </div>

              {/* Items summary */}
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Order Items ({breakdown.itemCount})
                </span>
                <div className="space-y-2">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt="" className="w-9 h-11 object-cover rounded-md" />
                        <div>
                          <p className="font-medium text-white line-clamp-1">{it.title}</p>
                          <p className="text-[10px] text-neutral-400">Qty: {it.quantity} · {it.size}</p>
                        </div>
                      </div>
                      <span className="font-mono text-white">{formatPrice(it.price * it.quantity, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination & Payment Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase font-semibold mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>Ship To</span>
                  </div>
                  <p className="text-white font-medium">{fullName}</p>
                  <p className="text-neutral-400 text-[11px]">{street}, {apt}</p>
                  <p className="text-neutral-400 text-[11px]">{city}, {state} {postalCode}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] uppercase font-semibold mb-1">
                    <Truck className="w-3 h-3" />
                    <span>Courier</span>
                  </div>
                  <p className="text-white font-medium">{DELIVERY_OPTIONS[deliverySpeed].name}</p>
                  <p className="text-neutral-400 text-[11px]">{DELIVERY_OPTIONS[deliverySpeed].estimate}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatPrice(breakdown.subtotal, currency)}</span>
                </div>
                {breakdown.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(breakdown.discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-white">
                    {breakdown.shipping === 0 ? 'Complimentary' : formatPrice(breakdown.shipping, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8.25%)</span>
                  <span className="font-mono text-white">{formatPrice(breakdown.tax, currency)}</span>
                </div>
                <div className="h-px bg-neutral-800 my-1" />
                <div className="flex justify-between text-sm font-semibold text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-base font-bold">{formatPrice(breakdown.total, currency)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={isAuthorizing}
                  onClick={handleAuthorizeOrder}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                >
                  {isAuthorizing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Apple Pay...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize Order · {formatPrice(breakdown.total, currency)}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: ORDER CONFIRMATION & TRACKING TIMELINE */}
          {step === 'success' && completedOrder && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 text-center pt-2"
            >
              {/* Checkmark icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto"
              >
                <Check className="w-8 h-8 stroke-[3]" />
              </motion.div>

              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">
                  Atelier Acquisition Confirmed
                </span>
                <h2 className="font-editorial text-2xl text-white mt-1">
                  Thank You, {fullName.split(' ')[0]}
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  Order Reference: <strong className="text-white">{completedOrder.id}</strong>
                </p>
              </div>

              {/* Order Tracking Telemetry Timeline */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-neutral-300" />
                    <span className="text-xs font-semibold text-white">Tracking Telemetry</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {completedOrder.trackingNumber}
                  </span>
                </div>

                <div className="space-y-3 relative pl-4 border-l border-neutral-800">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
                    <p className="text-xs font-medium text-white">Order Received & Card Authorized</p>
                    <p className="text-[10px] text-neutral-400">Just now · Assigned to atelier floor</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <p className="text-xs font-medium text-neutral-400">Atelier Garment Inspection & Pressing</p>
                    <p className="text-[10px] text-neutral-500">Scheduled within 2 hours</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <p className="text-xs font-medium text-neutral-400">Dispatched via DHL Express Courier</p>
                    <p className="text-[10px] text-neutral-500">Estimated delivery: {completedOrder.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-lg"
                >
                  <span>Return to Store</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
