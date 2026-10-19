import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink, Library, Search, ShieldCheck } from "lucide-react";
import { DRAGON_BOOKS, BOOK_BANDS, BOOK_GENRES, BOOK_SUBJECTS, dragonBookLinks } from "../../data/dragonLibrary";

const SELECT_CLASS = "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800";
const BUTTON_CLASS = "inline-flex items-center gap-1.5 rounded-full border border-[#D4C8A8] bg-white px-3 py-2 text-xs font-bold text-[#1F3B2D] hover:bg-[#F5EFE0]";
const external = (href, label) => <a href={href} target="_blank" rel="noopener noreferrer" className={BUTTON_CLASS}><ExternalLink size={12}/>{label}</a>;

export default function DragonLibrary({mode = "parent"}) {
  const child = mode === "child";
  const [query,setQuery] = useState("");
  const [band,setBand] = useState("");
  const [genre,setGenre] = useState("");
  const [subject,setSubject] = useState("");
  const [access,setAccess] = useState("");
  const [limit,setLimit] = useState(24);
  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return DRAGON_BOOKS.filter(b =>
      (!band || b.band === band) &&
      (!genre || b.genre === genre) &&
      (!subject || b.subjects.includes(subject)) &&
      (!access || (access === "free" ? b.access !== "borrow" : b.access === "borrow")) &&
      (!q || [b.title,b.author,b.genre,b.note,...b.subjects].join(" ").toLocaleLowerCase().includes(q))
    );
  },[query,band,genre,subject,access]);
  const visible = results.slice(0,limit);
  const base = child ? "/child" : "/parent";

  return (
    <div className="p-2 sm:p-5 lg:p-8 space-y-6 max-w-6xl mx-auto" data-testid="dragons-library">
      <header className="paper-card p-6 sm:p-8 space-y-2" style={{background:"linear-gradient(125deg,#F5EFE0,#ECF1E7)"}}>
        <div className="text-sm font-bold tracking-widest uppercase text-[#8A5D32]">Side-Quest · The reading hoard</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1F3B2D] flex items-center gap-2"><Library size={30}/> The Dragon's Library</h1>
        <p className="text-stone-700 max-w-3xl">Find your next adventure, then discover where to borrow it, explore free reading or hunt down a second-hand copy. Reading should not require a dragon-sized treasure hoard. 🐉</p>
        <p className="text-xs text-stone-600">A recommendations directory, not a book shop: Side-Quest never hosts these books, sells them or checks live stock. Borrowing depends on your library, membership and location.</p>
      </header>

      {child && <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
        Ask your grown-up before leaving Side-Quest for another website. When you've actually read, listened to or shared a book, you can record it in <Link className="underline font-bold" to="/child/reading">My reading</Link>.
      </div>}
      <section className="paper-card p-5 space-y-3" aria-label="Find a book">
        <label className="block text-sm font-bold text-[#1F3B2D]" htmlFor="dragon-book-search">Search the shelves</label>
        <div className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3">
          <Search size={18} className="text-stone-500"/>
          <input id="dragon-book-search" data-testid="dragon-library-search" value={query} onChange={e => {setQuery(e.target.value);setLimit(24);}} placeholder="Book title, author, subject or theme…" className="w-full py-3 text-sm outline-none" />
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-2">
          <label className="text-xs font-semibold text-stone-600">Reading stage<select className={SELECT_CLASS} value={band} onChange={e => {setBand(e.target.value);setLimit(24);}}><option value="">All reading stages</option>{BOOK_BANDS.map(b=><option key={b.value} value={b.value}>{b.label}</option>)}</select></label>
          <label className="text-xs font-semibold text-stone-600">Genre<select className={SELECT_CLASS} value={genre} onChange={e => {setGenre(e.target.value);setLimit(24);}}><option value="">All genres</option>{BOOK_GENRES.map(g=><option key={g}>{g}</option>)}</select></label>
          <label className="text-xs font-semibold text-stone-600">Learning connection<select className={SELECT_CLASS} value={subject} onChange={e => {setSubject(e.target.value);setLimit(24);}}><option value="">All subjects</option>{BOOK_SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></label>
          <label className="text-xs font-semibold text-stone-600">Access option<select className={SELECT_CLASS} value={access} onChange={e => {setAccess(e.target.value);setLimit(24);}}><option value="">All options</option><option value="free">Search free online reading</option><option value="borrow">Borrow / second-hand</option></select></label>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap"><span className="text-sm text-stone-600" aria-live="polite">{results.length} recommendation{results.length === 1 ? "" : "s"} found</span><button type="button" className="text-xs font-semibold underline text-[#4A5D3A]" onClick={() => {setQuery("");setBand("");setGenre("");setSubject("");setAccess("");setLimit(24);}}>Clear filters</button></div>
      </section>

      {results.length === 0 && <div className="paper-card p-8 text-center text-stone-600">No book dragons found for those filters. Try another search!</div>}
      <div className="grid gap-4 md:grid-cols-2" data-testid="dragon-book-results">
        {visible.map(book => {
          const links = dragonBookLinks(book);
          const freeLabel = book.access === "bookdash" ? "Read free at Book Dash" : "Search Project Gutenberg";
          const readPath = (child ? "/child/reading" : "/parent/reading-log") + "?book=" + encodeURIComponent(book.title) + "&author=" + encodeURIComponent(book.author === "Book Dash creators" ? "" : book.author);
          return <article key={book.id} className="paper-card p-5 space-y-3 flex flex-col" data-testid="dragon-book-card">
            <div className="flex gap-3">
              <div aria-hidden="true" className="w-14 h-20 flex-none rounded-xl bg-[#DBE5D4] grid place-items-center text-[#1F3B2D]"><BookOpen size={28}/></div>
              <div className="min-w-0 space-y-1">
                <h2 className="font-display font-bold text-lg text-[#1F3B2D] leading-snug">{book.title}</h2>
                <p className="text-sm text-stone-600">{book.access === "bookdash" ? "Book Dash · creator credits at source" : book.author}</p>
                <p className="text-xs text-stone-600">{BOOK_BANDS.find(b=>b.value===book.band)?.label} · {book.genre}</p>
              </div>
            </div>
            <p className="text-sm text-stone-700 flex-1">{book.note}</p>
            <div className="flex gap-1 flex-wrap">{book.subjects.map(s=><span key={s} className="text-[11px] px-2 py-1 rounded-full bg-[#E9EFE3] text-[#35513A]">{s}</span>)}</div>
            <p className="text-xs font-semibold text-stone-500">{book.access === "bookdash" ? "Listed in Book Dash's free reading collection" : book.access === "gutenberg" ? "Search a free-classics catalogue; check rights in your country" : "Search for a library loan or an affordable copy"}</p>
            <div className="flex gap-2 flex-wrap">
              {links.free && external(links.free,freeLabel)}
              {external(links.trove,"Find in Australian libraries")}
              {external("https://libbyapp.com/","Try Libby")}
              {external("https://www.borrowbox.com/","Try BorrowBox")}
              {!child && external(links.secondhand,"Search second-hand")}
            </div>
            <div className="border-t border-stone-200 pt-3 flex flex-wrap items-center gap-2 justify-between">
              <span className="text-[11px] text-stone-500">Links open outside Side-Quest; results and prices vary.</span>
              <Link className="text-xs font-bold underline text-[#1F3B2D]" to={readPath}>Log this book after reading →</Link>
            </div>
          </article>;
        })}
      </div>
      {results.length > visible.length && <div className="text-center"><button type="button" className="rounded-full bg-[#1F3B2D] text-white px-5 py-3 text-sm font-bold" onClick={()=>setLimit(n=>n+24)}>Explore more books ({results.length-visible.length} remaining)</button></div>}
      <footer className="paper-card p-5 text-xs text-stone-600 space-y-2">
        <p className="font-semibold text-[#1F3B2D] flex gap-2 items-center"><ShieldCheck size={16}/> The legal little print</p>
        <p>Recommendations and short descriptions are written by Side-Quest. We use no publisher cover artwork or copied book text. These links lead to independent third-party sites; Side-Quest is not affiliated with them. Libraries vary in eligibility, stock, waits and lending platforms. Always check the provider's terms and copyright rules where you live.</p>
        <p>Book Dash provides books to read free on its own site. Gutenberg results may be free in some countries but are not automatically public-domain everywhere. Second-hand listings and prices are not checked by Side-Quest.</p>
        <p>Notice an incorrect title, broken link or rights concern? <Link className="underline font-bold" to={base + (child ? "/reading" : "/feedback")}>{child ? "Ask your parent for help" : "Tell us through Ideas & Feedback"}</Link>.</p>
      </footer>
    </div>
  );
}
