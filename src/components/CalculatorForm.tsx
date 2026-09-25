import React, { useState } from 'react';
import {
  IndianWallInput,
  IndianWallType,
  IndianBrickType,
  WallOpening,
  MortarRatio,
} from '../types/calculator';
import { INDIAN_BRICK_PRESETS } from '../utils/calculator';
import {
  Ruler,
  Maximize2,
  DoorOpen,
  Plus,
  Trash2,
  Sliders,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Percent,
} from 'lucide-react';

interface Props {
  input: IndianWallInput;
  onChange: (updater: (prev: IndianWallInput) => IndianWallInput) => void;
}

export const CalculatorForm: React.FC<Props> = ({ input, onChange }) => {
  const [showRates, setShowRates] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isFeet = input.system === 'imperial';
  const unitLabel = isFeet ? 'फीट (ft)' : 'मीटर (m)';
  const shortUnit = isFeet ? 'ft' : 'm';

  // Quick increment/decrement helper
  const adjustDim = (field: 'wallLength' | 'wallHeight', delta: number) => {
    onChange((prev) => {
      const current = prev[field];
      const nextVal = Math.max(1, Number((current + delta).toFixed(1)));
      return { ...prev, [field]: nextVal };
    });
  };

  // Quick presets for openings
  const addPresetOpening = (type: 'door' | 'window' | 'vent') => {
    const isFt = input.system === 'imperial';
    let newOp: WallOpening;

    if (type === 'door') {
      newOp = {
        id: `door-${Date.now()}`,
        name: 'Door',
        hindiName: 'दरवाजा',
        type: 'door',
        width: isFt ? 3.0 : 0.9,
        height: isFt ? 7.0 : 2.1,
        count: 1,
      };
    } else if (type === 'window') {
      newOp = {
        id: `window-${Date.now()}`,
        name: 'Window',
        hindiName: 'खिड़की',
        type: 'window',
        width: isFt ? 4.0 : 1.2,
        height: isFt ? 4.0 : 1.2,
        count: 1,
      };
    } else {
      newOp = {
        id: `vent-${Date.now()}`,
        name: 'Ventilator',
        hindiName: 'रोशनदान',
        type: 'custom',
        width: isFt ? 2.0 : 0.6,
        height: isFt ? 1.5 : 0.45,
        count: 1,
      };
    }

    onChange((prev) => ({
      ...prev,
      openings: [...prev.openings, newOp],
    }));
  };

  const removeOpening = (id: string) => {
    onChange((prev) => ({
      ...prev,
      openings: prev.openings.filter((op) => op.id !== id),
    }));
  };

  const updateOpening = (id: string, updates: Partial<WallOpening>) => {
    onChange((prev) => ({
      ...prev,
      openings: prev.openings.map((op) => (op.id === id ? { ...op, ...updates } : op)),
    }));
  };

  // Wall area in Sq.Ft and Gaj
  const grossArea = input.wallLength * input.wallHeight;
  const areaInGaj = isFeet ? (grossArea / 9).toFixed(1) : (grossArea * 1.196).toFixed(1);

  return (
    <div className="space-y-4">
      {/* 1. दीवार का नाप (Wall Dimensions) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-bold text-white">
              दीवार का नाप <span className="text-slate-400 font-normal">(Wall Dimensions)</span>
            </h2>
          </div>
          <div className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {grossArea.toFixed(0)} {isFeet ? 'वर्ग फीट (Sq.Ft)' : 'वर्ग मीटर'} (~{areaInGaj} गज)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Wall Length */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                दीवार की लंबाई <span className="text-slate-400 font-normal">(Length)</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {input.wallLength} {shortUnit}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                step="0.5"
                min="1"
                value={input.wallLength || ''}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    wallLength: Math.max(0, parseFloat(e.target.value) || 0),
                  }))
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-l-xl px-3 py-2 text-base text-white font-mono-num font-bold focus:outline-none focus:border-amber-400"
                placeholder="10"
              />
              <div className="flex bg-slate-800 border-y border-r border-slate-700 rounded-r-xl divide-x divide-slate-700">
                <button
                  type="button"
                  onClick={() => adjustDim('wallLength', -1)}
                  className="px-3 py-2 text-xs font-black text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95"
                  title="-1 फीट"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => adjustDim('wallLength', 1)}
                  className="px-3 py-2 text-xs font-black text-amber-400 hover:text-white hover:bg-slate-700 active:scale-95"
                  title="+1 फीट"
                >
                  +1
                </button>
              </div>
            </div>
          </div>

          {/* Wall Height */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                दीवार की ऊंचाई <span className="text-slate-400 font-normal">(Height)</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {input.wallHeight} {shortUnit}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="number"
                step="0.5"
                min="1"
                value={input.wallHeight || ''}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    wallHeight: Math.max(0, parseFloat(e.target.value) || 0),
                  }))
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-l-xl px-3 py-2 text-base text-white font-mono-num font-bold focus:outline-none focus:border-amber-400"
                placeholder="10"
              />
              <div className="flex bg-slate-800 border-y border-r border-slate-700 rounded-r-xl divide-x divide-slate-700">
                <button
                  type="button"
                  onClick={() => adjustDim('wallHeight', -1)}
                  className="px-3 py-2 text-xs font-black text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95"
                  title="-1 फीट"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => adjustDim('wallHeight', 1)}
                  className="px-3 py-2 text-xs font-black text-amber-400 hover:text-white hover:bg-slate-700 active:scale-95"
                  title="+1 फीट"
                >
                  +1
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. दीवार की मोटाई (Wall Type) */}
        <div className="mt-4 pt-3.5 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-200 block mb-2">
            दीवार की मोटाई चुनें <span className="text-slate-400 font-normal">(Select Wall Thickness)</span>:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* 9 Inch Wall */}
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, wallType: '9_inch' }))}
              className={`p-2.5 rounded-xl border text-left transition ${
                input.wallType === '9_inch'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-sm">9" बाहरी दीवार</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                मुख्य/मकान की बाहरी दीवार (~9 ईंटें/sq.ft)
              </div>
            </button>

            {/* 4.5 Inch Wall */}
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, wallType: '4_5_inch' }))}
              className={`p-2.5 rounded-xl border text-left transition ${
                input.wallType === '4_5_inch'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-sm">4.5" परदा दीवार</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                पार्टीशन दीवार (कमरे के बीच) (~4.5 ईंटें/sq.ft)
              </div>
            </button>

            {/* 13.5 Inch Wall */}
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, wallType: '13_5_inch' }))}
              className={`p-2.5 rounded-xl border text-left transition ${
                input.wallType === '13_5_inch'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-sm">13.5" भारी दीवार</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                नींव / लोड बियरिंग दीवार (1.5 ईंट मोटी)
              </div>
            </button>

            {/* AAC Block */}
            <button
              type="button"
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  wallType: 'aac_block',
                  brickType: 'aac_block',
                }))
              }
              className={`p-2.5 rounded-xl border text-left transition ${
                input.wallType === 'aac_block'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-sm">AAC ब्लॉक</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                हल्के सफेद ब्लॉक (सिपोरैक्स ब्लॉक)
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ईंट का प्रकार (Brick Selection) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold text-white">
              ईंट का प्रकार <span className="text-slate-400 font-normal">(Brick Type)</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {INDIAN_BRICK_PRESETS.filter((p) => p.id !== 'custom').map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, brickType: p.id }))}
              className={`p-3 rounded-xl border text-left transition ${
                input.brickType === p.id
                  ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white">{p.hindiName}</div>
              <div className="text-[11px] text-slate-400 mt-1 leading-tight">
                नाप: {p.lengthInch}" × {p.widthInch}" × {p.heightInch}" ({p.lengthMm}×{p.widthMm}×{p.heightMm} mm)
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. दरवाजा व खिड़की कटौती (Deductions) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-bold text-white">
              दरवाजा व खिड़की कटौती <span className="text-slate-400 font-normal">(Openings)</span>
            </h2>
          </div>

          {/* Quick Add Presets */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => addPresetOpening('door')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              + दरवाजा (Door)
            </button>
            <button
              type="button"
              onClick={() => addPresetOpening('window')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              + खिड़की (Window)
            </button>
          </div>
        </div>

        {input.openings.length === 0 ? (
          <div className="p-3 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
            कोई दरवाजा या खिड़की नहीं है (पूरी दीवार ठोस चिनाई की मानी जाएगी)।
          </div>
        ) : (
          <div className="space-y-2">
            {input.openings.map((op) => (
              <div
                key={op.id}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs"
              >
                <input
                  type="text"
                  value={op.hindiName || op.name}
                  onChange={(e) => updateOpening(op.id, { hindiName: e.target.value })}
                  className="w-24 sm:w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-medium"
                />

                <div className="flex items-center gap-1 text-slate-400">
                  <span>चौड़ाई:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={op.width || ''}
                    onChange={(e) =>
                      updateOpening(op.id, { width: parseFloat(e.target.value) || 0 })
                    }
                    className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono-num font-bold text-center"
                  />
                  <span>{shortUnit}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <span>ऊंचाई:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={op.height || ''}
                    onChange={(e) =>
                      updateOpening(op.id, { height: parseFloat(e.target.value) || 0 })
                    }
                    className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono-num font-bold text-center"
                  />
                  <span>{shortUnit}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <span>संख्या:</span>
                  <input
                    type="number"
                    min="1"
                    value={op.count}
                    onChange={(e) =>
                      updateOpening(op.id, { count: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-12 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono-num font-bold text-center"
                  />
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[11px] font-mono text-sky-400 font-bold">
                    -{(op.width * op.height * op.count).toFixed(1)} {shortUnit}²
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOpening(op.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900"
                    title="हटाएं"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. वेस्टेज व मसाला अनुपात (Wastage & Mortar Mix) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Wastage */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                ईंटों की वेस्टेज / टूट-फूट <span className="text-slate-400">(Wastage)</span>:
              </span>
              <span className="font-mono text-amber-400 font-bold">
                +{input.wastagePercent}%
              </span>
            </div>
            <div className="flex gap-2">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, wastagePercent: pct }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                    input.wastagePercent === pct
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pct}% {pct === 5 ? '(सामान्य)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Mortar Mix */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                मसाला अनुपात <span className="text-slate-400">(Cement : Sand)</span>:
              </span>
              <span className="font-mono text-sky-400 font-bold">
                {input.mortarRatio}
              </span>
            </div>
            <div className="flex gap-2">
              {(['1:4', '1:5', '1:6'] as MortarRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, mortarRatio: ratio }))}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                    input.mortarRatio === ratio
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio} {ratio === '1:6' ? '(9" दीवार)' : ratio === '1:4' ? '(4.5" परदा)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. बाजार भाव / रेट (Material Rates in ₹) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowRates(!showRates)}
            className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>सामग्री व लेबर का रेट बदलें (Market Rates in ₹)</span>
            {showRates ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <span className="text-[11px] text-slate-400">
            ईंट: ₹{input.costs.brickRatePerPiece} • सीमेंट: ₹{input.costs.cementBagRate} • बालू: ₹{input.costs.sandRatePerCft}/cft
          </span>
        </div>

        {showRates && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">ईंट का रेट (₹ प्रति ईंट)</label>
              <input
                type="number"
                step="0.5"
                value={input.costs.brickRatePerPiece || ''}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    costs: { ...prev.costs, brickRatePerPiece: parseFloat(e.target.value) || 0 },
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono-num font-bold"
                placeholder="8.5"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">सीमेंट (₹ प्रति 50kg बोरी)</label>
              <input
                type="number"
                step="5"
                value={input.costs.cementBagRate || ''}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    costs: { ...prev.costs, cementBagRate: parseFloat(e.target.value) || 0 },
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono-num font-bold"
                placeholder="380"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">बालू/रेत (₹ प्रति CFT)</label>
              <input
                type="number"
                step="1"
                value={input.costs.sandRatePerCft || ''}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    costs: { ...prev.costs, sandRatePerCft: parseFloat(e.target.value) || 0 },
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono-num font-bold"
                placeholder="55"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">चिनाई लेबर (₹ प्रति Sq.Ft)</label>
              <input
                type="number"
                step="1"
                value={input.costs.laborRatePerSqFt || ''}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    costs: { ...prev.costs, laborRatePerSqFt: parseFloat(e.target.value) || 0 },
                  }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono-num font-bold"
                placeholder="25"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
