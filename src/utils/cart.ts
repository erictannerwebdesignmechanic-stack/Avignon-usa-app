export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  freeShipping?: boolean;
  minOrder?: number;
  description: string;
}

export const AVAILABLE_PROMOS: Record<string, PromoCode> = {
  AVIGNON10: {
    code: 'AVIGNON10',
    discountPercent: 10,
    description: '10% off your entire order',
  },
  AVIGNON20: {
    code: 'AVIGNON20',
    discountPercent: 20,
    minOrder: 200,
    description: '20% off orders over $200',
  },
  FREESHIP: {
    code: 'FREESHIP',
    freeShipping: true,
    description: 'Complimentary Express Courier delivery',
  },
  ATELIER50: {
    code: 'ATELIER50',
    discountAmount: 50,
    minOrder: 250,
    description: '$50 off luxury orders over $250',
  },
};

export type DeliverySpeed = 'standard' | 'express' | 'white_glove';

export const DELIVERY_OPTIONS: Record<
  DeliverySpeed,
  { name: string; estimate: string; baseFee: number; thresholdForFree: number }
> = {
  standard: {
    name: 'Complimentary Standard Courier',
    estimate: '3–5 business days',
    baseFee: 12,
    thresholdForFree: 150,
  },
  express: {
    name: 'Next-Day Atelier Priority',
    estimate: 'Next business day by 12 PM',
    baseFee: 24,
    thresholdForFree: 350,
  },
  white_glove: {
    name: 'Hand-Delivered White-Glove Courier',
    estimate: 'Same-day scheduled evening delivery',
    baseFee: 45,
    thresholdForFree: 600,
  },
};

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function validatePromoCode(
  code: string,
  subtotal: number
): { valid: boolean; error?: string; promo?: PromoCode } {
  const normalized = code.trim().toUpperCase();
  const promo = AVAILABLE_PROMOS[normalized];
  if (!promo) {
    return { valid: false, error: 'Invalid or expired promotional code' };
  }
  if (promo.minOrder && subtotal < promo.minOrder) {
    return {
      valid: false,
      error: `Requires a minimum order of $${promo.minOrder}`,
      promo,
    };
  }
  return { valid: true, promo };
}

export function calculateDiscount(subtotal: number, promo?: PromoCode | null): number {
  if (!promo) return 0;
  if (promo.discountPercent) {
    return Math.round(((subtotal * promo.discountPercent) / 100) * 100) / 100;
  }
  if (promo.discountAmount) {
    return Math.min(subtotal, promo.discountAmount);
  }
  return 0;
}

export function calculateShipping(
  subtotal: number,
  speed: DeliverySpeed,
  promo?: PromoCode | null
): number {
  if (promo?.freeShipping) return 0;
  const option = DELIVERY_OPTIONS[speed] || DELIVERY_OPTIONS.standard;
  if (subtotal >= option.thresholdForFree) return 0;
  return option.baseFee;
}

export function calculateTax(taxableAmount: number, taxRate = 0.0825): number {
  return Math.round(taxableAmount * taxRate * 100) / 100;
}

export function calculateTotalBreakdown(
  items: CartItem[],
  speed: DeliverySpeed = 'standard',
  promo?: PromoCode | null,
  taxRate = 0.0825
) {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, promo);
  const shipping = calculateShipping(subtotal, speed, promo);
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = items.length > 0 ? calculateTax(taxableAmount, taxRate) : 0;
  const total = items.length > 0 ? Math.round((taxableAmount + shipping + tax) * 100) / 100 : 0;

  return {
    itemCount: items.reduce((count, i) => count + i.quantity, 0),
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
}

export function formatPrice(amount: number, currency = 'USD'): string {
  if (currency === 'EUR') return `€${amount.toFixed(0)}`;
  if (currency === 'GBP') return `£${amount.toFixed(0)}`;
  if (currency === 'JPY') return `¥${Math.round(amount * 155).toLocaleString()}`;
  return `$${amount.toFixed(0)}`;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AV-${year}-${rand}`;
}
