import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { AppTab } from '../../types/app';
import { sound } from '../../utils/audio';

interface TabBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  cartCount: number;
  wishlistCount: number;
  darkMode: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  wishlistCount,
  darkMode,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Edits', icon: Compass },
    { id: 'wishlist', label: 'Saved', icon: Heart, badge: wishlistCount },
    { id: 'bag', label: 'Bag', icon: ShoppingBag, badge: cartCount },
    { id: 'profile', label: 'Atelier', icon: User },
  ];

  const handleTabClick = (tabId: AppTab) => {
    sound.tap();
    onSelectTab(tabId);
  };

  return (
    <nav
      aria-label="App Navigation"
      className={`relative z-40 w-full h-[62px] shrink-0 border-t flex items-center justify-around px-2 transition-colors select-none ${
        darkMode
          ? 'bg-[#101115]/95 backdrop-blur-xl border-neutral-800/80 text-neutral-400'
          : 'bg-[#FAF9F6]/95 backdrop-blur-xl border-neutral-200/90 text-neutral-500'
      }`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
              isActive
                ? darkMode
                  ? 'text-white font-medium'
                  : 'text-neutral-900 font-medium'
                : 'hover:text-neutral-300'
            }`}
            aria-label={tab.label}
          >
            <div className="relative">
              <Icon
                className={`w-[20px] h-[20px] transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />

              {/* Badge counter */}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] tracking-tight mt-1">
              {tab.label}
            </span>

            {/* Active Pill Indicator */}
            {isActive && (
              <span
                className={`absolute bottom-1 w-1 h-1 rounded-full ${
                  darkMode ? 'bg-white' : 'bg-neutral-900'
                }`}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
