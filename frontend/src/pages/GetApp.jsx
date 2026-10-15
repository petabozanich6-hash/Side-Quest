import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { Check, Copy, Download } from "lucide-react";
import { deviceKind, useInstallPrompt } from "../lib/pwa";
import { AndroidSteps, IosSteps } from "../components/shared/InstallApp";

const GREEN = "#1F3B2D";

/**
 * Public "Get the app" page (/get-app). Side-Quest is an installable web app (PWA): no app store needed.
 * - Phone or tablet: the right install steps for that device (or the browser's own Install button).
 * - Computer: a QR code that opens this same page on the phone, plus a link to copy or send.
 */
export default function GetApp() {
  const { canInstall, install, installed } = useInstallPrompt();
  const [kind] = useState(deviceKind);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/get-app`;

  useEffect(() => {
    if (kind !== "desktop") return;
    QRCode.toDataURL(`${link}?source=qr`, { width: 480, margin: 1, errorCorrectionLevel: "M", color: { dark: GREEN, light: "#FFFFFF" } })
      .then(setQr).catch(() => setQr(""));
  }, [kind, link]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* the link is shown to copy by hand */ }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12" style={{ backgroundColor: "#F5EFE0" }} data-testid="get-app-page">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <img src="/icons/icon-192.png" alt="" className="h-14 w-14 rounded-2xl shadow-sm" />
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: GREEN }}>Get the Side-Quest app</h1>
            <p className="text-sm text-stone-600">Free to install. No app store needed: it adds itself to your home screen and opens full screen, like any other app.</p>
          </div>
        </div>

        {installed ? (
          <div className="paper-card p-5" data-testid="get-app-installed">
            <p className="font-semibold" style={{ color: GREEN }}>You're already using the Side-Quest app on this device.</p>
            <Link to="/" className="mt-3 inline-block text-sm font-semibold underline" style={{ color: "#4A5D3A" }}>Open Side-Quest</Link>
          </div>
        ) : kind === "desktop" ? (
          <>
            <section className="paper-card p-5 sm:p-6 text-center" data-testid="get-app-qr">
              <h2 className="font-display text-xl font-bold" style={{ color: GREEN }}>Scan with your phone's camera</h2>
              <p className="text-sm text-stone-600 mt-1">Point your iPhone or Android camera at the code, tap the link that appears, then follow the steps on your phone.</p>
              {qr
                ? <img src={qr} alt={`QR code that opens ${link} on your phone`} className="mx-auto mt-4 w-56 h-56 sm:w-64 sm:h-64 rounded-xl bg-white p-2" data-testid="get-app-qr-image" />
                : <div className="mx-auto mt-4 w-56 h-56 rounded-xl bg-white/60" aria-hidden="true" />}
              <p className="mt-4 text-sm text-stone-600">Or open this link on your phone:</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <code className="rounded-lg bg-white px-3 py-1.5 text-sm break-all" data-testid="get-app-url">{link}</code>
                <button type="button" onClick={copy} className="rounded-lg px-3 py-1.5 text-sm font-semibold border bg-white" style={{ color: GREEN, borderColor: "#D4C8A8" }}>
                  {copied ? <><Check size={14} className="inline -mt-0.5" /> Copied</> : <><Copy size={14} className="inline -mt-0.5" /> Copy link</>}
                </button>
              </div>
            </section>
            {canInstall && (
              <section className="paper-card p-5">
                <h2 className="font-display text-lg font-bold" style={{ color: GREEN }}>On this computer</h2>
                <p className="text-sm text-stone-600 mt-1">You can also install Side-Quest here, so it opens in its own window.</p>
                <button type="button" onClick={install} className="mt-3 rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "#4A5D3A" }} data-testid="install-app">
                  <Download size={14} className="inline -mt-0.5" /> Install on this computer
                </button>
              </section>
            )}
          </>
        ) : (
          <section className="paper-card p-5 sm:p-6" data-testid={`get-app-${kind}`}>
            {canInstall ? (
              <>
                <h2 className="font-display text-xl font-bold" style={{ color: GREEN }}>Install on this phone</h2>
                <button type="button" onClick={install} className="mt-4 w-full rounded-xl px-4 py-3 font-semibold text-white" style={{ backgroundColor: "#4A5D3A" }} data-testid="install-app">
                  <Download size={16} className="inline -mt-0.5" /> Install Side-Quest
                </button>
              </>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold mb-4" style={{ color: GREEN }}>{kind === "ios" ? "Add to your Home Screen" : "Install on this phone"}</h2>
                {kind === "ios" ? <IosSteps /> : <AndroidSteps />}
              </>
            )}
          </section>
        )}

        <details className="paper-card p-5">
          <summary className="cursor-pointer font-semibold" style={{ color: GREEN }}>Steps for other devices</summary>
          <h3 className="mt-4 mb-2 text-sm font-bold" style={{ color: GREEN }}>iPhone and iPad</h3>
          <IosSteps />
          <h3 className="mt-5 mb-2 text-sm font-bold" style={{ color: GREEN }}>Android</h3>
          <AndroidSteps />
          <h3 className="mt-5 mb-2 text-sm font-bold" style={{ color: GREEN }}>Computer</h3>
          <p className="text-sm text-stone-700">In Chrome or Edge, click the install icon at the right of the address bar. Other browsers work fine as a normal website.</p>
        </details>

        <p className="text-center text-sm">
          <Link to="/" className="font-semibold underline" style={{ color: "#4A5D3A" }}>Back to Side-Quest</Link>
        </p>
      </div>
    </div>
  );
}
