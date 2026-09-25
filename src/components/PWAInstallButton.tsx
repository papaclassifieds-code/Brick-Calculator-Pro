import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 text-xs shadow-md shadow-amber-500/20 active:scale-95 transition"
        title="Install to Android / Desktop"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Add to iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                <Download className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white">Install on iPhone / iPad</h3>
              <p className="mt-1 text-xs text-slate-400">
                Run BrickCalc Pro full-screen on site without browser bars:
              </p>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <div className="p-1 rounded bg-slate-700 text-sky-400 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span>1. Tap the <strong>Share</strong> button in Safari’s bottom toolbar.</span>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <div className="p-1 rounded bg-slate-700 text-amber-400 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
