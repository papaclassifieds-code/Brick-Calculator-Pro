import React from 'react';
import { X, Smartphone, CheckCircle, ExternalLink, ShieldCheck, Terminal, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Google Play Store Publishing Guide
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready (TWA/PWA)
                </span>
              </h3>
              <p className="text-xs text-slate-400">How to package this app into an Android App Bundle (.aab)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Status checklist */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="font-semibold text-slate-200 text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pre-Configured Play Store Standards
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Web App Manifest with 192 & 512px icons</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Maskable & Any icon types specified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Standalone display mode enabled</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Offline caching & Service Worker ready</span>
              </div>
            </div>
          </div>

          {/* Option 1: PWABuilder (Easiest, zero code) */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                Option A: Fast 1-Click via PWABuilder (Recommended)
              </span>
              <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10">No Android Studio Needed</span>
            </div>
            <p className="text-slate-400 mb-3">
              Microsoft & Google partnered to create <strong>PWABuilder</strong>, which converts any PWA URL into a signed Google Play <code className="text-amber-300">.aab</code> package.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 ml-1">
              <li>Deploy or host your app (or use your Cloud Run live app URL).</li>
              <li>Visit <strong className="text-sky-400">pwabuilder.com</strong> and paste the URL.</li>
              <li>Click <strong>Package for Stores</strong> &rarr; Select <strong>Google Play</strong>.</li>
              <li>Provide your package name (e.g. <code className="text-amber-300">com.engineer.brickcalc</code>) and generate signing key.</li>
              <li>Download the generated <code className="text-amber-300">.aab</code> file and upload it to the <strong>Google Play Console</strong>.</li>
            </ol>
          </div>

          {/* Option 2: Google's official Bubblewrap CLI */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                Option B: Google Official CLI (Bubblewrap)
              </span>
              <span className="text-[10px] text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10">Official Google Tool</span>
            </div>
            <p className="text-slate-400 mb-2">
              Google Chrome team's CLI for Trusted Web Activity (TWA):
            </p>
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-amber-300/90 border border-slate-800 space-y-1">
              <div>npm i -g @bubblewrap/cli</div>
              <div>bubblewrap init --manifest https://YOUR-APP-URL/manifest.webmanifest</div>
              <div>bubblewrap build</div>
            </div>
          </div>

          {/* Google Play Console Checklist */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Google Play Console Upload Checklist
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Google Play Developer Account ($25 one-time registration fee).</li>
              <li>App icon (512x512 PNG included in <code className="text-amber-300">/public/pwa-512x512.png</code>).</li>
              <li>Feature Graphic (1024x500 banner).</li>
              <li>At least 2 phone screenshots of this calculator in action.</li>
              <li>Simple Privacy Policy URL (e.g. free GitHub page or Google Doc).</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition shadow-lg text-xs"
          >
            Ready to Build
          </button>
        </div>
      </div>
    </div>
  );
};
