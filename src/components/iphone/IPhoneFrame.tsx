import React, { useState } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Sun, Moon, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface IPhoneFrameProps {
  children: React.ReactNode;
  dynamicIslandContent?: string | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  cartCount: number;
}

export type TitaniumFinish = 'natural' | 'black' | 'desert';

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  children,
  dynamicIslandContent,
  darkMode,
  onToggleDarkMode,
  cartCount,
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [finish, setFinish] = useState<TitaniumFinish>('black');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) sound.tap();
  };

  const finishStyles = {
    black: {
      chassis: 'border-[#222428] bg-[#0c0d10] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)]',
      rim: 'border-[#33363d]',
      accent: 'text-neutral-300',
    },
    natural: {
      chassis: 'border-[#79766F] bg-[#1a1917] shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.15)]',
      rim: 'border-[#918D85]',
      accent: 'text-neutral-200',
    },
    desert: {
      chassis: 'border-[#8c7462] bg-[#1a1410] shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.15)]',
      rim: 'border-[#ad937f]',
      accent: 'text-amber-200',
    },
  }[finish];

  // If user is on an actual small screen or toggled full screen mode
  if (!deviceFrameMode) {
    return (
      <div className={`min-h-screen w-full ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-[#FAFAF9] text-neutral-900'}`}>
        {/* Floating utility toggle for developers/users */}
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2 rounded-full bg-neutral-900/80 px-3 py-1.5 text-xs text-white backdrop-blur-md shadow-lg border border-white/10">
          <button
            onClick={() => setDeviceFrameMode(true)}
            className="flex items-center gap-1.5 hover:text-white text-neutral-300 transition-colors"
            title="Switch to iPhone 18 Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Frame Mode</span>
          </button>
          <div className="h-3 w-[1px] bg-white/20" />
          <button
            onClick={onToggleDarkMode}
            className="hover:text-white text-neutral-300 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#07080a] py-6 sm:py-10 px-2 flex flex-col items-center justify-center font-sans antialiased text-neutral-100">
      {/* Top Device Controls Bar */}
      <div className="w-full max-w-[430px] mb-4 flex items-center justify-between px-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-200 tracking-tight flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
            iPhone 18 Pro
          </span>
          <span className="text-neutral-600">·</span>
          <div className="flex items-center gap-1">
            {(['black', 'natural', 'desert'] as TitaniumFinish[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFinish(f);
                  sound.tap();
                }}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  f === 'black' ? 'bg-[#2a2c31]' : f === 'natural' ? 'bg-[#8e8a83]' : 'bg-[#c5a68d]'
                } ${finish === f ? 'scale-125 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'}`}
                title={`${f} titanium finish`}
                aria-label={`${f} titanium`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-1 rounded hover:bg-white/10 text-neutral-300 transition-colors"
            title={soundEnabled ? 'Haptics enabled' : 'Haptics muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
          </button>
          <button
            onClick={onToggleDarkMode}
            className="p-1 rounded hover:bg-white/10 text-neutral-300 transition-colors"
            title="Toggle iOS Theme"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setDeviceFrameMode(false)}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors text-[11px]"
            title="Switch to full viewport mobile view"
          >
            Full View
          </button>
        </div>
      </div>

      {/* Photorealistic iPhone 18 Pro Device Chassis */}
      <div
        className={`relative w-[400px] sm:w-[412px] h-[864px] rounded-[55px] p-[10px] transition-all duration-300 border-[3.5px] ${finishStyles.rim} ${finishStyles.chassis} select-none`}
        style={{
          boxShadow: '0 0 0 2px rgba(255,255,255,0.06), 0 30px 90px rgba(0,0,0,0.85)',
        }}
      >
        {/* Hardware Action Button & Volume (Left) */}
        <div className="absolute -left-[5.5px] top-[130px] w-[3px] h-[28px] bg-neutral-600 rounded-l-sm" />
        <div className="absolute -left-[5.5px] top-[180px] w-[3px] h-[52px] bg-neutral-600 rounded-l-sm" />
        <div className="absolute -left-[5.5px] top-[245px] w-[3px] h-[52px] bg-neutral-600 rounded-l-sm" />

        {/* Hardware Power Button (Right) */}
        <div className="absolute -right-[5.5px] top-[200px] w-[3px] h-[78px] bg-neutral-600 rounded-r-sm" />

        {/* iPhone Screen Glass Enclosure */}
        <div
          className={`relative w-full h-full rounded-[46px] overflow-hidden flex flex-col ${
            darkMode ? 'dark bg-[#0E0F12] text-neutral-100' : 'bg-[#FAF9F6] text-neutral-900'
          }`}
        >
          {/* iOS 18 Status Bar with Dynamic Island */}
          <div
            className={`relative z-40 w-full h-[50px] shrink-0 pt-3 px-7 flex items-center justify-between text-[13px] font-semibold tracking-tight transition-colors ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {/* Clock 9:41 */}
            <span className="w-12 text-left font-medium">9:41</span>

            {/* Dynamic Island Pill */}
            <div
              onClick={() => setIsDynamicIslandExpanded(!isDynamicIslandExpanded)}
              className={`absolute left-1/2 -translate-x-1/2 top-2.5 cursor-pointer bg-black text-white rounded-full flex items-center justify-between transition-all duration-300 ease-out shadow-md border border-white/10 ${
                isDynamicIslandExpanded
                  ? 'w-[230px] h-[36px] px-3.5'
                  : 'w-[122px] h-[30px] px-2.5'
              }`}
            >
              {isDynamicIslandExpanded ? (
                <>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-tight">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Avignon Atelier</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {cartCount > 0 ? `${cartCount} in Bag` : 'FW 2026'}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700/80" />
                  <span className="text-[10px] tracking-widest uppercase font-serif text-neutral-400">
                    {dynamicIslandContent || 'Avignon'}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1c1d22]" />
                </>
              )}
            </div>

            {/* Right Status Icons: 5G, Cellular, Battery */}
            <div className="flex items-center gap-1.5 w-16 justify-end">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <div className="relative w-[21px] h-[11px] rounded-[3.5px] border border-current p-[1px] flex items-center">
                  <div className="w-full h-full bg-current rounded-[1.5px]" />
                </div>
                <div className="w-[1px] h-[4px] bg-current rounded-r-xs" />
              </div>
            </div>
          </div>

          {/* iPhone Application Content Container */}
          <div className="relative flex-1 w-full overflow-hidden flex flex-col">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="relative z-40 w-full h-[22px] shrink-0 flex items-center justify-center pb-1 pointer-events-none">
            <div
              className={`w-[134px] h-[4.5px] rounded-full transition-colors ${
                darkMode ? 'bg-white/40' : 'bg-neutral-900/40'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
