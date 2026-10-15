// Installable app (PWA) support: registers the service worker and tracks whether the app can be installed.
import { useEffect, useState } from "react";

let deferred = null;                 // the browser's saved install prompt (Chrome, Edge, Samsung Internet, Android)
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

export const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

export const isIos = () =>
  typeof navigator !== "undefined" &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export const isAndroid = () => typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);
/** iPhone/iPad browsers other than Safari (Chrome, Firefox, Edge on iOS), where Add to Home Screen may be missing. */
export const isIosOtherBrowser = () => isIos() && /CriOS|FxiOS|EdgiOS|OPiOS/i.test(navigator.userAgent);
/** "ios" | "android" | "desktop": which install steps to show. */
export const deviceKind = () => (isIos() ? "ios" : isAndroid() ? "android" : "desktop");

// ---------------------------------------------------------------- kids' app
// A second installable app for a child's own device ("Side-Quest Kids", manifest-kids.webmanifest). It opens straight
// to the child sign-in, and signing out returns there. The device remembers it is a kids' device once the app has been
// opened from its icon (start_url carries ?source=kids-app). Installed iPhone apps keep their own storage, so the flag
// is set inside the installed app itself.
const KIDS_FLAG = "sq_kids_device";

// The kids' app has its own address (kids.sidequestlearning.app; kids.localhost when testing). A separate address makes
// it a truly separate app on the device: its own icon, its own sign-in and its own saved lessons, so a parent signed in
// to Side-Quest and a child signed in to SQ Kids can share one phone. Same Worker, same API, same database.
export const isKidsHost = () => typeof window !== "undefined" && /^kids\./i.test(window.location.hostname);
const PARENT_HOSTS = ["sidequestlearning.app", "www.sidequestlearning.app"];
/** The kids' app address for this site, or null where there is none (staging, previews). */
export function kidsOrigin() {
  if (typeof window === "undefined") return null;
  const { protocol, hostname, port } = window.location;
  if (isKidsHost()) return window.location.origin;
  if (PARENT_HOSTS.includes(hostname)) return "https://kids.sidequestlearning.app";
  if (hostname === "localhost") return `${protocol}//kids.localhost${port ? ":" + port : ""}`;
  return null;
}
/** The parent site's address, for links out of the kids' app. */
export function parentOrigin() {
  if (typeof window === "undefined") return "";
  if (!isKidsHost()) return window.location.origin;
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname.replace(/^kids\./i, "")}${port ? ":" + port : ""}`;
}
/** True when the kids' address is set up and answering (so links can send families there). */
let kidsLive = null;
export function kidsHostReachable() {
  const origin = kidsOrigin();
  if (!origin || isKidsHost()) return Promise.resolve(false);
  if (!kidsLive) {
    kidsLive = Promise.race([
      fetch(`${origin}/api/health`, { mode: "cors", cache: "no-store" }).then((r) => r.ok).catch(() => false),
      new Promise((resolve) => setTimeout(() => resolve(false), 4000)),
    ]);
  }
  return kidsLive;
}
/** On the kids' address, the page installs the kids' app (before React starts). */
export function applyKidsHostManifest() {
  if (!isKidsHost()) return;
  document.querySelector('link[rel="manifest"]')?.setAttribute("href", "/manifest-kids.webmanifest");
  document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute("content", "SQ Kids");
  document.title = "SQ Kids | Side-Quest Learning";
}
export function rememberKidsDevice() {
  try {
    const p = new URLSearchParams(window.location.search);
    if (p.get("source") === "kids-app") localStorage.setItem(KIDS_FLAG, "1");
  } catch { /* storage blocked */ }
}
/** One device shared by parent and child: make this app open to the child sign-in (or back to the front page). */
export function setKidsDevice(on) { try { if (on) localStorage.setItem(KIDS_FLAG, "1"); else localStorage.removeItem(KIDS_FLAG); } catch { /* storage blocked */ } }
export const isKidsDevice = () => { if (isKidsHost()) return true; try { return localStorage.getItem(KIDS_FLAG) === "1"; } catch { return false; } };

/** Points the page's manifest at the kids' app while `kids` is true, so installing from here gives the kids' app. */
export function useKidsManifest(kids) {
  useEffect(() => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link || !kids || isKidsHost()) return undefined;
    const before = link.getAttribute("href");
    link.setAttribute("href", "/manifest-kids.webmanifest");
    const title = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    const beforeTitle = title?.getAttribute("content");
    title?.setAttribute("content", "SQ Kids");
    return () => { link.setAttribute("href", before); if (title && beforeTitle) title.setAttribute("content", beforeTitle); };
  }, [kids]);
}

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; notify(); });
  window.addEventListener("appinstalled", () => { deferred = null; notify(); });
  // Only in production builds: the dev server must never be served from a cache.
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      // Check for a newer version whenever the app comes back to the foreground.
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") reg.update().catch(() => {}); });
    }).catch(() => { /* the site works without it */ });
  });
}

/** { canInstall, ios, installed, install() } for an "Install the app" button. */
export function useInstallPrompt() {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn = () => tick((n) => n + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  const installed = isStandalone();
  return {
    installed,
    canInstall: !installed && !!deferred,
    ios: !installed && isIos(),
    install: async () => {
      if (!deferred) return false;
      deferred.prompt();
      const choice = await deferred.userChoice.catch(() => null);
      deferred = null;
      notify();
      return choice?.outcome === "accepted";
    },
  };
}
