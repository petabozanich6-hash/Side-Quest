import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ChevronRight } from "lucide-react";
import { GROUPS, PAGES } from "../legal/legalContent";
import DeleteAccountDialog from "../../components/parent/DeleteAccountDialog";

export default function TrustSupport() {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-6 py-10" data-testid="trust-support-hub">
      <h1 className="font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>Trust &amp; Support</h1>
      <p className="mt-2 text-stone-600">Policies, help and the tools to manage your family's information.</p>
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
      {showDelete && <DeleteAccountDialog onClose={() => setShowDelete(false)} />}
    </div>
  );
}
