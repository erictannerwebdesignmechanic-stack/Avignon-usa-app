import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  validatePromoCode,
  calculateDiscount,
  calculateShipping,
  calculateTotalBreakdown,
  formatPrice,
  generateOrderNumber,
  CartItem,
} from './cart';

const mockItems: CartItem[] = [
  {
    id: 'item-1',
    productId: 'collar-jacket',
    title: 'Collar Jacket',
    price: 168,
    size: 'M',
    color: 'Washed Black',
    image: '/test.jpg',
    quantity: 1,
  },
  {
    id: 'item-2',
    productId: 'textured-knit-polo',
    title: 'Textured Knit Polo',
    price: 68,
    size: 'L',
    color: 'Chalk Cream',
    image: '/test2.jpg',
    quantity: 2,
  },
];

test('calculateSubtotal sums item price * quantity', () => {
  // 168*1 + 68*2 = 168 + 136 = 304
  const subtotal = calculateSubtotal(mockItems);
  assert.equal(subtotal, 304);
});

test('calculateSubtotal returns 0 for empty array', () => {
  assert.equal(calculateSubtotal([]), 0);
});

test('validatePromoCode accepts valid code and rejects invalid code', () => {
  const valid = validatePromoCode('AVIGNON10', 300);
  assert.equal(valid.valid, true);
  assert.equal(valid.promo?.discountPercent, 10);

  const invalid = validatePromoCode('NONEXISTENT', 300);
  assert.equal(invalid.valid, false);

  const underMin = validatePromoCode('AVIGNON20', 100);
  assert.equal(underMin.valid, false);
  assert.match(underMin.error || '', /minimum order/i);
});

test('calculateDiscount applies percentage and fixed amounts correctly', () => {
  const percentDiscount = calculateDiscount(304, {
    code: 'AVIGNON10',
    discountPercent: 10,
    description: '',
  });
  assert.equal(percentDiscount, 30.4);

  const fixedDiscount = calculateDiscount(304, {
    code: 'ATELIER50',
    discountAmount: 50,
    description: '',
  });
  assert.equal(fixedDiscount, 50);

  const noPromo = calculateDiscount(304, null);
  assert.equal(noPromo, 0);
});

test('calculateShipping waives fees above threshold or on promo', () => {
  // Subtotal 304 >= 150 for standard courier -> $0
  const freeStandard = calculateShipping(304, 'standard', null);
  assert.equal(freeStandard, 0);

  // Subtotal 100 < 150 -> $12
  const paidStandard = calculateShipping(100, 'standard', null);
  assert.equal(paidStandard, 12);

  // Free shipping promo applies regardless of subtotal
  const promoFree = calculateShipping(50, 'standard', {
    code: 'FREESHIP',
    freeShipping: true,
    description: '',
  });
  assert.equal(promoFree, 0);
});

test('calculateTotalBreakdown calculates complete order totals correctly', () => {
  const breakdown = calculateTotalBreakdown(mockItems, 'standard', {
    code: 'AVIGNON10',
    discountPercent: 10,
    description: '',
  });

  assert.equal(breakdown.itemCount, 3);
  assert.equal(breakdown.subtotal, 304);
  assert.equal(breakdown.discount, 30.4);
  assert.equal(breakdown.shipping, 0); // >= 150
  // Taxable: 304 - 30.4 = 273.6. Tax: 273.6 * 0.0825 = 22.57
  assert.equal(breakdown.tax, 22.57);
  // Total: 273.6 + 0 + 22.57 = 296.17
  assert.equal(breakdown.total, 296.17);
});

test('formatPrice formats currencies', () => {
  assert.equal(formatPrice(168, 'USD'), '$168');
  assert.equal(formatPrice(168, 'EUR'), '€168');
  assert.equal(formatPrice(168, 'GBP'), '£168');
});

test('generateOrderNumber generates AV-prefix order ID', () => {
  const orderId = generateOrderNumber();
  assert.match(orderId, /^AV-\d{4}-\d{4}$/);
});
