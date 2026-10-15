import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Share, PlusSquare, Smartphone, X, MoreVertical } from "lucide-react";
import { deviceKind, isIosOtherBrowser, useInstallPrompt } from "../../lib/pwa";

/** Add to Home Screen steps for iPhone and iPad (Safari has no install prompt). */
export function IosSteps() {
  return (
    <>
      <ol className="space-y-3 text-sm text-stone-700">
        <li className="flex gap-2"><span className="font-bold">1.</span><span>In Safari, tap the Share button <Share size={14} className="inline -mt-0.5" /> (at the bottom of the screen on iPhone, at the top on iPad).</span></li>
        <li className="flex gap-2"><span className="font-bold">2.</span><span>Scroll and tap <strong>Add to Home Screen</strong> <PlusSquare size={14} className="inline -mt-0.5" />.</span></li>
        <li className="flex gap-2"><span className="font-bold">3.</span><span>Tap <strong>Add</strong>. Side-Quest opens from its own icon, full screen.</span></li>
      </ol>
      {isIosOtherBrowser() && <p className="mt-3 text-xs text-stone-500" data-testid="ios-other-browser">Using Chrome or another browser on an iPhone? Open this page in Safari first, or use that browser's Share menu if it shows Add to Home Screen.</p>}
    </>
  );
}

/** Steps for Android when the browser hasn't offered its own install prompt. */
export function AndroidSteps() {
  return (
    <ol className="space-y-3 text-sm text-stone-700">
      <li className="flex gap-2"><span className="font-bold">1.</span><span>In Chrome, tap the menu <MoreVertical size={14} className="inline -mt-0.5" /> at the top right.</span></li>
      <li className="flex gap-2"><span className="font-bold">2.</span><span>Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).</span></li>
      <li className="flex gap-2"><span className="font-bold">3.</span><span>Tap <strong>Install</strong>. Side-Quest appears with your other apps.</span></li>
    </ol>
  );
}

/**
 * "Install the app" button. Android, Chrome and Edge get the browser's own install prompt;
 * iPhone and iPad (no prompt exists) get short Add to Home Screen steps. On a computer it also offers
 * "Get it on your phone", which opens the QR code page. Hidden once installed.
 */
export default function InstallApp({ variant = "sidebar", className = "" }) {
  const { canInstall, ios, install, installed } = useInstallPrompt();
  const [help, setHelp] = useState(false);
  if (installed) return null;
  const desktop = deviceKind() === "desktop";
  const style = variant === "sidebar"
    ? "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/80"
    : "rounded-full px-4 py-2.5 text-sm font-semibold flex items-center gap-2 border";
  const colours = { color: "#1F3B2D", borderColor: "#D4C8A8" };

  return (
    <>
      {(canInstall || ios) && (
        <button onClick={() => (canInstall ? install() : setHelp(true))} className={`${style} ${className}`} style={colours} data-testid="install-app">
          <Download size={16} /> Install the app
        </button>
      )}
      {(desktop || (!canInstall && !ios)) && (
        <Link to="/get-app" className={`${style} ${className}`} style={colours} data-testid="get-app-link">
          <Smartphone size={16} /> {desktop ? "Get it on your phone" : "Get the app"}
        </Link>
      )}
      {help && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 flex items-end sm:items-center justify-center p-4" onClick={() => setHelp(false)} data-testid="install-ios-help">
          <div className="w-full max-w-sm paper-card p-6 relative" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#FFFDF7" }}>
            <button className="absolute top-3 right-3 text-stone-400" onClick={() => setHelp(false)} aria-label="Close"><X size={18} /></button>
            <div className="flex items-center gap-3 mb-4">
              <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-xl" />
              <div className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Add Side-Quest to your Home Screen</div>
            </div>
            <IosSteps />
          </div>
        </div>
      )}
    </>
  );
}
