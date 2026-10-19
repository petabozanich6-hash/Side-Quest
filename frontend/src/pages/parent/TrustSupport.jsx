import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ChevronRight, MessageSquare } from "lucide-react";
import { GROUPS, PAGES } from "../legal/legalContent";
import DeleteAccountDialog from "../../components/parent/DeleteAccountDialog";
import { useAuth } from "../../context/AuthContext";

export default function TrustSupport() {
  const [showDelete, setShowDelete] = useState(false);
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto px-6 py-10" data-testid="trust-support-hub">
      <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>Trust &amp; Support</h1>
      <p className="mt-2 text-stone-600">Clear answers about the free preview, membership, children's learning, privacy, and how to reach me.</p>
      <Link to="/parent/feedback" className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 hover:border-emerald-700" data-testid="trust-feedback-link"><MessageSquare size={21} className="shrink-0 text-emerald-800 mt-0.5"/><span><span className="block text-base font-bold text-emerald-950">Report a problem, share an idea or give feedback</span><span className="text-sm text-stone-700 block mt-1">Send a private message directly to Side-Quest HQ. I can reply in your feedback thread; an unread reply appears on your dashboard.</span></span><ChevronRight size={17} className="ml-auto text-emerald-800 shrink-0"/></Link>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link to="/parent/plan" className="rounded-2xl bg-white border p-4 hover:shadow-sm" style={{borderColor:"#D4C8A8"}}>
          <strong className="block text-emerald-950">Your preview and membership</strong>
          <span className="block text-sm text-stone-600 mt-1">See your expiry date, what's included and what stays accessible afterward.</span>
        </Link>
        <Link to="/parent/email-preferences" className="rounded-2xl bg-white border p-4 hover:shadow-sm" style={{borderColor:"#D4C8A8"}} data-testid="trust-email-preferences-link">
          <strong className="block text-emerald-950">Email preferences</strong>
          <span className="block text-sm text-stone-600 mt-1">Manage optional announcements and other email choices.</span>
        </Link>
        <Link to="/parent/homeschool-compass" className="rounded-2xl bg-white border p-4 hover:shadow-sm" style={{borderColor:"#D4C8A8"}}>
          <strong className="block text-emerald-950">Homeschooling Compass</strong>
          <span className="block text-sm text-stone-600 mt-1">Find registration guidance and official resources for your state or territory.</span>
        </Link>
      </div>
      <div className="mt-8 space-y-8">
        {GROUPS.map((g) => (
          <section key={g.id}>
            <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>{g.title}</h2>
            <p className="text-sm text-stone-500 mb-3">{g.blurb}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(PAGES).filter(([, p]) => p.group === g.id).map(([slug, p]) => (
                <Link key={slug} to={`/parent/trust/${slug}`} data-testid={`trust-link-${slug}`}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white hover:shadow-sm transition" style={{ border: "1px solid #D4C8A8" }}>
                  <span>
                    <span className="block text-sm font-bold" style={{ color: "#1F3B2D" }}>{p.title}</span>
                    <span className="block text-xs text-stone-500">{p.summary}</span>
                  </span>
                  <ChevronRight size={16} className="text-stone-400 shrink-0 ml-2" />
                </Link>
              ))}
              {g.id === "privacy" && (
                <button onClick={() => setShowDelete(true)} data-testid="trust-delete-account"
                  className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white text-left hover:shadow-sm transition" style={{ border: "1px solid #D4C8A8" }}>
                  <span>
                    <span className="block text-sm font-bold" style={{ color: "#9B2C2C" }}>Delete Account</span>
                    <span className="block text-xs text-stone-500">Permanently remove your account and your children's data.</span>
                  </span>
                  <Trash2 size={16} style={{ color: "#9B2C2C" }} className="shrink-0 ml-2" />
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
      <section className="mt-10" data-testid="your-account">
        <h2 className="font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Your account</h2>
        <p className="text-sm text-stone-500 mb-2">Support may ask for this id. It is not a password and is safe to share with Side-Quest support.</p>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-4 py-3" style={{ border: "1px solid #D4C8A8" }}>
          <span className="text-sm text-stone-600">Account ID</span>
          <code className="text-sm break-all" data-testid="account-id">{user?.id}</code>
          <button type="button" className="text-xs font-semibold underline" style={{ color: "#4A5D3A" }}
            onClick={() => navigator.clipboard?.writeText(user?.id || "").catch(() => {})}>Copy</button>
        </div>
      </section>
      {showDelete && <DeleteAccountDialog onClose={() => setShowDelete(false)} />}
    </div>
  );
}
