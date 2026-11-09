import React, { useEffect, useState } from "react";
import { adminApi, errorText } from "../../../lib/adminApi";

const input = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm";
const description = (jur) => `An independent, fillable home education planning template for ${jur.name}. Organise your family's learning goals, learning areas, resources, teaching approach, evidence and progress records using the current published guidance as a starting point. Designed for you to complete with your own information. Not a government form, official endorsement or guarantee of registration. Check the linked authority guidance before submission.`;
const titleFor = (jur) => `Home Education Planning Template – ${jur.name} (Fillable PDF)`;
const guidedTitleFor = (jur) => `Guided Home Education Plan – ${jur.name}`;
const fileData = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error("The PDF could not be read."));
  reader.readAsDataURL(file);
});

/**
 * Creates draft-only digital shop products using Side-Quest's existing owner API.
 * PDF upload also uses the existing private R2 digital-product storage; paid-order
 * downloads are already gated by a verified Square webhook and private order link.
 * No new document checkout path, unverified entitlement, or Workers AI invocation.
 */
export default function HqDocumentProducts({ jurisdiction }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [yearLevel, setYearLevel] = useState("3");
  const [previewPdf, setPreviewPdf] = useState(null);

  const load = async () => {
    setRefreshing(true);
    try {
      const response = await adminApi.get("/shop/products");
      setProducts((response.products || []).filter((p) => p.fulfilment === "digital" && (p.tags || []).includes("home-education-document")));
    } catch (e) { setError(errorText(e, "Could not load shop products.")); }
    finally { setRefreshing(false); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { setFile(null); setConfirmed(false); setPreviewPdf(null); setError(""); setMessage(""); }, [jurisdiction?.code]);

  if (!jurisdiction) return null;
  const current = products.find((p) => p.title === titleFor(jurisdiction));
  const guided = products.find((p) => p.title === guidedTitleFor(jurisdiction));
  const create = async (kind = "blank") => {
    setBusy(true); setMessage(""); setError("");
    try {
      await adminApi.post("/shop/products", {
        title: kind === "guided" ? guidedTitleFor(jurisdiction) : titleFor(jurisdiction),
        description: kind === "guided"
          ? `A private, guided planning worksheet for ${jurisdiction.name}. After a verified payment, enter your family's own educational goals and activities in your browser, review the resulting document and save it as a PDF using your browser's print function. It isn't an interactive fillable PDF, official government form or registration guarantee. Confirm current requirements with your authority.`
          : description(jurisdiction),
        department: "digital",
        collection: "Home Education Documents",
        tags: ["home-education-document", jurisdiction.code.toLowerCase(), ...(kind === "guided" ? ["guided-document"] : ["fillable-pdf"])],
        fulfilment: "digital",
        status: "draft",
        stage: "launch_now",
        price_cents: kind === "guided" ? 2995 : 1495,
        safety_checked: false,
      });
      setMessage("Draft listing created. It is hidden and cannot be purchased yet.");
      await load();
    } catch (e) { setError(errorText(e, "Could not create the draft.")); }
    finally { setBusy(false); }
  };
  const generatePreview = async () => {
    setBusy(true); setError(""); setMessage(""); setPreviewPdf(null);
    try {
      const result=await adminApi.post("/document-studio/preview",{state:jurisdiction.code,year_level:yearLevel});
      setPreviewPdf(result);
      setMessage("Preview generated. Nothing saved. Inspect the PDF and its fields before approving.");
    } catch(e){setError(errorText(e,"Could not generate the preview."));}
    finally{setBusy(false);}
  };
  const savePreview = async () => {
    if(!current||!previewPdf)return;
    setBusy(true);setError("");setMessage("");
    try{
      await adminApi.post(`/document-studio/products/${encodeURIComponent(current.id)}/save-preview`,{
        state:previewPdf.state,year_level:previewPdf.year_level,sha256:previewPdf.sha256
      });
      setMessage("The exact previewed PDF has been saved privately. Sales remain blocked pending quality review.");
      setPreviewPdf(null);await load();
    }catch(e){setError(errorText(e,"Could not save the previewed PDF."));}
    finally{setBusy(false);}
  };
  const upload = async () => {
    if (!current || !file || !confirmed) return;
    setBusy(true); setError(""); setMessage("");
    try {
      if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) throw new Error("Choose a PDF document.");
      if (file.size > 25 * 1024 * 1024) throw new Error("PDF files must be smaller than 25 MB.");
      const bytes = await fileData(file);
      await adminApi.post(`/shop/products/${encodeURIComponent(current.id)}/file`, { file: bytes, name: `sidequest-${jurisdiction.code.toLowerCase()}-home-education-template.pdf` });
      setFile(null);
      setMessage("PDF uploaded to private shop storage. The product remains hidden. Review its fillable fields and government sources before switching it on.");
      await load();
    } catch (e) { setError(errorText(e, "Could not upload the PDF.")); }
    finally { setBusy(false); }
  };

  return (
    <section className="paper-card p-5 space-y-3" data-testid="hq-document-products">
      <h3 className="text-lg font-bold">Sell a blank fillable document</h3>
      <p className="text-sm text-stone-700">Create an independent state-specific digital product in your existing Square-backed shop. The PDF must be prepared and tested before it can be offered to families.</p>
      <p className="text-sm text-stone-700">Suggested price: <strong>$14.95 AUD</strong> · {jurisdiction.name} · no postage · no AI generation.</p>
      {!current
        ? <button type="button" disabled={busy || refreshing} onClick={() => create("blank")} className="rounded-xl bg-[#4A5D3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Create hidden {jurisdiction.code} shop draft</button>
        : <div className="rounded-xl border border-stone-200 p-4 space-y-3">
          <p className="text-sm font-semibold">{current.title}</p>
          <p className="text-sm">Shop status: <strong>{current.status}</strong> · {current.visible ? "Visible" : "Hidden"} · {current.has_file ? "PDF uploaded" : "No PDF uploaded"}</p>
          <p className="text-xs text-stone-700">The state is fixed in this product's title. Don't reuse one state's PDF for another state.</p>
          <div className="rounded-xl border-2 border-[#4A5D3A] p-4 space-y-3 bg-[#F9F8F0]">
            <h4 className="font-semibold">Create the fillable PDF here</h4>
            <p className="text-sm">Generate a blank state-based document using the shared Side-Quest requirements. Nothing is saved or published until you inspect and approve the preview.</p>
            <label className="block text-sm font-semibold">Year level for learning-area layout
              <select className={input+" mt-1"} value={yearLevel} onChange={(e)=>{setYearLevel(e.target.value);setPreviewPdf(null);}}>
                {["K","F","Prep",...Array.from({length:12},(_,i)=>String(i+1))].map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            <button type="button" disabled={busy} onClick={generatePreview} className="rounded-xl bg-[#4A5D3A] px-4 py-2 font-semibold text-white disabled:opacity-60">1. Generate PDF preview</button>
            {previewPdf && <div className="space-y-3 rounded-xl border bg-white p-3">
              <p className="text-sm font-semibold">Preview ready — {jurisdiction.name}, year {previewPdf.year_level}</p>
              <div className="flex flex-wrap gap-2">
                <a className="rounded-xl border border-[#4A5D3A] px-4 py-2 text-sm font-semibold" href={previewPdf.data_url} download={`sidequest-${jurisdiction.code.toLowerCase()}-preview.pdf`}>2. Download and inspect PDF</a>
                <button type="button" disabled={busy} onClick={savePreview} className="rounded-xl bg-[#4A5D3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">3. Approve preview and save privately</button>
              </div>
              <p className="text-xs text-amber-900">Saving attaches this exact preview to the hidden product. It does not approve the document for sale.</p>
            </div>}
          </div>
          <label className="block text-sm font-semibold">Upload verified fillable PDF
            <input className={input + " mt-1"} type="file" accept=".pdf,application/pdf" onChange={(e) => { setFile(e.target.files?.[0] || null); setConfirmed(false); }} />
          </label>
          <label className="flex gap-2 text-sm items-start">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            <span>I've checked this PDF's form fields, layout, and state guidance against the official sources shown above.</span>
          </label>
          <button type="button" disabled={!file || !confirmed || busy} onClick={upload} className="rounded-xl bg-[#4A5D3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Upload PDF privately</button>
          <p className="text-xs text-stone-600">Uploading does not publish the listing. When ready, use <a href="/parent/command-centre/shop" className="underline">Owner HQ → Shop</a> to review its price, photo, description and visibility.</p>
        </div>}
      <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-2">
        <h4 className="font-semibold">Guided personalised document — $29.95 AUD</h4>
        <p className="text-sm text-stone-700">A separate draft for the paid, browser-based guided document builder. Families enter their own responses and use Print / Save as PDF. No AI calls or stored answers.</p>
        {guided
          ? <p className="text-sm">Listing: {guided.status} · {guided.visible ? "Visible" : "Hidden"} · {guided.has_file ? "Guide PDF uploaded" : "Guide PDF missing"}. Before publishing, upload the approved instruction PDF in <a className="underline" href="/parent/command-centre/shop">Owner HQ Shop</a>.</p>
          : <button type="button" disabled={busy || refreshing} onClick={() => create("guided")} className="rounded-xl bg-[#4A5D3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Create hidden {jurisdiction.code} guided-document draft</button>}
      </div>
      <button type="button" className="text-xs underline text-stone-700" onClick={load} disabled={refreshing}>Refresh document products</button>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="text-sm text-emerald-800">{message}</p>}
    </section>
  );
}
