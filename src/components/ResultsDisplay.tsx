import React, { useState } from 'react';
import { IndianWallInput, IndianCalculationResult } from '../types/calculator';
import { formatINR } from '../utils/calculator';
import {
  Layers,
  Package,
  Droplets,
  Share2,
  Copy,
  Check,
  BookmarkPlus,
  Printer,
  HardHat,
  Truck,
  Sparkles,
} from 'lucide-react';

interface Props {
  input: IndianWallInput;
  result: IndianCalculationResult;
  onSaveWall: (name: string, siteName?: string) => void;
}

export const ResultsDisplay: React.FC<Props> = ({ input, result, onSaveWall }) => {
  const [copied, setCopied] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [wallName, setWallName] = useState(`दीवार ${input.wallLength}x${input.wallHeight} फीट`);
  const [siteName, setSiteName] = useState('');

  const isFeet = input.system === 'imperial';
  const unit = isFeet ? 'फीट' : 'मीटर';
  const wallTypeName =
    input.wallType === '9_inch'
      ? '9 इंच बाहरी दीवार'
      : input.wallType === '4_5_inch'
      ? '4.5 इंच परदा दीवार'
      : input.wallType === '13_5_inch'
      ? '13.5 इंच भारी दीवार'
      : 'AAC ब्लॉक दीवार';

  // Format WhatsApp Message (in Hindi + English)
  const generateWhatsAppMessage = () => {
    return `
🧱 *ईंट व सीमेंट का हिसाब (BrickCalc India)*
------------------------------------
📍 *दीवार:* ${input.wallLength} × ${input.wallHeight} ${unit} (${wallTypeName})
📐 *नेट एरिया:* ${result.netWallAreaSqFt} वर्ग फीट (~${(result.netWallAreaSqFt / 9).toFixed(1)} गज)
🚪 *कटौती:* ${input.openings.length} दरवाजा/खिड़की

📊 *सामग्री की जरूरत (Materials Needed):*
• *कुल ईंटें:* *${result.totalBricksRequired.toLocaleString('en-IN')} पीस* (नेट: ${result.netBricks} + वेस्टेज: ${result.wastageBricks})
• *सीमेंट बोरी (50kg):* *${result.cementBags50kg} बोरी* (अनुपात ${input.mortarRatio})
• *बालू / रेत:* *${result.sandCft} CFT* (~${result.sandTrolleyApprox} ट्रॉली / ${result.sandBrass} ब्रास)
• *पानी:* ~${result.waterLitres} लीटर
• *रद्दे (लेयर्स):* ~${result.totalCourses} रद्दे

💰 *अनुमानित खर्च (Estimated Cost):*
• ईंटें (@₹${input.costs.brickRatePerPiece}): ${formatINR(result.costBreakdown.brickCost)}
• सीमेंट (@₹${input.costs.cementBagRate}): ${formatINR(result.costBreakdown.cementCost)}
• रेत (@₹${input.costs.sandRatePerCft}/cft): ${formatINR(result.costBreakdown.sandCost)}
• चिनाई मजदूरी: ${formatINR(result.costBreakdown.laborCost)}
💵 *कुल अनुमानित लागत:* *${formatINR(result.costBreakdown.totalCost)}*
------------------------------------
📱 _BrickCalc India ऐप द्वारा तैयार किया गया_
    `.trim();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallName.trim()) return;
    onSaveWall(wallName.trim(), siteName.trim());
    setShowSaveModal(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. Main Hero Card: Total Bricks */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-5 shadow-2xl text-slate-950">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950/20 text-slate-950 px-2.5 py-1 rounded-full border border-slate-950/20">
              कुल ईंटों की जरूरत (Total Bricks)
            </span>
            <span className="text-xs font-mono font-bold bg-white/25 px-2 py-0.5 rounded">
              +{input.wastagePercent}% वेस्टेज सहित
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono-num">
              {result.totalBricksRequired.toLocaleString('en-IN')}
            </span>
            <span className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
              ईंटें (Bricks)
            </span>
          </div>

          {/* Sub detail: Net vs Waste */}
          <div className="mt-3 pt-3 border-t border-slate-950/20 flex flex-wrap items-center justify-between text-xs font-semibold gap-2">
            <div>
              दीवार में: <strong>{result.netBricks.toLocaleString('en-IN')}</strong> + वेस्टेज: <strong>{result.wastageBricks.toLocaleString('en-IN')}</strong>
            </div>
            <div className="font-mono text-[11px] bg-slate-950/15 px-2 py-0.5 rounded">
              ~{result.bricksPerSqFt} ईंटें प्रति sq.ft
            </div>
          </div>
        </div>
      </div>

      {/* 2. सामग्री की जरूरत (Cement, Sand, Water) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* सीमेंट की बोरी */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Package className="w-3.5 h-3.5 text-sky-400" />
            <span>सीमेंट (Cement)</span>
          </div>
          <div className="text-2xl font-black text-white font-mono-num">
            {result.cementBags50kg} <span className="text-xs font-normal text-slate-400">बोरी</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            50kg बोरी (अनुपात {input.mortarRatio})
          </div>
        </div>

        {/* रेत / बालू (CFT & ट्रॉली) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>रेत/बालू (Sand)</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono-num">
            {result.sandCft} <span className="text-xs font-normal text-slate-300">CFT</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ~{result.sandTrolleyApprox} ट्रैक्टर ट्रॉली ({result.sandBrass} ब्रास)
          </div>
        </div>

        {/* रद्दे व चिनाई लेयर */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>रद्दे (Layers)</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono-num">
            {result.totalCourses} <span className="text-xs font-normal text-slate-400">रद्दे</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ~{result.bricksPerCourse} ईंटें प्रति रद्दा
          </div>
        </div>
      </div>

      {/* 3. अनुमानित खर्च (Cost Breakdown in ₹) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              कुल अनुमानित खर्च (Estimated Cost)
            </div>
            <div className="text-[11px] text-slate-400">सामग्री + चिनाई लेबर सहित</div>
          </div>
          <div className="text-2xl font-black font-mono-num text-emerald-400">
            {formatINR(result.costBreakdown.totalCost)}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-slate-400">ईंटें ({result.totalBricksRequired} पीस)</div>
            <div className="font-bold text-white font-mono-num mt-0.5">
              {formatINR(result.costBreakdown.brickCost)}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-slate-400">सीमेंट ({result.cementBags50kg} बोरी)</div>
            <div className="font-bold text-white font-mono-num mt-0.5">
              {formatINR(result.costBreakdown.cementCost)}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-slate-400">बालू ({result.sandCft} CFT)</div>
            <div className="font-bold text-white font-mono-num mt-0.5">
              {formatINR(result.costBreakdown.sandCost)}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-slate-400">चिनाई मजदूरी</div>
            <div className="font-bold text-white font-mono-num mt-0.5">
              {formatINR(result.costBreakdown.laborCost)}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons: WhatsApp Share & Save */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        {/* Big WhatsApp Share Button */}
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
          title="मिस्त्री, ठेकेदार या मटेरियल वाले को व्हाट्सएप पर भेजें"
        >
          <Share2 className="w-4 h-4" />
          <span>व्हाट्सएप पर शेयर करें (Share to WhatsApp)</span>
        </button>

        {/* Save Wall */}
        <button
          type="button"
          onClick={() => {
            setWallName(`${input.wallLength}x${input.wallHeight} फीट (${wallTypeName})`);
            setShowSaveModal(true);
          }}
          className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
        >
          <BookmarkPlus className="w-4 h-4 stroke-[2.5]" />
          <span>कमरे का हिसाब सेव करें</span>
        </button>

        {/* Copy Text */}
        <button
          type="button"
          onClick={handleCopyClipboard}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          title="कॉपी करें"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'कॉपी हो गया' : 'कॉपी'}</span>
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <form
            onSubmit={handleSaveSubmit}
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-amber-400" />
                कमरे या दीवार का हिसाब सेव करें
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  दीवार या कमरे का नाम *
                </label>
                <input
                  type="text"
                  required
                  value={wallName}
                  onChange={(e) => setWallName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-amber-400"
                  placeholder="उदा. बेडरूम 1 की दीवार, सामने की बाउंड्री"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  मकान का पता / साइट का नाम (वैकल्पिक)
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400"
                  placeholder="उदा. प्लॉट नंबर 45, शर्मा जी का मकान"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                कुल ईंटें: <strong>{result.totalBricksRequired} पीस</strong> • सीमेंट: <strong>{result.cementBags50kg} बोरी</strong> • रेत: <strong>{result.sandCft} CFT</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
              >
                सेव करें (Save)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
