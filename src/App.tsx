/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { IPhoneFrame } from './components/iphone/IPhoneFrame';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { TabBar } from './components/navigation/TabBar';
import { HomeScreen } from './components/home/HomeScreen';
import { CategoryScreen } from './components/categories/CategoryScreen';
import { WishlistScreen } from './components/wishlist/WishlistScreen';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { ProductDetailModal } from './components/pdp/ProductDetailModal';
import { AccountScreen } from './components/account/AccountScreen';
import { SearchModal } from './components/search/SearchModal';
import { Product, PRODUCTS } from './data/products';
import { AppTab, UserPreferences, UserProfile, OrderRecord } from './types/app';
import { CartItem, PromoCode } from './utils/cart';
import { sound } from './utils/audio';

const INITIAL_PROFILE: UserProfile = {
  name: 'Eric Tanner',
  email: 'erictanner.webdesignmechanic@gmail.com',
  phone: '+1 (555) 392-1084',
  tier: 'Atelier Member',
  memberSince: '2026',
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Primary Residence',
      fullName: 'Eric Tanner',
      street: '742 Evergreen Terrace',
      apt: 'Suite 4B',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
      phone: '+1 (555) 392-1084',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Atelier Studio',
      fullName: 'Eric Tanner',
      street: '14 Rue de Turenne',
      city: 'Paris',
      state: 'IDF',
      postalCode: '75004',
      country: 'France',
      phone: '+33 1 42 68 00 00',
      isDefault: false,
    },
  ],
};

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'AV-2026-8941',
    date: 'Oct 28, 2026',
    items: [
      {
        id: 'init-item-1',
        productId: 'collar-jacket',
        title: 'Collar Jacket',
        price: 168,
        size: 'M',
        color: 'Washed Charcoal',
        image: 'https://avignonusa.com/wp-content/uploads/2026/09/collar-jacket.webp',
        quantity: 1,
      },
    ],
    subtotal: 168,
    discount: 0,
    shipping: 0,
    tax: 13.86,
    total: 181.86,
    status: 'Dispatched via DHL',
    trackingNumber: 'DHL-AV-99214820',
    deliverySpeed: 'standard',
    shippingAddress: INITIAL_PROFILE.savedAddresses[0],
    paymentMethod: 'Apple Pay (Face ID authorized)',
    estimatedDelivery: 'Tomorrow by 2:00 PM',
  },
];

