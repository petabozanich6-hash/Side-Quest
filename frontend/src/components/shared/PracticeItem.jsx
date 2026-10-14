import React, { useState } from "react";
import { api } from "../../lib/api";

const border = { borderColor: "#D4C8A8" };
const area = "w-full rounded-lg border px-3 py-2 text-base bg-white";

// One question the child answers on screen. Used for guided practice and activity tasks.
// Answers live in the parent's state (so they autosave); feedback comes from the server, which holds the answers.
// `value` is a string (text/number/choice/blank joined by "|") or an array (order/match).
// `state` = { fb, attempts } where fb = { result, feedback, reveal }.
export default function PracticeItem({ item, part, i, j, value, onChange, state, onState, assignmentId, locked, preview, label, testid }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [hint, setHint] = useState(false);
  const kind = item.kind || "text";
  const fb = state?.fb;
  const attempts = state?.attempts || 0;
  const done = fb && (fb.result === "correct" || fb.result === "recorded" || fb.reveal);
  const empty = Array.isArray(value) ? value.length === 0 : !String(value || "").trim();

  const check = async (reveal) => {
    if (preview) { onState({ fb: { result: "recorded", feedback: "Preview: your child gets instant feedback here." }, attempts: attempts + 1 }); return; }
    setBusy(true); setErr("");
    try {
      const attempt = attempts + 1;
      const { data } = await api.post(`/assignments/${assignmentId}/practice-check`, { part, i, j, answer: value ?? "", reveal: !!reveal, attempt });
      onState({ fb: data, attempts: attempt });
    } catch (e) { setErr(e.response?.data?.detail || "Could not check that just now. Your answer is still saved."); }
    finally { setBusy(false); }
  };

  const off = locked || fb?.result === "correct";
  let input;
  if (kind === "choice") {
    input = (
      <div className="space-y-2" role="radiogroup" aria-label={item.prompt}>
        {(item.options || []).map((o, k) => (
          <label key={k} className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-white cursor-pointer" style={border}>
            <input type="radio" name={`${testid}`} disabled={off} checked={value === o} onChange={() => onChange(o)} data-testid={`${testid}-opt-${k}`} /> <span>{o}</span>
          </label>
        ))}
      </div>
    );
  } else if (kind === "blank") {
    const parts = String(item.prompt).split(/_{2,}|\[\s*blank\s*\]/i);
    const vals = String(value || "").split("|");
    const n = Math.max(1, parts.length - 1);
    const set = (k, v) => { const a = Array.from({ length: n }, (_, x) => vals[x] || ""); a[k] = v; onChange(a.join("|")); };
    input = parts.length > 1 ? (
      <p className="text-base leading-loose">
        {parts.map((p, k) => (
          <React.Fragment key={k}>{p}{k < parts.length - 1 && <input aria-label={`blank ${k + 1}`} disabled={off} value={vals[k] || ""} onChange={(e) => set(k, e.target.value)} className="mx-1 w-28 border-b-2 bg-transparent text-center" style={{ borderColor: "#1F3B2D" }} data-testid={`${testid}-blank-${k}`} />}</React.Fragment>
        ))}
      </p>
    ) : <input aria-label="answer" disabled={off} value={value || ""} onChange={(e) => onChange(e.target.value)} className={area} style={border} data-testid={`${testid}-input`} />;
  } else if (kind === "order") {
    const opts = item.options || [];
    const cur = Array.isArray(value) && value.length === opts.length ? value : opts;
    const move = (k, d) => { const a = [...cur]; const t = a[k]; a[k] = a[k + d]; a[k + d] = t; onChange(a); };
    input = (
      <ol className="space-y-2" data-testid={`${testid}-order`}>
        {cur.map((o, k) => (
          <li key={o + k} className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-white" style={border}>
            <span className="font-bold w-5">{k + 1}.</span><span className="flex-1">{o}</span>
            <button type="button" disabled={off || k === 0} onClick={() => move(k, -1)} aria-label={`Move ${o} up`} className="px-2 font-bold disabled:opacity-30" data-testid={`${testid}-up-${k}`}>↑</button>
            <button type="button" disabled={off || k === cur.length - 1} onClick={() => move(k, 1)} aria-label={`Move ${o} down`} className="px-2 font-bold disabled:opacity-30" data-testid={`${testid}-down-${k}`}>↓</button>
          </li>
        ))}
      </ol>
    );
    if (!Array.isArray(value) || value.length !== opts.length) { /* default order counts as an answer once checked */ }
  } else if (kind === "match") {
    const lefts = item.lefts || [];
    const got = Array.isArray(value) ? value : [];
    input = (
      <div className="space-y-2">
        {lefts.map((lf, k) => (
          <div key={k} className="flex flex-wrap items-center gap-2">
            <span className="font-bold min-w-[8rem]">{lf}</span>
            <select aria-label={`Match ${lf}`} disabled={off} value={got[k] || ""} onChange={(e) => { const a = lefts.map((_, x) => got[x] || ""); a[k] = e.target.value; onChange(a); }} className="rounded-lg border px-2 py-2 bg-white" style={border} data-testid={`${testid}-match-${k}`}>
              <option value="">Choose…</option>
              {(item.rights || []).map((r, x) => <option key={x} value={r}>{r}</option>)}
            </select>
          </div>
        ))}
      </div>
    );
  } else if (kind === "long") {
    input = <textarea aria-label="answer" rows={5} disabled={locked} value={value || ""} onChange={(e) => onChange(e.target.value)} className={area} style={border} placeholder="Write your answer here" data-testid={`${testid}-input`} />;
  } else {
    input = <input aria-label="answer" disabled={off} value={value || ""} onChange={(e) => onChange(e.target.value)} className={area} style={border} placeholder={kind === "number" ? "Type your answer" : "Type or show your working"} data-testid={`${testid}-input`} />;
  }

  const canCheck = kind === "order" ? true : !empty;
  return (
    <div className="rounded-xl border p-3 bg-white space-y-2" style={border} data-testid={testid}>
      {kind !== "blank" && <p className="font-bold">{label} {item.prompt}</p>}
      {kind === "blank" && <p className="font-bold text-sm text-stone-600">{label} Fill in the blank{String(item.prompt).split(/_{2,}/).length > 2 ? "s" : ""}:</p>}
      {input}
      {!locked && (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" disabled={busy || !canCheck || fb?.result === "correct"} onClick={() => check(false)} className="rounded-full px-4 py-1.5 text-sm font-bold disabled:opacity-40" style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }} data-testid={`${testid}-check`}>{busy ? "Checking…" : kind === "long" ? "Save and compare" : "Check my answer"}</button>
          {item.hint && !hint && fb?.result !== "correct" && <button type="button" onClick={() => setHint(true)} className="text-sm font-bold underline" style={{ color: "#4A5D3A" }} data-testid={`${testid}-hint`}>Need a hint?</button>}
          {!done && attempts > 0 && kind !== "long" && <button type="button" onClick={() => check(true)} className="text-sm underline text-stone-600" data-testid={`${testid}-show`}>Show me the answer</button>}
        </div>
      )}
      {hint && item.hint && <p className="text-sm text-stone-700" data-testid={`${testid}-hinttext`}>💡 {item.hint}</p>}
      {err && <p className="text-sm text-rose-800" role="alert">{err}</p>}
      {fb && (
        <div className={`rounded-lg px-3 py-2 text-sm ${fb.result === "correct" ? "bg-emerald-50 text-emerald-900" : fb.result === "incorrect" ? "bg-amber-50 text-amber-900" : "bg-sky-50 text-sky-900"}`} role="status" data-testid={`${testid}-feedback`}>
          <p>{fb.feedback}</p>
          {fb.reveal && <p className="mt-1 whitespace-pre-wrap"><b>{fb.result === "recorded" ? "A model answer:" : "The answer:"}</b> {fb.reveal}</p>}
        </div>
      )}
    </div>
  );
}
