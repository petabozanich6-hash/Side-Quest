import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../lib/api";

// Lost the download link: we email fresh private links for every book bought with that address.
export default function ShopDownloads() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const send = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg("");
    try {
      const r = await fetch(`${API}/shop/resend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
      const j = await r.json().catch(() => ({}));
      setMsg(j.detail || "Done.");
    } catch { setMsg("Couldn't send just now. Please try again."); }
    finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen bg-[#F5EFE0] px-5 py-12">
      <form onSubmit={send} className="mx-auto max-w-md paper-card p-6 space-y-4">
        <Link to="/" className="text-sm font-semibold underline">← Side-Quest</Link>
        <h1 className="font-display text-2xl font-bold" style={{ color: "#1F3B2D" }}>Get my downloads</h1>
        <p className="text-sm text-stone-700">Enter the email you used when buying. We'll send you fresh download links.</p>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-stone-300 px-3 py-2" placeholder="you@example.com" />
        <button type="submit" disabled={busy} className="rounded-xl px-5 py-2.5 font-bold text-white disabled:opacity-60" style={{ backgroundColor: "#1F3B2D" }}>{busy ? "Sending…" : "Email my links"}</button>
        {msg && <p className="text-sm text-stone-700" role="status">{msg}</p>}
      </form>
    </div>
  );
}
