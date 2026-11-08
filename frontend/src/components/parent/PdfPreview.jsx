import React, { useEffect, useState } from "react";
import { Download, Loader2, X } from "lucide-react";
import { api } from "../../lib/api";
import { pdfPageImages } from "../../lib/pdfPages";

/** Shows a PDF's pages inside the page (no download needed), with a Download button. */
export default function PdfPreview({ title, fetchPath, downloadHref, onClose }) {
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let alive = true, made = [];
    (async () => {
      try {
        const r = await api.get(fetchPath, { responseType: "blob", timeout: 180000 });
        const out = await pdfPageImages(new Blob([r.data], { type: "application/pdf" }), { onPage: (p) => { made = p; if (alive) setPages(p); } });
        made = out.pages;
        if (alive) { setPages(out.pages); setDone(true); }
      } catch {
        if (alive) setError("The preview couldn't be opened. You can still download it.");
      }
    })();
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { alive = false; window.removeEventListener("keydown", esc); made.forEach((u) => URL.revokeObjectURL(u)); };
  }, [fetchPath]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex flex-col" role="dialog" aria-modal="true" aria-label={title} data-testid="pdf-preview">
      <div className="flex items-center gap-3 bg-white px-4 py-3 shadow">
        <h2 className="font-display font-bold text-slate-900 truncate flex-1">{title}</h2>
        <a href={downloadHref} download className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-900 text-white px-3 py-2 text-sm font-bold"><Download size={15} /> Download</a>
        <button type="button" onClick={onClose} aria-label="Close preview" className="rounded-lg p-2 hover:bg-stone-100"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {pages.map((u, i) => <img key={u} src={u} alt={`Page ${i + 1}`} className="w-full rounded-lg shadow-lg bg-white" />)}
          {!done && !error && <p className="text-center text-white/90 text-sm flex items-center justify-center gap-2 py-6" role="status"><Loader2 size={16} className="animate-spin" /> Loading pages…</p>}
          {error && <p className="text-center text-white bg-black/40 rounded-lg p-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
