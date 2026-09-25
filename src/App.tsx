import React, { useState, useEffect, useMemo } from 'react';
import {
  IndianWallInput,
  IndianCalculationResult,
  SavedWallEstimate,
} from './types/calculator';
import {
  DEFAULT_INDIAN_INPUT,
  calculateIndianMasonry,
} from './utils/calculator';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { WallBlueprint } from './components/WallBlueprint';
import { ResultsDisplay } from './components/ResultsDisplay';
import { UnitConverter } from './components/UnitConverter';
import { ProjectHistory } from './components/ProjectHistory';
import { PlayStoreGuideModal } from './components/PlayStoreGuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { RotateCcw, HardHat } from 'lucide-react';

const STORAGE_KEY_INPUT = 'brickcalc_india_input_v2';
const STORAGE_KEY_HISTORY = 'brickcalc_india_walls_v2';

// Realistic sample Indian house walls
const INITIAL_INDIAN_SAVED_WALLS: SavedWallEstimate[] = [
  {
    id: 'wall-sample-1',
    name: 'कमरा 1 - मास्टर बेडरूम (बाहरी 9" दीवार)',
    siteName: 'प्लॉट नं. 14, ड्रीम सिटी',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    input: {
      ...DEFAULT_INDIAN_INPUT,
      wallLength: 14.0,
      wallHeight: 10.0,
      wallType: '9_inch',
      openings: [
        {
          id: 'op-1',
          name: 'Main Door',
          hindiName: 'दरवाजा',
          type: 'door',
          width: 3.0,
          height: 7.0,
          count: 1,
        },
        {
          id: 'op-2',
          name: 'Window',
          hindiName: 'खिड़की',
          type: 'window',
          width: 4.0,
          height: 4.0,
          count: 1,
        },
      ],
    },
    result: calculateIndianMasonry({
      ...DEFAULT_INDIAN_INPUT,
      wallLength: 14.0,
      wallHeight: 10.0,
      wallType: '9_inch',
      openings: [
        {
          id: 'op-1',
          name: 'Main Door',
          hindiName: 'दरवाजा',
          type: 'door',
          width: 3.0,
          height: 7.0,
          count: 1,
        },
        {
          id: 'op-2',
          name: 'Window',
          hindiName: 'खिड़की',
          type: 'window',
          width: 4.0,
          height: 4.0,
          count: 1,
        },
      ],
    }),
  },
  {
    id: 'wall-sample-2',
    name: 'हॉल व किचन पार्टीशन (4.5" परदा दीवार)',
    siteName: 'प्लॉट नं. 14, ड्रीम सिटी',
    date: new Date(Date.now() - 86400000).toISOString(),
    input: {
      ...DEFAULT_INDIAN_INPUT,
      wallLength: 12.0,
      wallHeight: 10.0,
      wallType: '4_5_inch',
      mortarRatio: '1:4',
      openings: [
        {
          id: 'op-kitchen-door',
          name: 'Arch Door',
          hindiName: 'किचन ओपनिंग',
          type: 'door',
          width: 3.5,
          height: 7.0,
          count: 1,
        },
      ],
    },
    result: calculateIndianMasonry({
      ...DEFAULT_INDIAN_INPUT,
      wallLength: 12.0,
      wallHeight: 10.0,
      wallType: '4_5_inch',
      mortarRatio: '1:4',
      openings: [
        {
          id: 'op-kitchen-door',
          name: 'Arch Door',
          hindiName: 'किचन ओपनिंग',
          type: 'door',
          width: 3.5,
          height: 7.0,
          count: 1,
        },
      ],
    }),
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'converter' | 'history'>('calculator');
  const [showPlayStoreModal, setShowPlayStoreModal] = useState(false);

  // Load stored inputs or default
  const [input, setInput] = useState<IndianWallInput>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INPUT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load Indian input', e);
    }
    return DEFAULT_INDIAN_INPUT;
  });

  // Load stored saved walls
  const [walls, setWalls] = useState<SavedWallEstimate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load Indian walls history', e);
    }
    return INITIAL_INDIAN_SAVED_WALLS;
  });

  // Persist input state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUT, JSON.stringify(input));
    } catch (e) {
      console.error('Failed to save Indian input', e);
    }
  }, [input]);

  // Persist walls history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(walls));
    } catch (e) {
      console.error('Failed to save Indian walls', e);
    }
  }, [walls]);

  // Compute live results
  const result: IndianCalculationResult = useMemo(() => {
    return calculateIndianMasonry(input);
  }, [input]);

  // Toggle Feet <-> Meter
  const handleSystemToggle = () => {
    setInput((prev) => {
      const switchingToMeter = prev.system === 'imperial';
      const factor = switchingToMeter ? 0.3048 : 3.28084;
      return {
        ...prev,
        system: switchingToMeter ? 'metric' : 'imperial',
        wallLength: Number((prev.wallLength * factor).toFixed(1)),
        wallHeight: Number((prev.wallHeight * factor).toFixed(1)),
        openings: prev.openings.map((op) => ({
          ...op,
          width: Number((op.width * factor).toFixed(1)),
          height: Number((op.height * factor).toFixed(1)),
        })),
      };
    });
  };

  // Save Wall
  const handleSaveWall = (name: string, siteName?: string) => {
    const newWall: SavedWallEstimate = {
      id: `wall-${Date.now()}`,
      name,
      siteName,
      date: new Date().toISOString(),
      input: { ...input },
      result: { ...result },
    };
    setWalls((prev) => [newWall, ...prev]);
  };

  // Load Wall
  const handleLoadWall = (savedWall: SavedWallEstimate) => {
    setInput({ ...savedWall.input });
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Wall
  const handleDeleteWall = (id: string) => {
    setWalls((prev) => prev.filter((w) => w.id !== id));
  };

  // Clear All
  const handleClearAll = () => {
    if (window.confirm('क्या आप सच में सभी सेव की गई दीवारें हटाना चाहते हैं?')) {
      setWalls([]);
    }
  };

  // Reset to default 10x10 ft wall
  const handleResetDefaults = () => {
    if (window.confirm('दीवार का नाप 10×10 फीट पर रीसेट करें?')) {
      setInput(DEFAULT_INDIAN_INPUT);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        system={input.system}
        onSystemToggle={handleSystemToggle}
        savedCount={walls.length}
        onOpenPlayStoreGuide={() => setShowPlayStoreModal(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-5 py-5 space-y-5">
        {/* Tab 1: Wall Calculator & Blueprint */}
        {activeTab === 'calculator' && (
          <div className="space-y-5">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-900">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <HardHat className="w-4 h-4 text-amber-400" />
                <span>
                  भारतीय चिनाई मानक (9" व 4.5" ईंट दीवार कैलकुलेटर)
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
                title="10×10 फीट दीवार पर रीसेट करें"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>रीसेट नाप (10×10 ft)</span>
              </button>
            </div>

            {/* Interactive Blueprint Visualizer */}
            <WallBlueprint input={input} result={result} />

            {/* Form + Results Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Form Input Column */}
              <div className="lg:col-span-7">
                <CalculatorForm input={input} onChange={setInput} />
              </div>

              {/* Results Column */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <ResultsDisplay
                  input={input}
                  result={result}
                  onSaveWall={handleSaveWall}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Desi Unit Converter */}
        {activeTab === 'converter' && <UnitConverter />}

        {/* Tab 3: Saved Walls History */}
        {activeTab === 'history' && (
          <ProjectHistory
            walls={walls}
            onLoadWall={handleLoadWall}
            onDeleteWall={handleDeleteWall}
            onClearAll={handleClearAll}
            onSwitchToCalculator={() => setActiveTab('calculator')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">BrickCalc India</span>
            <span>•</span>
            <span>ईंट, सीमेंट व बालू कैलकुलेटर (भारतीय निर्माण मानक)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>100% ऑफलाइन चलने वाला</span>
            <span>•</span>
            <button
              onClick={() => setShowPlayStoreModal(true)}
              className="text-amber-400 hover:underline"
            >
              Play Store Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Offline Status */}
      <OfflineIndicator />

      {/* Play Store Guide Modal */}
      <PlayStoreGuideModal
        isOpen={showPlayStoreModal}
        onClose={() => setShowPlayStoreModal(false)}
      />
    </div>
  );
}
