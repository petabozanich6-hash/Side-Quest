import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

const PRESETS = ["Mum", "Dad", "Aunty", "Uncle", "Nan", "Pop", "Grandma", "Grandpa"];

export default function ParentLabel() {
  const [label, setLabel] = useState("");
  const [saved, setSaved] = useState("");
  const [custom, setCustom] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/me/child-label")
      .then(r => {
        const v = r.data?.label || "";
        setLabel(v);
        setSaved(v);
        setCustom(!!v && !PRESETS.includes(v));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  const onSelect = (v) => {
    setStatus("");
    if (v === "__other") { setCustom(true); setLabel(""); }
    else { setCustom(false); setLabel(v); }
  };

  const save = () => {
    const next = label.trim();
    setStatus("");
    api.put("/me/child-label", { label: next })
      .then(() => { setSaved(next); setLabel(next); setStatus("Saved"); })
      .catch(() => setStatus("Couldn't save"));
  };

  const missing = !saved;
  return (
    <div className="mx-3 mb-2 rounded-xl p-3 relative z-10" style={{backgroundColor: missing ? "#FEF3C7" : "rgba(255,255,255,0.7)", border: missing ? "1px solid #C77B5B" : "1px solid #D4C8A8"}} data-testid="parent-label">
      <div className="text-[11px] font-bold" style={{color:"#1F3B2D"}}>{missing ? "What do your children call you?" : "Your children call you"}</div>
      <select value={custom ? "__other" : label} onChange={e => onSelect(e.target.value)} className="mt-1.5 w-full rounded-lg border px-2 py-1.5 text-xs bg-white" style={{borderColor:"#D4C8A8"}} data-testid="parent-label-select">
        <option value="">Choose...</option>
        {PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
        <option value="__other">Something else...</option>
      </select>
      {custom && <input value={label} onChange={e => { setLabel(e.target.value); setStatus(""); }} maxLength={30} placeholder="e.g. Mama" className="mt-1.5 w-full rounded-lg border px-2 py-1.5 text-xs" style={{borderColor:"#D4C8A8"}} data-testid="parent-label-input" />}
      <div className="mt-1.5 flex items-center gap-2">
        <button onClick={save} disabled={label.trim() === saved} className="rounded-full px-3 py-1 text-[11px] font-bold disabled:opacity-40" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="parent-label-save">Save</button>
        {status && <span className="text-[11px] font-semibold" style={{color: status === "Saved" ? "#4A5D3A" : "#9B2C2C"}}>{status}</span>}
      </div>
    </div>
  );
}
