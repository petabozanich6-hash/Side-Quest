import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const TYPES = [
  { id: "copy", title: "Get a copy of my data", note: "A download of your account details, your children's profiles, learning progress and lesson activity." },
  { id: "correct", title: "Correct my data", note: "Tell us what is wrong and we will update it." },
  { id: "delete", title: "Delete my data", note: "Permanently removes your account and your children's data. This cannot be undone." },
];

const card = { border: "1px solid #D4C8A8" };

export default function RequestData() {
  const { user } = useAuth();
  const [type, setType] = useState("copy");
  const [email, setEmail] = useState(user?.email || "");
  const [details, setDetails] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});
  const [ref, setRef] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = "Enter a valid email address.";
    if (type === "correct" && !details.trim()) next.details = "Tell us what needs correcting.";
    if (!confirmed) next.confirmed = "Please confirm you are authorised to make this request.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setRef("DR-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    toast.success("Request received");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10" data-testid="request-data-page">
      <Link to="/parent/trust" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800" data-testid="request-data-back">
        <ArrowLeft size={14} /> Trust &amp; Support
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold" style={{ color: "#1F3B2D" }}>Request your data</h1>
      <p className="mt-2 text-stone-600">See the information we hold about your family, ask us to correct it, or ask us to remove it.</p>

      {ref ? (
        <div className="mt-8 rounded-2xl bg-white p-6" style={card} role="status" data-testid="request-data-done">
          <CheckCircle2 size={36} style={{ color: "#437A22" }} />
          <h2 className="mt-3 font-display text-xl font-bold" style={{ color: "#1F3B2D" }}>Your request is in</h2>
          <p className="mt-1 text-sm text-stone-600">We will email <strong>{email}</strong> to verify it is you before we begin.</p>
          <p className="mt-4 inline-block rounded-lg px-3 py-2 text-sm font-bold" style={{ background: "#F3EDDA", color: "#1F3B2D" }}>Reference: {ref}</p>
          <div className="mt-5">
            <Link to="/parent/trust" className="text-sm font-bold underline" style={{ color: "#1F3B2D" }}>Back to Trust &amp; Support</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 space-y-6" data-testid="request-data-form">
          <fieldset className="space-y-2">
            <legend className="text-sm font-bold mb-2" style={{ color: "#1F3B2D" }}>What would you like to do?</legend>
            {TYPES.map((t) => (
              <label key={t.id} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 cursor-pointer hover:shadow-sm transition"
                style={type === t.id ? { border: "1px solid #1F3B2D", boxShadow: "inset 0 0 0 1px #1F3B2D" } : card}>
                <input type="radio" name="type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)}
                  className="mt-1" data-testid={`request-type-${t.id}`} />
                <span>
                  <span className="block text-sm font-bold" style={{ color: t.id === "delete" ? "#9B2C2C" : "#1F3B2D" }}>{t.title}</span>
                  <span className="block text-xs text-stone-500">{t.note}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div>
            <label htmlFor="rd-email" className="block text-sm font-bold" style={{ color: "#1F3B2D" }}>Email on your account</label>
            <input id="rd-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
              className="mt-1 w-full rounded-xl bg-white px-3 py-2.5 text-sm" style={card} data-testid="request-email" />
            {errors.email && <p className="mt-1 text-xs font-bold" style={{ color: "#9B2C2C" }}>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="rd-details" className="block text-sm font-bold" style={{ color: "#1F3B2D" }}>
              Details {type !== "correct" && <span className="font-normal text-stone-500">(optional)</span>}
            </label>
            <textarea id="rd-details" rows={4} value={details} onChange={(e) => setDetails(e.target.value)}
              placeholder={type === "correct" ? "What is wrong, and what should it say?" : "Anything we should know?"}
              className="mt-1 w-full rounded-xl bg-white px-3 py-2.5 text-sm" style={card} data-testid="request-details" />
            {errors.details && <p className="mt-1 text-xs font-bold" style={{ color: "#9B2C2C" }}>{errors.details}</p>}
          </div>

          {type === "delete" && (
            <p className="rounded-xl px-4 py-3 text-xs text-stone-600" style={{ background: "#F3EDDA" }}>
              Deleting is permanent and includes your children's progress and any lessons created for your account. We will ask you to confirm by email first.
            </p>
          )}

          <label className="flex items-start gap-3 text-sm text-stone-600 cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" data-testid="request-confirm" />
            <span>I am the account holder, or a parent or guardian authorised to make this request.</span>
          </label>
          {errors.confirmed && <p className="-mt-4 text-xs font-bold" style={{ color: "#9B2C2C" }}>{errors.confirmed}</p>}

          <button type="submit" className="rounded-xl px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 transition"
            style={{ background: "#1F3B2D" }} data-testid="request-submit">
            Submit request
          </button>
        </form>
      )}
    </div>
  );
}
