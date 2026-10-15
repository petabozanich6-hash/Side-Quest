import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import { Check, Copy, Download } from "lucide-react";
import { deviceKind, isKidsDevice, isKidsHost, kidsOrigin, parentOrigin, separateKidsApp, setKidsDevice, useInstallPrompt, useKidsManifest } from "../lib/pwa";
import { AndroidSteps, IosSteps } from "../components/shared/InstallApp";

const GREEN = "#1F3B2D";

/**
 * Public "Get the app" page (/get-app). Side-Quest is an installable web app (PWA): no app store needed.
 * - Phone or tablet: the right install steps for that device (or the browser's own Install button).
 * - Computer: a QR code that opens this same page on the phone, plus a link to copy or send.
 * - ?for=child: the kids' app for a child's own device, which opens straight to the child sign-in.
 *   When the kids' address (kids.sidequestlearning.app) is live, SQ Kids is installed from there, so it is a fully
 *   separate app (own icon, own sign-in) that can sit next to the parent app on one phone.
 */
export default function GetApp() {
  const [params] = useSearchParams();
  const onKidsHost = isKidsHost();
  const kids = params.get("for") === "child" || onKidsHost;
  useKidsManifest(kids);
  // SQ Kids has its own address here: the kids' setup always sends families there.
  const kidsLive = kids && separateKidsApp();
  // SQ Kids as its own app: installed from the kids' address.
  const separate = onKidsHost || kidsLive;
  const prompt = useInstallPrompt();
  // On the parent site the browser's one-tap install prompt is for the parent app, so the kids' app uses the menu steps.
  const canInstall = prompt.canInstall && (!kids || onKidsHost);
  const { install, installed } = prompt;
  const [kind] = useState(deviceKind);
  const [qr, setQr] = useState("");
  const navigate = useNavigate();
  const [kidsDevice, setKidsDeviceState] = useState(isKidsDevice);
  const [copied, setCopied] = useState(false);
  const link = kids && kidsLive ? `${kidsOrigin()}/get-app`
    : onKidsHost ? `${window.location.origin}/get-app`
    : `${window.location.origin}/get-app${kids ? "?for=child" : ""}`;

  useEffect(() => {
    if (kind !== "desktop") return;
    QRCode.toDataURL(`${link}${link.includes("?") ? "&" : "?"}source=qr`, { width: 480, margin: 1, errorCorrectionLevel: "M", color: { dark: GREEN, light: "#FFFFFF" } })
      .then(setQr).catch(() => setQr(""));
  }, [kind, link, kids]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* the link is shown to copy by hand */ }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12" style={{ backgroundColor: "#F5EFE0" }} data-testid="get-app-page">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <img src="/icons/icon-192.png" alt="" className="h-14 w-14 rounded-2xl shadow-sm" />
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: GREEN }} data-testid="get-app-title">{separate ? "Set up SQ Kids on your child's device" : kids ? "Set up Side-Quest on your child's device" : "Get the Side-Quest app"}</h1>
            <p className="text-sm text-stone-600">{separate
              ? "SQ Kids is a separate app just for children, with its own icon and their own sign-in (username and PIN). Grown-ups keep the Side-Quest app, even on the same phone."
              : kids && installed
              ? "Your child can use the Side-Quest app that's already here."
              : kids
              ? "Install this on your child's phone or tablet. The app (\"SQ Kids\") opens straight to their own sign-in with their username and PIN, so they never see the parent pages."
              : "Free to install. No app store needed: it adds itself to your home screen and opens full screen, like any other app."}</p>
          </div>
        </div>

        {installed && onKidsHost ? (
          <div className="paper-card p-5" data-testid="get-app-installed">
            <p className="font-semibold" style={{ color: GREEN }}>SQ Kids is already installed on this device.</p>
            <Link to="/child-login" className="mt-3 inline-block text-sm font-semibold underline" style={{ color: "#4A5D3A" }}>Go to sign-in</Link>
          </div>
        ) : kids && kidsLive && kind !== "desktop" ? (
          // On the parent site (browser or the parent app) on a phone: SQ Kids is installed from its own address.
          <section className="paper-card p-5 sm:p-6 space-y-3" data-testid="get-app-open-kids">
            <h2 className="font-display text-xl font-bold" style={{ color: GREEN }}>Install SQ Kids</h2>
            <p className="text-sm text-stone-700">Tap below. It opens the SQ Kids page{installed ? " in your browser" : ""}, with the steps to add it to this {kind === "ios" ? "iPhone or iPad" : "device"}.</p>
            <a href={link} target={installed ? "_blank" : undefined} rel="noopener" className="block w-full text-center rounded-xl px-4 py-3 font-semibold text-white" style={{ backgroundColor: "#4A5D3A" }} data-testid="open-kids-setup">Open SQ Kids setup</a>
          </section>
        ) : installed && kids ? (
          // Opened inside the Side-Quest app already on this device (common on Android, where links open the installed
          // app): one device shared by parent and child doesn't need a second app; this one can open to the child sign-in.
          <section className="paper-card p-5 sm:p-6 space-y-3" data-testid="get-app-shared-device">
            <h2 className="font-display text-xl font-bold" style={{ color: GREEN }}>Side-Quest is already on this device</h2>
            <p className="text-sm text-stone-700">If your child uses this device, you don't need a second app. Make this one open to <strong>your child's sign-in</strong> (username and PIN) instead of the front page.</p>
            <p className="text-sm text-stone-700">You can still sign in as the parent: tap <strong>"Are you a parent? Sign in here"</strong> at the bottom of the child sign-in.</p>
            <button type="button" onClick={() => { setKidsDevice(true); navigate("/child-login", { replace: true }); }} className="w-full rounded-xl px-4 py-3 font-semibold text-white" style={{ backgroundColor: "#4A5D3A" }} data-testid="use-for-child">
              Open to my child's sign-in on this device
            </button>
            <p className="text-xs text-stone-500">Want a separate "SQ Kids" icon instead? Copy this link and open it in Safari or Chrome (not in the app), then follow the steps: <code className="break-all">{link}</code> <button type="button" onClick={copy} className="underline font-semibold">{copied ? "Copied" : "Copy"}</button></p>
          </section>
        ) : installed ? (
          <div className="paper-card p-5 space-y-3" data-testid="get-app-installed">
            <p className="font-semibold" style={{ color: GREEN }}>You're already using the Side-Quest app on this device.</p>
            {kidsDevice ? (
              <>
                <p className="text-sm text-stone-700" data-testid="kids-device-on">On this device the app opens to the child sign-in.</p>
                <button type="button" onClick={() => { setKidsDevice(false); setKidsDeviceState(false); }} className="rounded-xl px-4 py-2 text-sm font-semibold border bg-white" style={{ color: GREEN, borderColor: "#D4C8A8" }} data-testid="use-for-parent">
                  Open to the front page again
                </button>
              </>
            ) : (
              <p className="text-sm text-stone-700">Does your child use this device too? <Link to="/get-app?for=child" className="font-semibold underline" style={{ color: "#4A5D3A" }}>Make it open to their sign-in</Link>.</p>
            )}
            <Link to="/" className="inline-block text-sm font-semibold underline" style={{ color: "#4A5D3A" }}>Open Side-Quest</Link>
          </div>
        ) : kind === "desktop" ? (
          <>
            <section className="paper-card p-5 sm:p-6 text-center" data-testid="get-app-qr">
              <h2 className="font-display text-xl font-bold" style={{ color: GREEN }}>{kids ? "Scan with your child's device" : "Scan with your phone's camera"}</h2>
              <p className="text-sm text-stone-600 mt-1">Point the {kids ? "child's iPhone, iPad or Android" : "iPhone or Android"} camera at the code, tap the link that appears, then follow the steps on that device.</p>
              {qr
                ? <img src={qr} alt={`QR code that opens ${link} on your phone`} className="mx-auto mt-4 w-56 h-56 sm:w-64 sm:h-64 rounded-xl bg-white p-2" data-testid="get-app-qr-image" />
                : <div className="mx-auto mt-4 w-56 h-56 rounded-xl bg-white/60" aria-hidden="true" />}
              <p className="mt-4 text-sm text-stone-600">Or open this link on {kids ? "their device" : "your phone"}:</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <code className="rounded-lg bg-white px-3 py-1.5 text-sm break-all" data-testid="get-app-url">{link}</code>
                <button type="button" onClick={copy} className="rounded-lg px-3 py-1.5 text-sm font-semibold border bg-white" style={{ color: GREEN, borderColor: "#D4C8A8" }}>
                  {copied ? <><Check size={14} className="inline -mt-0.5" /> Copied</> : <><Copy size={14} className="inline -mt-0.5" /> Copy link</>}
                </button>
              </div>
            </section>
            {canInstall && !kids && (
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
                <h2 className="font-display text-xl font-bold mb-4" style={{ color: GREEN }}>{kind === "ios" ? "Add to the Home Screen" : "Install on this device"}</h2>
                {kind === "ios" ? <IosSteps app={separate ? "SQ Kids" : "Side-Quest"} /> : <AndroidSteps app={separate ? "SQ Kids" : "Side-Quest"} />}
              </>
            )}
          </section>
        )}

        {kids && !installed && (
          <p className="paper-card p-4 text-sm text-stone-700" data-testid="get-app-kids-note">
            After installing, open <strong>SQ Kids</strong> from the home screen and sign your child in once. Their quests are then saved for offline use too.
          </p>
        )}
        <p className="text-center text-sm">
          {kids
            ? onKidsHost
              ? <a href={`${parentOrigin()}/get-app`} className="font-semibold underline" style={{ color: "#4A5D3A" }} data-testid="get-app-switch">Grown-ups: get the Side-Quest app instead</a>
              : <Link to="/get-app" className="font-semibold underline" style={{ color: "#4A5D3A" }} data-testid="get-app-switch">Installing on your own phone instead?</Link>
            : <Link to="/get-app?for=child" className="font-semibold underline" style={{ color: "#4A5D3A" }} data-testid="get-app-switch">Setting up your child's own device? Get the kids' version</Link>}
        </p>

        <details className="paper-card p-5">
          <summary className="cursor-pointer font-semibold" style={{ color: GREEN }}>Steps for other devices</summary>
          <h3 className="mt-4 mb-2 text-sm font-bold" style={{ color: GREEN }}>iPhone and iPad</h3>
          <IosSteps app={separate ? "SQ Kids" : "Side-Quest"} />
          <h3 className="mt-5 mb-2 text-sm font-bold" style={{ color: GREEN }}>Android</h3>
          <AndroidSteps app={separate ? "SQ Kids" : "Side-Quest"} />
          <h3 className="mt-5 mb-2 text-sm font-bold" style={{ color: GREEN }}>Computer</h3>
          <p className="text-sm text-stone-700">In Chrome or Edge, click the install icon at the right of the address bar. Other browsers work fine as a normal website.</p>
        </details>

        <p className="text-center text-sm">
          <Link to={onKidsHost ? "/child-login" : "/"} className="font-semibold underline" style={{ color: "#4A5D3A" }}>{onKidsHost ? "Back to sign-in" : "Back to Side-Quest"}</Link>
        </p>
      </div>
    </div>
  );
}
