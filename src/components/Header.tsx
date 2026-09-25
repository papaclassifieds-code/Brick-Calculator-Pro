import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Layers,
  Calculator,
  ArrowRightLeft,
  FolderArchive,
  Smartphone,
  Ruler,
} from 'lucide-react';
import { MeasurementSystem } from '../types/calculator';

interface Props {
  activeTab: 'calculator' | 'converter' | 'history';
  onTabChange: (tab: 'calculator' | 'converter' | 'history') => void;
  system: MeasurementSystem;
  onSystemToggle: () => void;
  savedCount: number;
  onOpenPlayStoreGuide: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onTabChange,
  system,
  onSystemToggle,
  savedCount,
  onOpenPlayStoreGuide,
}) => {
  const isFeet = system === 'imperial';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-3 sm:px-5">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Indian Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center text-slate-950 font-black">
              <Layers className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  BrickCalc <span className="text-amber-400">India</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  🇮🇳 देसी
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5">
                ईंट, सीमेंट व बालू कैलकुलेटर
              </p>
            </div>
          </div>

          {/* Quick Unit Switch (Feet vs Meter) & App Install */}
          <div className="flex items-center gap-2">
            {/* Quick 1-tap Unit Toggle: Feet vs Meter */}
            <button
              type="button"
              onClick={onSystemToggle}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 transition active:scale-95"
              title="फुट और मीटर में बदलें"
            >
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>{isFeet ? 'नाप: फीट (Ft)' : 'नाप: मीटर (M)'}</span>
            </button>

            {/* Play Store packaging info */}
            <button
              type="button"
              onClick={onOpenPlayStoreGuide}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
              title="प्ले स्टोर पर पब्लिश करें"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Play Store</span>
            </button>

            {/* PWA Install */}
            <PWAInstallButton />
          </div>
        </div>

        {/* Simple Tab Navigation */}
        <div className="flex items-center space-x-1 border-t border-slate-800/60 py-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => onTabChange('calculator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>दीवार कैलकुलेटर (Calculator)</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('converter')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'converter'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>गज-फीट-ब्रास कन्वर्टर (Converter)</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>कमरा-दर-कमरा हिसाब (Saved)</span>
            {savedCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'history'
                    ? 'bg-slate-950 text-amber-300 font-bold'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
