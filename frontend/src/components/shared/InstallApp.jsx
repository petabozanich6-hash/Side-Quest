import React, { useState } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { useInstallPrompt } from "../../lib/pwa";

/**
 * "Install the app" button. Android, Chrome and Edge get the browser's own install prompt;
 * iPhone and iPad (no prompt exists) get short Add to Home Screen steps. Hidden once installed.
 */
export default function InstallApp({ variant = "sidebar", className = "" }) {
  const { canInstall, ios, install } = useInstallPrompt();
  const [help, setHelp] = useState(false);
  if (!canInstall && !ios) return null;

  const onClick = () => (canInstall ? install() : setHelp(true));
  const style = variant === "sidebar"
    ? "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/80"
    : "rounded-full px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border";

  return (
    <>
      <button onClick={onClick} className={`${style} ${className}`} style={{ color: "#1F3B2D", borderColor: "#D4C8A8" }} data-testid="install-app">
        <Download size={16} /> Install the app
      </button>
      {help && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 flex items-end sm:items-center justify-center p-4" onClick={() => setHelp(false)} data-testid="install-ios-help">
          <div className="w-full max-w-sm paper-card p-6 relative" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#FFFDF7" }}>
            <button className="absolute top-3 right-3 text-stone-400" onClick={() => setHelp(false)} aria-label="Close"><X size={18} /></button>
            <div className="flex items-center gap-3">
              <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-xl" />
              <div className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Add Side-Quest to your Home Screen</div>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-stone-700">
              <li className="flex gap-2"><span className="font-bold">1.</span><span>In Safari, tap the Share button <Share size={14} className="inline -mt-0.5" /> (at the bottom of the screen on iPhone, at the top on iPad).</span></li>
              <li className="flex gap-2"><span className="font-bold">2.</span><span>Scroll and tap <strong>Add to Home Screen</strong> <PlusSquare size={14} className="inline -mt-0.5" />.</span></li>
              <li className="flex gap-2"><span className="font-bold">3.</span><span>Tap <strong>Add</strong>. Side-Quest opens from its own icon, full screen.</span></li>
            </ol>
            <p className="mt-4 text-xs text-stone-500">Using Chrome on an iPhone? Open this page in Safari first, or use Chrome's Share menu if it shows Add to Home Screen.</p>
          </div>
        </div>
      )}
    </>
  );
}
