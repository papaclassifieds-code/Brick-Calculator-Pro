import React, { useState } from 'react';
import { SavedWallEstimate } from '../types/calculator';
import { formatINR } from '../utils/calculator';
import {
  FolderArchive,
  Trash2,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Building2,
  Calendar,
  Layers,
  Package,
  Truck,
  DollarSign,
  PlusCircle,
} from 'lucide-react';

interface Props {
  walls: SavedWallEstimate[];
  onLoadWall: (wall: SavedWallEstimate) => void;
  onDeleteWall: (id: string) => void;
  onClearAll: () => void;
  onSwitchToCalculator: () => void;
}

export const ProjectHistory: React.FC<Props> = ({
  walls,
  onLoadWall,
  onDeleteWall,
  onClearAll,
  onSwitchToCalculator,
}) => {
  const [copied, setCopied] = useState(false);

  // Cumulative site total across all saved walls
  const cumulative = walls.reduce(
    (acc, w) => ({
      totalBricks: acc.totalBricks + w.result.totalBricksRequired,
      cementBags: acc.cementBags + w.result.cementBags50kg,
      sandCft: acc.sandCft + w.result.sandCft,
      sandTrolley: acc.sandTrolley + w.result.sandTrolleyApprox,
      totalCost: acc.totalCost + (w.result.costBreakdown?.totalCost || 0),
    }),
    { totalBricks: 0, cementBags: 0, sandCft: 0, sandTrolley: 0, totalCost: 0 }
  );

  const handleShareFullSiteWhatsApp = () => {
    const text = `
🏗️ *पूरे मकान की कुल सामग्री (BrickCalc India Site BOQ)*
=============================================
कुल कमरे / दीवारें: *${walls.length}*

🧱 *कुल ईंटें (Total Bricks):* *${cumulative.totalBricks.toLocaleString('en-IN')} पीस*
📦 *सीमेंट की कुल बोरियां:* *${cumulative.cementBags.toLocaleString('en-IN')} बोरी (50kg)*
🚛 *कुल बालू / रेत:* *${cumulative.sandCft.toFixed(1)} CFT* (~${cumulative.sandTrolley.toFixed(1)} ट्रॉली)
💰 *अनुमानित कुल खर्च:* *${formatINR(cumulative.totalCost)}*

कमरे अनुसार विवरण:
${walls
  .map(
    (w, i) =>
      `${i + 1}. ${w.name}: ${w.result.totalBricksRequired.toLocaleString('en-IN')} ईंटें, ${w.result.cementBags50kg} बोरी सीमेंट`
  )
  .join('\n')}
=============================================
_BrickCalc India ऐप_
    `.trim();

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleCopyFullSite = () => {
    const text = `
पूरे मकान की कुल सामग्री (BrickCalc India):
कुल दीवारें: ${walls.length}
कुल ईंटें: ${cumulative.totalBricks.toLocaleString('en-IN')} पीस
कुल सीमेंट: ${cumulative.cementBags.toLocaleString('en-IN')} बोरी
कुल बालू: ${cumulative.sandCft.toFixed(1)} CFT (~${cumulative.sandTrolley.toFixed(1)} ट्रॉली)
अनुमानित कुल लागत: ${formatINR(cumulative.totalCost)}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* 1. साइट का कुल जोड़ (Cumulative Site Total) */}
      {walls.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  पूरे मकान का कुल जोड़ ({walls.length} दीवारें सेव हैं)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                भट्ठा मालिक या मटेरियल सप्लायर को एक साथ ऑर्डर देने के लिए कुल नाप
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShareFullSiteWhatsApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>व्हाट्सएप ऑर्डर भेजें</span>
              </button>

              <button
                type="button"
                onClick={handleCopyFullSite}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>कॉपी</span>
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>कुल ईंटें (Total Bricks)</span>
              </div>
              <div className="text-2xl font-black text-white font-mono-num mt-1">
                {cumulative.totalBricks.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">पीस</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-sky-400" />
                <span>सीमेंट (Cement Bags)</span>
              </div>
              <div className="text-2xl font-black text-sky-400 font-mono-num mt-1">
                {cumulative.cementBags.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">बोरी</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>रेत / बालू (Sand)</span>
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono-num mt-1">
                {cumulative.sandCft.toFixed(0)} <span className="text-xs font-normal text-slate-300">CFT</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                ~{cumulative.sandTrolley.toFixed(1)} ट्रैक्टर ट्रॉली
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>कुल लागत (Total Cost)</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono-num mt-1">
                {formatINR(cumulative.totalCost)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. कमरों की सूची (List of Saved Walls) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              सेव की गई दीवारें ({walls.length})
            </h2>
          </div>

          {walls.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>सब हटाएं</span>
            </button>
          )}
        </div>

        {walls.length === 0 ? (
          <div className="text-center py-10 px-4">
            <FolderArchive className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-300">कोई दीवार सेव नहीं है</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              कैलकुलेटर में दीवार का नाप निकालने के बाद "कमरे का हिसाब सेव करें" पर क्लिक करें। यहाँ पूरे मकान की कुल ईंटों व सीमेंट का जोड़ दिखेगा।
            </p>
            <button
              type="button"
              onClick={onSwitchToCalculator}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
            >
              <PlusCircle className="w-4 h-4" />
              दीवार कैलकुलेट करें
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {walls.map((wall) => {
              const unit = wall.input.system === 'imperial' ? 'ft' : 'm';
              return (
                <div
                  key={wall.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {wall.name}
                        {wall.siteName && (
                          <span className="text-[11px] font-normal text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {wall.siteName}
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(wall.date).toLocaleDateString('en-IN')}
                        </span>
                        <span>•</span>
                        <span>
                          {wall.input.wallLength} × {wall.input.wallHeight} {unit}
                        </span>
                        <span>•</span>
                        <span>
                          {wall.input.wallType === '9_inch'
                            ? '9" दीवार'
                            : wall.input.wallType === '4_5_inch'
                            ? '4.5" परदा'
                            : '13.5" भारी'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onLoadWall(wall)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition"
                        title="कैलकुलेटर में लोड करें"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>खोलें</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteWall(wall.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Material summary pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-xs">
                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">कुल ईंटें</div>
                      <div className="font-black text-amber-400 font-mono-num text-sm">
                        {wall.result.totalBricksRequired.toLocaleString('en-IN')} पीस
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">सीमेंट</div>
                      <div className="font-bold text-sky-400 font-mono-num text-sm">
                        {wall.result.cementBags50kg} बोरी
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">रेत/बालू</div>
                      <div className="font-bold text-slate-200 font-mono-num text-sm">
                        {wall.result.sandCft} CFT
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400">अनुमानित खर्च</div>
                      <div className="font-bold text-emerald-400 font-mono-num text-sm">
                        {formatINR(wall.result.costBreakdown?.totalCost || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
