import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Package,
  MapPin,
  Bell,
  Heart,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Edit2,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import { UserProfile, SavedAddress, OrderRecord } from '../../types/app';
import { Product, PRODUCTS } from '../../data/products';
import { formatPrice } from '../../utils/cart';
import { sound } from '../../utils/audio';

interface AccountScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  orders: OrderRecord[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  currency: string;
  onSelectCurrency: (curr: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onReplayOnboarding: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  userProfile,
  onUpdateProfile,
  orders,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  currency,
  onSelectCurrency,
  darkMode,
  onToggleDarkMode,
  onReplayOnboarding,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'addresses' | 'notifications' | 'support'>('overview');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);

  // Address modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Paris Studio');
  const [newAddrStreet, setNewAddrStreet] = useState('14 Rue de Turenne');
  const [newAddrCity, setNewAddrCity] = useState('Paris');
  const [newAddrState, setNewAddrState] = useState('IDF');
  const [newAddrZip, setNewAddrZip] = useState('75004');

  // Support Return Modal
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleSaveProfile = () => {
    sound.tap();
    onUpdateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
    });
    setIsEditProfileOpen(false);
  };

  const handleAddAddress = () => {
    sound.tap();
    const newAddress: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel,
      fullName: userProfile.name,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      postalCode: newAddrZip,
      country: 'France',
      phone: userProfile.phone,
      isDefault: false,
    };
    onUpdateProfile({
      savedAddresses: [...userProfile.savedAddresses, newAddress],
    });
    setIsAddAddressOpen(false);
  };

  return (
    <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-10 bg-[#0E0F12] text-neutral-100 select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-30 px-5 py-3.5 border-b border-neutral-800/80 bg-[#0E0F12]/90 backdrop-blur-md flex items-center justify-between">
        <h1 className="font-editorial text-lg tracking-wider font-semibold text-white">
          ATELIER ACCOUNT
        </h1>
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
          {userProfile.tier}
        </span>
      </header>

      {/* Profile Card Header */}
      <div className="p-5 border-b border-neutral-800/80 bg-neutral-900/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-lg font-editorial">
            {userProfile.name.split(' ').map((n) => n[0]).join('')}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                {userProfile.name}
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="text-neutral-400 hover:text-white p-1"
                title="Edit profile"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 font-mono">{userProfile.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                {userProfile.tier}
              </span>
              <span className="text-[10px] text-neutral-500">
                Member since {userProfile.memberSince}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Menu Rows */}
      <div className="p-5 space-y-3">
        {/* Orders Row */}
        <div
          onClick={() => {
            sound.tap();
            setActiveSection('orders');
          }}
          className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between cursor-pointer hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-white">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">My Atelier Orders</h4>
              <p className="text-[11px] text-neutral-400">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </div>

        {/* Saved Addresses Row */}
        <div
          onClick={() => {
            sound.tap();
            setActiveSection('addresses');
          }}
          className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between cursor-pointer hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Saved Addresses</h4>
              <p className="text-[11px] text-neutral-400">
                {userProfile.savedAddresses.length} courier locations
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </div>

        {/* Notifications Row */}
        <div
          onClick={() => {
            sound.tap();
            setActiveSection('notifications');
          }}
          className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between cursor-pointer hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Notifications & Alerts</h4>
              <p className="text-[11px] text-neutral-400">Drop notifications & SMS telemetry</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </div>

        {/* Returns & Concierge Support */}
        <div
          onClick={() => {
            sound.tap();
            setIsReturnModalOpen(true);
          }}
          className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between cursor-pointer hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-white">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Returns & Concierge Support</h4>
              <p className="text-[11px] text-neutral-400">30-day complimentary return portal</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </div>
      </div>

      {/* CURRENCY & APP PREFERENCES */}
      <div className="px-5 py-3 border-t border-neutral-800 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Store Currency
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['USD', 'EUR', 'GBP', 'JPY'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  sound.tap();
                  onSelectCurrency(c);
                }}
                className={`h-9 rounded-xl text-xs font-mono font-medium transition-all ${
                  currency === c
                    ? 'bg-white text-neutral-900 font-bold shadow'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              sound.tap();
              onReplayOnboarding();
            }}
            className="w-full h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <span>Replay Cinematic Onboarding & Video</span>
          </button>
        </div>
      </div>

      {/* ACTIVE ORDERS SHEET */}
      <AnimatePresence>
        {activeSection === 'orders' && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0E0F12] text-white">
            <header className="px-4 py-3.5 border-b border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setActiveSection('overview')}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Account</span>
              </button>
              <h3 className="font-editorial text-sm">Order History</h3>
              <div className="w-12" />
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              {orders.length === 0 ? (
                <div className="py-20 text-center text-neutral-400 text-xs">
                  <Package className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                  <p>You have not placed any orders yet.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400">Order Ref</span>
                        <h4 className="text-xs font-mono font-bold text-white">{ord.id}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                          {ord.status}
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{ord.date}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((it) => (
                        <div key={it.id} className="flex items-center gap-3 text-xs">
                          <img src={it.image} alt="" className="w-10 h-12 object-cover rounded-lg" />
                          <div className="flex-1">
                            <p className="text-white font-medium line-clamp-1">{it.title}</p>
                            <p className="text-[10px] text-neutral-400">Size {it.size} · Qty {it.quantity}</p>
                          </div>
                          <span className="font-mono text-neutral-200">
                            {formatPrice(it.price * it.quantity, currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Total Authorized</span>
                      <span className="font-mono font-bold text-white">{formatPrice(ord.total, currency)}</span>
                    </div>

                    <div className="text-[10px] text-neutral-400 bg-neutral-950 p-2 rounded-xl flex items-center justify-between font-mono">
                      <span>Tracking: {ord.trackingNumber}</span>
                      <span className="text-emerald-400">Live Telemetry</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* SAVED ADDRESSES SHEET */}
      <AnimatePresence>
        {activeSection === 'addresses' && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0E0F12] text-white">
            <header className="px-4 py-3.5 border-b border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setActiveSection('overview')}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Account</span>
              </button>
              <h3 className="font-editorial text-sm">Saved Addresses</h3>
              <button
                onClick={() => setIsAddAddressOpen(true)}
                className="text-xs text-white uppercase tracking-wider font-semibold"
              >
                + Add
              </button>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3">
              {userProfile.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{addr.label}</h4>
                    {addr.isDefault && (
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-300">{addr.fullName}</p>
                  <p className="text-xs text-neutral-400">{addr.street} {addr.apt}</p>
                  <p className="text-xs text-neutral-400">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-xs text-neutral-500 font-mono">{addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* NOTIFICATIONS SETTINGS SHEET */}
      <AnimatePresence>
        {activeSection === 'notifications' && (
          <div className="absolute inset-0 z-50 flex flex-col bg-[#0E0F12] text-white">
            <header className="px-4 py-3.5 border-b border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => setActiveSection('overview')}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Account</span>
              </button>
              <h3 className="font-editorial text-sm">Notifications</h3>
              <div className="w-12" />
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <label className="flex items-center justify-between text-xs cursor-pointer py-1">
                  <div>
                    <p className="text-white font-medium">Seasonal Drop Alerts</p>
                    <p className="text-[11px] text-neutral-400">Instant notification when FW 2026 batches drop</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-white rounded" />
                </label>

                <div className="h-px bg-neutral-800" />

                <label className="flex items-center justify-between text-xs cursor-pointer py-1">
                  <div>
                    <p className="text-white font-medium">Courier Route Tracking</p>
                    <p className="text-[11px] text-neutral-400">Real-time SMS updates from DHL Express</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-white rounded" />
                </label>

                <div className="h-px bg-neutral-800" />

                <label className="flex items-center justify-between text-xs cursor-pointer py-1">
                  <div>
                    <p className="text-white font-medium">Avignon Gazette Journal</p>
                    <p className="text-[11px] text-neutral-400">Bi-weekly editorial articles on craftsmanship</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-white rounded" />
                </label>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-[430px] rounded-t-3xl bg-[#141519] border-t border-neutral-800 p-5 text-white"
            >
              <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-lg">Edit Atelier Profile</h3>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full h-12 mt-5 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase"
              >
                Save Changes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD ADDRESS MODAL */}
      <AnimatePresence>
        {isAddAddressOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-[430px] rounded-t-3xl bg-[#141519] border-t border-neutral-800 p-5 text-white"
            >
              <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-lg">Add New Address</h3>
                <button
                  onClick={() => setIsAddAddressOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Label (e.g. Studio, Office)</label>
                  <input
                    type="text"
                    value={newAddrLabel}
                    onChange={(e) => setNewAddrLabel(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">City</label>
                    <input
                      type="text"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={newAddrZip}
                      onChange={(e) => setNewAddrZip(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddAddress}
                className="w-full h-12 mt-5 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase"
              >
                Save Address
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RETURNS & CONCIERGE SUPPORT MODAL */}
      <AnimatePresence>
        {isReturnModalOpen && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-[430px] rounded-t-3xl bg-[#141519] border-t border-neutral-800 p-5 text-white max-h-[85vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-editorial text-lg">Atelier Returns & Concierge</h3>
                <button
                  onClick={() => {
                    setIsReturnModalOpen(false);
                    setReturnSubmitted(false);
                  }}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {returnSubmitted ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-editorial text-base text-white">Prepaid DHL Label Dispatched</h4>
                  <p className="text-xs text-neutral-400">
                    A complimentary prepaid return label has been emailed to {userProfile.email}. Simply affix to your original packaging.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
                    <h4 className="text-xs font-semibold text-white">Our 30-Day Guarantee</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Every piece may be exchanged or returned within 30 days of delivery, provided it is unworn with original tags intact.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Reason for Return or Exchange
                    </label>
                    <select className="w-full h-11 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white">
                      <option>Size Exchange (Requesting different size)</option>
                      <option>Color Preference</option>
                      <option>Fit Silhouette Adjustment</option>
                      <option>Other / Concierge Consultation</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      sound.success();
                      setReturnSubmitted(true);
                    }}
                    className="w-full h-12 rounded-xl bg-white text-neutral-900 font-semibold text-xs tracking-wider uppercase"
                  >
                    Generate Prepaid Return Label
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
