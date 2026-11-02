import { Product } from '../data/products';
import { CartItem, PromoCode, DeliverySpeed } from '../utils/cart';

export type OnboardingStep =
  | 'splash'
  | 'video_intro'
  | 'welcome'
  | 'story'
  | 'walkthrough'
  | 'login'
  | 'register'
  | 'verify'
  | 'forgot_password'
  | 'preferences';

export type AppTab = 'home' | 'shop' | 'wishlist' | 'bag' | 'profile';

export interface UserPreferences {
  fit: 'Relaxed' | 'Tailored' | 'Oversized';
  preferredCategories: string[];
  notificationsEnabled: boolean;
  editorialNewsletter: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  tier: 'Atelier Member' | 'VIP Circle';
  memberSince: string;
  avatar?: string;
  savedAddresses: SavedAddress[];
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Atelier Processing' | 'Tailoring' | 'Dispatched via DHL' | 'Delivered';
  trackingNumber: string;
  deliverySpeed: DeliverySpeed;
  shippingAddress: SavedAddress;
  paymentMethod: string;
  estimatedDelivery: string;
}
