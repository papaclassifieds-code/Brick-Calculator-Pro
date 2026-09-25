import React, { useState } from 'react';
import { ArrowRightLeft, BookOpen, Layers, Ruler, Box, Sparkles, Compass } from 'lucide-react';

type UnitCategory = 'area' | 'volume' | 'length';

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('area');
  const [value, setValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>('sqft');
  const [toUnit, setToUnit] = useState<string>('gaj');

  const conversions = {
    area: {
      units: [
        { id: 'sqft', name: 'वर्ग फीट (Square Feet)', factor: 1 },
        { id: 'gaj', name: 'गज / वर्ग गज (Gaj / Sq.Yard)', factor: 9 }, // 1 Gaj = 9 sq.ft
        { id: 'brass_area', name: 'ब्रास एरिया (Brass = 100 Sq.Ft)', factor: 100 },
        { id: 'sqm', name: 'वर्ग मीटर (Square Meter)', factor: 10.7639 },
        { id: 'guntha', name: 'गुंठा (Guntha - MH/KA)', factor: 1089 }, // 1089 sq ft
        { id: 'biswa', name: 'बिस्वा (Biswa - UP/HR/PB)', factor: 1361.25 }, // ~125-150 sq yards
        { id: 'bigha_pucca', name: 'पक्का बीघा (Pucca Bigha)', factor: 27225 }, // 3025 sq yd
        { id: 'acre', name: 'एकड़ (Acre)', factor: 43560 },
      ],
    },
    volume: {
      units: [
        { id: 'cft', name: 'CFT / घन फुट (Cubic Feet)', factor: 1 },
        { id: 'brass_vol', name: 'ब्रास (Brass = 100 CFT)', factor: 100 },
        { id: 'trolley', name: 'ट्रैक्टर ट्रॉली (Trolley ≈ 80 CFT)', factor: 80 },
        { id: 'tipper', name: 'डम्पर / टिप्पर (Dumper ≈ 350 CFT)', factor: 350 },
        { id: 'cum', name: 'घन मीटर (Cubic Meter - m³)', factor: 35.3147 },
        { id: 'cement_bag', name: 'सीमेंट बोरी वॉल्यूम (50kg = 1.226 CFT)', factor: 1.226 },
      ],
    },
    length: {
      units: [
        { id: 'ft', name: 'फीट (Feet)', factor: 1 },
        { id: 'inch', name: 'इंच (Inches)', factor: 1 / 12 },
        { id: 'soot', name: 'सूत (Soot = 1/8 Inch)', factor: 1 / 96 },
        { id: 'm', name: 'मीटर (Meter)', factor: 3.28084 },
        { id: 'cm', name: 'सेंटीमीटर (Centimeter)', factor: 0.0328084 },
        { id: 'mm', name: 'मिलीमीटर (Millimeter)', factor: 0.00328084 },
        { id: 'gaj_len', name: 'गज लंबाई (1 Yard = 3 Feet)', factor: 3 },
        { id: 'hath', name: 'हाथ (Hath ≈ 1.5 Feet)', factor: 1.5 },
      ],
    },
  };

  const currentUnits = conversions[category].units;
  const fromObj = currentUnits.find((u) => u.id === fromUnit) || currentUnits[0];
  const toObj = currentUnits.find((u) => u.id === toUnit) || currentUnits[1];

  // Base value calculation
  const baseValue = (value || 0) * fromObj.factor;
  const convertedValue = baseValue / toObj.factor;

  const handleCategorySwitch = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(conversions[cat].units[0].id);
    setToUnit(conversions[cat].units[1].id);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="space-y-4">
      {/* Converter Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            देसी नाप-तौल कन्वर्टर <span className="text-slate-400 font-normal">(Indian Construction Units)</span>
          </h2>
        </div>

        {/* Category Selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleCategorySwitch('area')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              category === 'area'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>क्षेत्रफल (Sq.Ft / गज)</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('volume')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              category === 'volume'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>आयतन (CFT / ब्रास / ट्रॉली)</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('length')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              category === 'length'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>लंबाई (फुट / इंच / सूत)</span>
          </button>
        </div>

        {/* Input & Output */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
          {/* From */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold">संख्या दर्ज करें (Input)</label>
            <input
              type="number"
              value={value === 0 ? '' : value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xl text-white font-mono-num font-bold focus:border-amber-400"
              placeholder="100"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-semibold"
            >
              {currentUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center py-1">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-full bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700 active:scale-95 transition"
              title="बदलें (Swap)"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold">बदलकर आया (Result)</label>
            <div className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3.5 py-2 text-xl text-emerald-400 font-mono-num font-bold truncate">
              {Number(convertedValue.toFixed(3)).toLocaleString('en-IN')}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-300 font-semibold"
            >
              {currentUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Formula note */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>अनुपात (Formula):</span>
          <span className="text-white font-bold">
            1 {fromObj.name.split(' ')[0]} = {(fromObj.factor / toObj.factor).toFixed(4)} {toObj.name.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* भारतीय साइट के नियम (Site Thumb Rules) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            ठेकेदार व मिस्त्री के जरूरी नियम (Thumb Rules)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-amber-400">9 इंच दीवार (100 Sq.Ft)</div>
            <div className="text-slate-200 mt-1 font-semibold">≈ 900 से 1,000 ईंटें लगती हैं</div>
            <div className="text-[11px] text-slate-400">सीमेंट: ~3.5 बोरी | रेत: ~22 CFT</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-sky-400">4.5 इंच परदा दीवार (100 Sq.Ft)</div>
            <div className="text-slate-200 mt-1 font-semibold">≈ 450 से 500 ईंटें लगती हैं</div>
            <div className="text-[11px] text-slate-400">सीमेंट: ~2 बोरी (1:4 मसाला) | रेत: ~11 CFT</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-emerald-400">1 ट्रैक्टर ट्रॉली रेत (Sand)</div>
            <div className="text-slate-200 mt-1 font-semibold">≈ 70 से 90 CFT (औसतन 80 CFT)</div>
            <div className="text-[11px] text-slate-400">वजन: लगभग 3.5 से 4 टन</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-purple-400">1 ब्रास (Brass) का मतलब</div>
            <div className="text-slate-200 mt-1 font-semibold">एरिया: 100 वर्ग फीट | आयतन: 100 CFT</div>
            <div className="text-[11px] text-slate-400">महाराष्ट्र, एमपी व राजस्थान में प्रचलित</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-orange-400">1 गज (Square Yard)</div>
            <div className="text-slate-200 mt-1 font-semibold">1 गज = 9 वर्ग फीट (Sq.Ft)</div>
            <div className="text-[11px] text-slate-400">100 गज प्लॉट = 900 वर्ग फीट</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-cyan-400">1 घन मीटर (1 m³) ईंट चिनाई</div>
            <div className="text-slate-200 mt-1 font-semibold">≈ 500 मॉड्यूलर ईंटें लगती हैं</div>
            <div className="text-[11px] text-slate-400">पारंपरिक लाल ईंट: ~430 ईंटें/m³</div>
          </div>
        </div>
      </div>
    </div>
  );
};
