import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ClipboardCheck, Loader2, X } from "lucide-react";
import { api } from "../../lib/api";

const day = (iso) => new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });

/**
 * Starting checks: a short auto-marked quiz per subject, assigned to the child, to see what they can already do.
 * Answered checks offer their correct answers as prior learning (through `onUseResults`).
 */
export default function StartingCheckDialog({ data, onClose, onUseResults }) {
  const sid = data.student.id;
  const first = (data.student.name || "your child").split(" ")[0];
  const subjects = useMemo(() => data.areas.filter((a) => !a.unsupported).map((a) => a.learning_area), [data]);
  const [checks, setChecks] = useState(null);
  const [picked, setPicked] = useState({});
  const [progress, setProgress] = useState(null); // { done, total, current }

  const load = () => api.get(`/outcomes/students/${sid}/starting-checks`).then((r) => {
    setChecks(r.data.checks || []);
    return r.data.checks || [];
  }).catch(() => { setChecks([]); return []; });
  useEffect(() => {
    load().then((list) => {
      // Tick every subject that doesn't have a check yet.
      const has = new Set(list.map((c) => c.subject));
      setPicked(Object.fromEntries(subjects.map((s) => [s, !has.has(s)])));
    });
  }, [sid]); // eslint-disable-line react-hooks/exhaustive-deps

  const chosen = subjects.filter((s) => picked[s]);
  const create = async () => {
    setProgress({ done: 0, total: chosen.length, current: chosen[0] });
    let made = 0;
    // Two at a time: each takes up to a minute to write.
    const queue = [...chosen];
    const worker = async () => {
      while (queue.length) {
        const subject = queue.shift();
        try { await api.post(`/outcomes/students/${sid}/starting-checks`, { subject }); made++; }
        catch (e) {
          toast.error(`${subject}: ${e.response?.data?.detail || "couldn't make this check"}`);
          if ([402, 429].includes(e.response?.status)) queue.length = 0;
        }
        setProgress((p) => ({ ...p, done: p.done + 1, current: queue[0] }));
      }
    };
    await Promise.all([worker(), worker()]);
    setProgress(null);
    if (made) toast.success(`${made} starting check${made === 1 ? "" : "s"} assigned to ${first} for today.`);
    const list = await load();
    const has = new Set(list.map((c) => c.subject));
    setPicked(Object.fromEntries(subjects.map((s) => [s, !has.has(s)])));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto" onClick={() => !progress && onClose()}>
      <section role="dialog" aria-modal="true" aria-label="Starting check" onClick={(e) => e.stopPropagation()} className="mx-auto my-4 max-w-2xl rounded-2xl bg-white" data-testid="check-dialog">
        <header className="border-b border-stone-200 px-4 sm:px-6 py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2" style={{ color: "#1F3B2D" }}><ClipboardCheck size={22} /> Starting check</h2>
            <p className="text-sm text-stone-600 mt-1">A short quiz per subject, about 10 minutes each, so you can see what {first} can already do. It isn't pass or fail, and only the first try counts.</p>
          </div>
          <button type="button" onClick={onClose} disabled={!!progress} className="text-stone-400 hover:text-stone-700 p-1" aria-label="Close"><X size={18} /></button>
        </header>

        <div className="px-4 sm:px-6 py-5 space-y-5">
          {checks === null ? <p className="text-sm text-stone-500">Loading…</p> : checks.length > 0 && (
            <div className="space-y-2" data-testid="check-list">
              <h3 className="font-display font-bold" style={{ color: "#1F3B2D" }}>{first}'s checks</h3>
              {checks.map((c) => {
                const right = c.items.filter((i) => i.correct).length;
                return (
                  <div key={c.id} className="rounded-xl border border-stone-200 p-3 flex flex-wrap items-center gap-3" data-testid={`check-${c.subject}`}>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-semibold">{c.subject}</p>
                      <p className="text-xs text-stone-600">{c.answered_at
                        ? `Answered ${day(c.answered_at)}: ${right} of ${c.items.length} right first time`
                        : c.assignment_status === "revoked" ? "Removed from the child's lessons" : `Waiting for ${first} · made ${day(c.created_at)}`}</p>
                    </div>
                    {c.answered_at && <button type="button" onClick={() => onUseResults(c)} className="rounded-full px-4 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: "#3730A3" }} data-testid={`check-use-${c.subject}`}>Use results</button>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-display font-bold" style={{ color: "#1F3B2D" }}>Make new checks</h3>
            <p className="text-xs text-stone-500">Each check is written by AI from {first}'s outcomes that aren't met yet, and appears in {first}'s lessons today. Maths and English questions are the most reliable; others can be rougher. Subjects like art or PE may only get a few questions.</p>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <label key={s} className={`rounded-full border px-3 py-1.5 text-sm cursor-pointer ${picked[s] ? "border-emerald-700 bg-emerald-50" : "border-stone-300"}`}>
                  <input type="checkbox" className="mr-2" checked={!!picked[s]} disabled={!!progress} onChange={() => setPicked((p) => ({ ...p, [s]: !p[s] }))} data-testid={`check-subject-${s}`} />{s}
                </label>
              ))}
            </div>
            {progress && <div role="status" className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-950 flex items-center gap-2" data-testid="check-progress">
              <Loader2 size={16} className="animate-spin" /> Writing checks: {progress.done} of {progress.total} done{progress.current ? ` (now ${progress.current})` : ""}…
            </div>}
            <button type="button" disabled={!!progress || !chosen.length} onClick={create}
              className="rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50" style={{ backgroundColor: "#1F3B2D" }} data-testid="check-create">
              Make {chosen.length} check{chosen.length === 1 ? "" : "s"} for {first}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
