import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

/** Fetches owner-uploaded cover art with the sign-in header (an <img src> can't send it). */
export function useCoverUrl(id, hasCover, version = null) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!id || !hasCover) { setUrl(""); return undefined; }
    let live = true, made = "";
    api.get(`/quest-books/books/${encodeURIComponent(id)}/cover${version ? `?v=${version}` : ""}`, { responseType: "blob" })
      .then((r) => { if (!live) return; made = URL.createObjectURL(new Blob([r.data], { type: "image/png" })); setUrl(made); })
      .catch(() => { if (live) setUrl(""); });
    return () => { live = false; if (made) URL.revokeObjectURL(made); };
  }, [id, hasCover, version]);
  return url;
}

/**
 * Shows the owner's uploaded cover art. Until a cover is uploaded, a plain card shows just the title:
 * the site never draws its own cover artwork.
 * `book` may be a placeholder ({ subjectLabel, yearLabel, placeholder: true }) for a subject not yet released.
 */
export default function QuestBookCover({ book, size = "md", className = "" }) {
  const art = useCoverUrl(book?.placeholder ? null : book?.id, book?.has_cover, book?.cover_v);
  const w = size === "lg" ? "w-56 sm:w-64" : size === "sm" ? "w-28" : "w-36 sm:w-40";
  const title = book?.placeholder ? book.subjectLabel : book?.title;
  return (
    <div className={`relative ${w} aspect-[3/4] shrink-0 select-none ${className}`} data-testid="quest-book-cover">
      <div className={`absolute inset-0 rounded-xl overflow-hidden shadow-[0_10px_24px_-8px_rgba(40,30,10,.45),0_2px_4px_rgba(40,30,10,.15)] ${art ? "" : "bg-white border border-stone-200"} ${book?.placeholder ? "opacity-70" : ""}`}>
        {art ? (
          <img src={art} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 gap-2 text-stone-600">
            <span className={`font-display font-bold text-slate-800 leading-tight ${size === "lg" ? "text-2xl" : size === "sm" ? "text-xs" : "text-base"}`}>{title}</span>
            <span className={`${size === "sm" ? "text-[9px]" : "text-xs"}`}>{book?.yearLabel || book?.year_label}</span>
            <span className={`uppercase tracking-wider font-bold text-stone-400 ${size === "sm" ? "text-[8px]" : "text-[10px]"}`}>{book?.placeholder ? "Coming soon" : "Cover coming soon"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