export default function App() {
  // Check if ?autostart=1 is provided in URL
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return true;
      return localStorage.getItem('avignon_onboarding_completed') === 'true';
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('hub');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: 'collar-jacket',
      title: 'Collar Jacket',
      price: 168,
      size: 'M',
      color: 'Washed Charcoal',
      image: 'https://avignonusa.com/wp-content/uploads/2026/09/collar-jacket.webp',
      quantity: 1,
    },
  ]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'collar-jacket',
    'textured-knit-polo',
    'pleated-trouser',
  ]);

  // Profile & preferences
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    fit: 'Relaxed',
    preferredCategories: ['Knitwear', 'Outerwear', 'Tailoring'],
    notificationsEnabled: true,
    editorialNewsletter: true,
  });
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  // App settings
  const [currency, setCurrency] = useState('USD');
  const [darkMode, setDarkMode] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dynamicIslandMessage, setDynamicIslandMessage] = useState<string | null>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    setHasCompletedOnboarding(true);
    localStorage.setItem('avignon_onboarding_completed', 'true');
    setDynamicIslandMessage('Welcome');
    setTimeout(() => setDynamicIslandMessage(null), 3000);
  };

  const handleSkipToStore = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('avignon_onboarding_completed', 'true');
  };

  const handleAddToCart = (product: Product, size: string, color: string, qty: number) => {
    const existingIndex = cartItems.findIndex(
      (it) => it.productId === product.id && it.size === size && it.color === color
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += qty;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        title: product.title,
        price: product.price,
        size,
        color,
        image: product.images[0],
        quantity: qty,
      };
      setCartItems([...cartItems, newItem]);
    }

    setDynamicIslandMessage(`+${qty} In Bag`);
    setTimeout(() => setDynamicIslandMessage(null), 2500);
  };

  const handleQuickAdd = (product: Product) => {
    const defaultSize = product.sizes[1] || product.sizes[0] || 'M';
    const defaultColor = product.colors[0]?.name || 'Standard';
    handleAddToCart(product, defaultSize, defaultColor, 1);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems(cartItems.filter((i) => i.id !== itemId));
    } else {
      setCartItems(
        cartItems.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(cartItems.filter((i) => i.id !== itemId));
  };

  const handleToggleWishlist = (productId: string) => {
    sound.tap();
    if (wishlistIds.includes(productId)) {
      setWishlistIds(wishlistIds.filter((id) => id !== productId));
    } else {
      setWishlistIds([...wishlistIds, productId]);
      setDynamicIslandMessage('Saved');
      setTimeout(() => setDynamicIslandMessage(null), 2000);
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setActiveTab('shop');
  };

  const handleOrderCompleted = (newOrder: OrderRecord) => {
    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setAppliedPromo(null);
    setDynamicIslandMessage('Order Placed');
    setTimeout(() => setDynamicIslandMessage(null), 4000);
  };

  return (
    <IPhoneFrame
      dynamicIslandContent={dynamicIslandMessage}
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      cartCount={totalCartCount}
    >
      {!hasCompletedOnboarding ? (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkipToStore={handleSkipToStore}
        />
      ) : (
        <div className="relative flex-1 w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Main Tab Screen Content */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col">
            {activeTab === 'home' && (
              <HomeScreen
                onSelectProduct={(p) => setSelectedProduct(p)}
                onSelectCategory={handleSelectCategory}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
                userPreferences={userPreferences}
                onOpenSearch={() => setIsSearchOpen(true)}
                currency={currency}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'shop' && (
              <CategoryScreen
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={(id) => setSelectedCategoryId(id)}
                onSelectProduct={(p) => setSelectedProduct(p)}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
                currency={currency}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'wishlist' && (
              <WishlistScreen
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onQuickAdd={handleQuickAdd}
                onExplore={() => {
                  setSelectedCategoryId('hub');
                  setActiveTab('shop');
                }}
                currency={currency}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'bag' && (
              <CartDrawer
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveCartItem}
                onProceedToCheckout={() => setIsCheckoutOpen(true)}
                onClose={() => setActiveTab('home')}
                appliedPromo={appliedPromo}
                onApplyPromo={setAppliedPromo}
                currency={currency}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'profile' && (
              <AccountScreen
                userProfile={userProfile}
                onUpdateProfile={(updated) => setUserProfile({ ...userProfile, ...updated })}
                orders={orders}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={(p) => setSelectedProduct(p)}
                currency={currency}
                onSelectCurrency={setCurrency}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onReplayOnboarding={() => {
                  setHasCompletedOnboarding(false);
                }}
              />
            )}
          </div>

          {/* Sticky iOS Tab Bar */}
          <TabBar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            cartCount={totalCartCount}
            wishlistCount={wishlistIds.length}
            darkMode={darkMode}
          />

          {/* Product Detail Modal */}
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
              isWishlisted={wishlistIds.includes(selectedProduct.id)}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={(p) => setSelectedProduct(p)}
              currency={currency}
              darkMode={darkMode}
            />
          )}

          {/* Checkout Modal */}
          {isCheckoutOpen && (
            <CheckoutModal
              items={cartItems}
              appliedPromo={appliedPromo}
              onClose={() => setIsCheckoutOpen(false)}
              onOrderCompleted={handleOrderCompleted}
              currency={currency}
              darkMode={darkMode}
            />
          )}

          {/* Search Modal */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            currency={currency}
            darkMode={darkMode}
          />
        </div>
      )}
    </IPhoneFrame>
  );
}
