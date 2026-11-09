import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, errorText } from "../../../lib/adminApi";
import { api } from "../../../lib/api";
import { Button, Card, Alert } from "./ui";

const ROOT = "/book-forge";
function LessonReference({ value }) {
  if (value == null) return null;
  if (typeof value !== "object")
    return <p className="whitespace-pre-wrap my-1">{String(value)}</p>;
  return (
    <div className="space-y-2">
      {Object.entries(value).map(([key, item]) => (
        <div key={key}>
          {!/^\d+$/.test(key) && (
            <h4 className="font-semibold capitalize">
              {key.replace(/_/g, " ")}
            </h4>
          )}
          <LessonReference value={item} />
        </div>
      ))}
    </div>
  );
}
const field =
  "block w-full rounded-xl border border-stone-300 p-2 mt-1 font-normal";
const STAGES = [
  ["plan", "Plan"],
  ["write", "Write and check"],
  ["illustrate", "Illustrate"],
  ["render", "PDF"],
];
const SESSION_STATE = {
  done: ["✓", "text-emerald-800", "Done"],
  writing: ["…", "text-sky-800 font-semibold", "Writing now"],
  stuck: ["!", "text-amber-800 font-semibold", "Paused"],
  waiting: ["·", "text-stone-500", "Waiting"],
  planning: ["·", "text-stone-400", "Not planned yet"],
};
const ago = (iso) => {
  const s = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 1000));
  return s < 60 ? "just now" : s < 3600 ? `${Math.round(s / 60)} min ago` : `${Math.round(s / 3600)} h ago`;
};
const FAILURE_LABEL = {
  truncated: "reply cut off at the length limit",
  malformed: "reply was not JSON",
  schema: "reply had the wrong shape",
  empty: "empty reply",
  provider: "writing service error",
  editorial: "quality checks",
  budget: "spending cap reached",
  calls: "call limit reached",
  step: "step error",
};
const stoppedStatus = (status) => status === "paused" || status === "failed";
/** Build progress: overall bar, the four stages, an estimate, and every session's state. */
function BuildProgress({ progress, status, updatedAt }) {
  const p = progress;
  return (
    <div className="mt-3 space-y-3" data-testid="forge-progress">
      <div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{p.percent}% complete</span>
          <span className="text-stone-600">
            {p.minutesLeft != null
              ? `${p.estimateBasis === "initial" ? "Roughly" : "About"} ${p.minutesLeft} min left`
              : status === "complete"
                ? "Finished"
                : stoppedStatus(status)
                  ? "Paused · needs you"
                  : "Stopped"}
          </span>
        </div>
        <div
          className="h-2.5 mt-1 rounded-full bg-stone-200 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={p.percent}
        >
          <div
            className={`h-full ${stoppedStatus(status) ? "bg-amber-600" : "bg-emerald-700"}`}
            style={{ width: `${p.percent}%` }}
          />
        </div>
        <p className="text-xs text-stone-600 mt-1">
          Started {new Date(p.startedAt).toLocaleString("en-AU", { weekday: "short", hour: "numeric", minute: "2-digit" })}
          {updatedAt ? ` · last step ${ago(updatedAt)}` : ""} · {p.pagesSaved} page
          {p.pagesSaved === 1 ? "" : "s"} saved
        </p>
      </div>
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {STAGES.map(([key, label]) => {
          const s = p.steps[key];
          const complete = s.total > 0 && s.done >= s.total;
          return (
            <li
              key={key}
              className={`rounded-lg border px-2 py-1.5 ${complete ? "border-emerald-700 bg-emerald-50" : "border-stone-300"}`}
            >
              <span className="font-semibold block">{label}</span>
              {key === "render" ? (complete ? "Done" : "Not yet") : `${s.done} of ${s.total}`}
            </li>
          );
        })}
      </ol>
      <details>
        <summary className="cursor-pointer text-sm font-semibold">
          Sessions ({p.steps.write.done} of {p.steps.write.total} written)
        </summary>
        <ol className="mt-2 text-sm max-h-64 overflow-auto divide-y divide-stone-100">
          {p.sessions.map((s) => {
            const [mark, cls, label] = SESSION_STATE[s.state];
            return (
              <li key={s.n} className="flex gap-2 py-1">
                <span className={`w-4 text-center ${cls}`} aria-hidden="true">{mark}</span>
                <span className="flex-1 min-w-0 truncate">
                  {s.n}. {s.title || "To be planned"}
                </span>
                <span className={`text-xs ${cls}`}>
                  {label}
                  {s.state === "stuck" && s.attempts
                    ? ` after ${s.attempts} draft${s.attempts === 1 ? "" : "s"}`
                    : s.attempts
                      ? ` · attempt ${s.attempts + 1}`
                      : ""}
                  {s.lastFailure ? ` · last: ${FAILURE_LABEL[s.lastFailure] || s.lastFailure}` : ""}
                </span>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
export default function HqBookForge() {
  const [catalogue, setCatalogue] = useState({
    projects: [],
    templates: [],
    capabilities: {},
  });
  const [lessons, setLessons] = useState([]);
  const [project, setProject] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [artModel, setArtModel] = useState("klein");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [working, setBusy] = useState(false);
  const [generation, setGeneration] = useState(null);
  const generating =
    generation?.status === "queued" || generation?.status === "running";
  const busy = working || generating;
  const [brief, setBrief] = useState(
    "Make me a professional-grade Foundation mathematics workbook, with clear teaching, worked examples, varied practice, hands-on activities and answers.",
  );
  const [pageTarget, setPageTarget] = useState("");
  const [bookLength, setBookLength] = useState("full");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState("");
  const [sourceLesson, setSourceLesson] = useState(null);
  const [qa, setQa] = useState(null);
  const [reviewed, setReviewed] = useState(false);
  const reload = async () => setCatalogue(await adminApi.get(ROOT));
  useEffect(() => {
    Promise.all([
      reload(),
      adminApi.get(ROOT + "/lessons").then((r) => setLessons(r.lessons)),
    ]).catch((e) => setError(errorText(e)));
  }, []);
  useEffect(() => {
    const warn = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (!project?.id) return undefined;
    let current = true;
    const tick = async () => {
      try {
        const { job } = await adminApi.get(`${ROOT}/${project.id}/generation`);
        if (!current) return;
        setGeneration(job);
        if (job && !dirty) {
          const next = await adminApi.get(`${ROOT}/${project.id}`);
          if (current)
            setProject((old) => (old?.revision === next.revision ? old : next));
        }
      } catch (e) {
        if (current) setError(errorText(e));
      }
    };
    tick();
    const timer = setInterval(tick, 8000);
    return () => {
      current = false;
      clearInterval(timer);
    };
  }, [project?.id, dirty]);
  const run = async (fn) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(errorText(e, e.message));
    } finally {
      setBusy(false);
    }
  };
  const accept = (p) => {
    setGeneration(null);
    setProject(p);
    setDirty(false);
    setQa(null);
    setReviewed(false);
    setPreview("");
  };
  const edit = (book) => {
    setProject({ ...project, book });
    setDirty(true);
    setQa(null);
    setReviewed(false);
    setPreview("");
  };
  const page = project?.book.pages[pageIndex];
  const editPage = (patch) =>
    edit({
      ...project.book,
      pages: project.book.pages.map((p, i) =>
        i === pageIndex ? { ...p, ...patch } : p,
      ),
    });
  const save = async () => {
    const p = await adminApi.put(`${ROOT}/${project.id}`, {
      revision: project.revision,
      book: project.book,
    });
    accept(p);
    await reload();
    return p;
  };
  const action = async (name, extra = {}) => {
    const p = await adminApi.post(`${ROOT}/${project.id}/${name}`, {
      revision: project.revision,
      pageId: page?.id,
      ...extra,
    });
    if (name === "qa") setQa(p.issues);
    else {
      accept(p);
      await reload();
    }
    setNotice(
      {
        lock: "Page content and lesson reference locked.",
        unlock: "Page unlocked for editing.",
        illustrate: "Illustration saved. Preview the updated page.",
        render: "PDF saved. Download and inspect it before approving.",
        approve: "Current PDF approved.",
        publish:
          "Published to a hidden Shop draft. Set its price and visibility in Shop.",
      }[name] || "Checks completed.",
    );
  };
  const download = async (release) => {
    const r = await api.get(`/admin${ROOT}/${project.id}/pdf`, {
      params: release ? { release } : undefined,
      responseType: "blob",
      headers: { "X-SideQuest-Admin": "1" },
    });
    const url = URL.createObjectURL(r.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "side-quest-book.pdf";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };
  return (
    <div className="space-y-5" data-testid="hq-book-forge">
      <div>
        <p className="uppercase tracking-widest text-xs text-emerald-800 font-bold">
          The publishing studio
        </p>
        <h2 className="font-display text-3xl font-bold text-emerald-950">
          Book Forge
        </h2>
        <p className="text-stone-600 mt-2">
          Describe the workbook you want. Book Forge writes, checks, illustrates
          and assembles it for your approval, ready for the Shop.
        </p>
      </div>
      {error && <Alert>{error}</Alert>}
      {notice && (
        <p role="status" className="rounded-xl bg-emerald-50 p-3">
          {notice}
        </p>
      )}
      {!catalogue.capabilities.pdf && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm">
          PDF export needs its Cloudflare Browser Rendering connection. You can
          create, save and preview projects now.
        </p>
      )}
      <Card title="What shall we make?">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(async () => {
              const p = await adminApi.post(ROOT + "/generate", {
                brief,
                length: bookLength,
                pageTarget: pageTarget ? Number(pageTarget) : undefined,
              });
              accept(p);
              setGeneration({
                status: "queued",
                phase: "plan",
                cursor: 0,
                total: 0,
              });
              setPageIndex(0);
              await reload();
              setNotice(
                "Your workbook is queued. It will keep creating in the background; you can return here later.",
              );
            });
          }}
        >
          <label className="block text-sm font-semibold">
            Describe your workbook
            <textarea
              className={field}
              rows={4}
              maxLength={2000}
              minLength={20}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              required
            />
          </label>
          <div className="flex flex-wrap gap-3 items-end">
            <label className="text-sm font-semibold">
              Size
              <select
                className={field}
                value={bookLength}
                onChange={(e) => setBookLength(e.target.value)}
              >
                <option value="full">
                  Complete workbook · length follows the content
                </option>
                <option value="short">Focused topic workbook</option>
              </select>
            </label>
            <label className="text-sm font-semibold">
              Optional page target
              <input
                type="number"
                min="8"
                className={field}
                value={pageTarget}
                onChange={(e) => setPageTarget(e.target.value)}
                placeholder="Let the content decide"
              />
            </label>
            <Button
              type="submit"
              disabled={busy || dirty || !catalogue.capabilities.art}
            >
              Create my workbook
            </Button>
          </div>
          <p className="text-xs text-stone-600">
            First edition supports Foundation–Year 6 Mathematics, English and
            Science. Include the year and subject in your brief. Original
            content, separate answer pages, curriculum planning references,
            Side-Quest design and selected illustrations. Human approval is
            required before sale.
          </p>
        </form>
      </Card>
      {generation && project && (
        <Card title="Your workbook is taking shape">
          <p role="status" className="font-semibold">
            {
              {
                plan: "Planning the learning sequence",
                write: `Writing and checking session ${Math.min(generation.cursor + 1, generation.total)} of ${generation.total}`,
                illustrate: "Creating chapter illustrations",
                render: "Assembling your PDF",
                ready: "Ready for your review",
              }[generation.phase]
            }{" "}
            · {generation.status}
          </p>
          {generation.progress && (
            <BuildProgress
              progress={generation.progress}
              status={generation.status}
              updatedAt={generation.updated_at}
            />
          )}
          <p className="text-sm mt-2">
            Completed sections are saved as they finish. Creation runs in the
            background, so you can close this page and come back.
          </p>
          {stoppedStatus(generation.status) && (
            <div className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950" data-testid="forge-paused" role="alert">
              <p className="font-semibold">
                Creation is paused{generation.pause?.session != null ? ` at session ${generation.pause.session + 1}` : ""}
                {generation.pause?.kind ? ` (${FAILURE_LABEL[generation.pause.kind] || generation.pause.kind})` : ""}.
                No more paid calls will be made until you choose what to do.
              </p>
              {generation.error && <p className="mt-1">{generation.error}</p>}
              <p className="mt-1 text-stone-700">
                Every approved session and every saved part is kept. Retry continues this step with a fresh set of
                attempts{generation.recovery?.includes("reset-session") ? "; Write this session again discards only this session's draft" : ""}.
              </p>
            </div>
          )}
          {!stoppedStatus(generation.status) && generation.error && !/needs revision/.test(generation.error) && (
            <p className="mt-2 text-amber-900">{generation.error}</p>
          )}
          {generation.review && (
            <div className="mt-2 text-sm" data-testid="forge-review">
              <p className="font-semibold text-amber-900">
                Session {Math.min(generation.cursor + 1, generation.total)}
                {generation.review.attempts
                  ? ` · ${generation.review.attempts} draft${generation.review.attempts === 1 ? "" : "s"} so far`
                  : ""}
                {generation.review.mode === "components"
                  ? ` · built in parts (saved: ${generation.review.savedComponents.join(", ") || "none yet"})`
                  : ""}
                . Nothing from this draft is in the book until it passes every check.
              </p>
              {generation.review.format?.length > 0 && (
                <p className="mt-1 text-stone-700">
                  Formatting being repaired (not a teaching problem): {generation.review.format.join(" · ")}
                </p>
              )}
              {generation.review.errors.length > 0 && (
                <ul className="list-disc pl-5 mt-1 text-amber-900">
                  {generation.review.errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
              {generation.review.suggestions.length > 0 && (
                <p className="mt-1 text-stone-600">
                  Suggestions (not required):{" "}
                  {generation.review.suggestions.join(" · ")}
                </p>
              )}
            </div>
          )}
          {generation.usage && (
            <p className="mt-2 text-xs text-stone-600" data-testid="forge-usage">
              {generation.usage.calls} model call{generation.usage.calls === 1 ? "" : "s"}
              {generation.usage.failedCalls ? ` (${generation.usage.failedCalls} unusable${generation.usage.truncatedCalls ? `, ${generation.usage.truncatedCalls} cut off` : ""})` : ""}
              {" · "}
              {(generation.usage.inputTokens + generation.usage.outputTokens).toLocaleString("en-AU")} tokens · about US$
              {generation.usage.estimatedUsd.toFixed(2)} estimated of a US${Number(generation.usage.capUsd).toFixed(2)} cap
            </p>
          )}
          <div className="flex gap-2 mt-3">
            {stoppedStatus(generation.status) && generation.recovery?.includes("reset-session") && (
              <Button
                tone="plain"
                disabled={working}
                onClick={() =>
                  run(async () => {
                    await adminApi.post(`${ROOT}/${project.id}/reset-session`);
                    setGeneration({ ...generation, status: "queued", error: "", pause: null });
                  })
                }
              >
                Write this session again
              </Button>
            )}
            {stoppedStatus(generation.status) && (
              <Button
                disabled={working}
                onClick={() =>
                  run(async () => {
                    await adminApi.post(`${ROOT}/${project.id}/retry`);
                    setGeneration({
                      ...generation,
                      status: "queued",
                      error: "",
                      pause: null,
                    });
                  })
                }
              >
                Retry this step
              </Button>
            )}
            {(generating || stoppedStatus(generation.status)) && (
              <Button
                tone="plain"
                disabled={working}
                onClick={() =>
                  run(async () => {
                    await adminApi.post(`${ROOT}/${project.id}/cancel`);
                    setGeneration({ ...generation, status: "cancelled" });
                  })
                }
              >
                Stop and keep completed pages
              </Button>
            )}
          </div>
        </Card>
      )}
      <details open={!!project}>
        <summary className="cursor-pointer text-sm font-semibold text-emerald-950">
          Review and edit your books · or build one manually
        </summary>
        <div className="grid lg:grid-cols-[220px_1fr] gap-5 mt-4">
          <aside className="space-y-4">
            <Card title="Your projects">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  run(async () => {
                    if (dirty)
                      throw new Error("Save your current project first.");
                    const p = await adminApi.post(ROOT, { title });
                    accept(p);
                    setPageIndex(0);
                    setTitle("");
                    await reload();
                  });
                }}
              >
                <label className="text-sm">
                  New book title
                  <input
                    className={field}
                    value={title}
                    maxLength={120}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>

                <Button type="submit" className="mt-2" disabled={busy || dirty}>
                  Create project
                </Button>
              </form>
              <div className="mt-4 space-y-2">
                {catalogue.projects.map((p) => (
                  <button
                    key={p.id}
                    disabled={busy || dirty}
                    className={`block text-left w-full rounded-xl p-3 text-sm ${p.id === project?.id ? "bg-emerald-100" : "bg-stone-100"}`}
                    onClick={() =>
                      run(async () => {
                        accept(await adminApi.get(`${ROOT}/${p.id}`));
                        setPageIndex(0);
                      })
                    }
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </Card>
          </aside>
          {!project ? (
            <Card title="Make something worth keeping">
              <p>
                Start a project, choose its design and link each page to an
                existing lesson. Your teaching content stays locked while
                artwork and layout develop.
              </p>
            </Card>
          ) : (
            <main className="space-y-4">
              <Card>
                <div className="flex flex-wrap gap-3 items-end">
                  <label className="flex-1 text-sm font-semibold">
                    Book title
                    <input
                      disabled={busy}
                      className={field}
                      value={project.book.title}
                      maxLength={120}
                      onChange={(e) =>
                        edit({ ...project.book, title: e.target.value })
                      }
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Design
                    <select
                      disabled={busy}
                      className={field}
                      value={project.book.template}
                      onChange={(e) =>
                        edit({ ...project.book, template: e.target.value })
                      }
                    >
                      {catalogue.templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Button disabled={busy || !dirty} onClick={() => run(save)}>
                    {dirty ? "Save changes" : "Saved"}
                  </Button>
                </div>
                <p className="text-xs text-stone-500 mt-2">
                  {dirty
                    ? "Unsaved changes — save before switching projects or running a production step."
                    : `Saved revision ${project.revision}`}
                </p>
              </Card>
              <Card title="Pages">
                <div className="flex flex-wrap gap-2">
                  {project.book.pages.map((p, i) => (
                    <button
                      key={p.id}
                      className={`rounded-lg px-3 py-2 text-sm ${i === pageIndex ? "bg-emerald-900 text-white" : "bg-stone-100"}`}
                      onClick={() => {
                        setPageIndex(i);
                        setPrompt("");
                        setSourceLesson(null);
                      }}
                    >
                      {i + 1}
                      {p.locked ? " · Locked" : ""}
                    </button>
                  ))}
                  <Button
                    tone="plain"
                    disabled={busy || project.book.pages.length >= 1000}
                    onClick={() => {
                      edit({
                        ...project.book,
                        pages: [
                          ...project.book.pages,
                          {
                            id: crypto.randomUUID(),
                            title: "New quest",
                            text: "",
                            goal: "",
                            lessonId: "",
                            locked: false,
                          },
                        ],
                      });
                      setPageIndex(project.book.pages.length);
                    }}
                  >
                    + Add page
                  </Button>
                </div>
              </Card>
              {page && (
                <Card
                  title={`Page ${pageIndex + 1} · ${page.locked ? "Content locked" : "Writing desk"}`}
                >
                  <fieldset disabled={busy} className="space-y-3">
                    <label className="block text-sm font-semibold">
                      Page title
                      <input
                        className={field}
                        disabled={page.locked}
                        value={page.title}
                        maxLength={120}
                        onChange={(e) => editPage({ title: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm font-semibold">
                      Linked lesson
                      <select
                        className={field}
                        disabled={page.locked}
                        value={page.lessonId}
                        onChange={(e) => editPage({ lessonId: e.target.value })}
                      >
                        <option value="">Choose a lesson</option>
                        {[
                          ...(project.book.plan || []).map((p) => ({
                            id: p.lessonId,
                            title: p.title,
                          })),
                          ...lessons,
                        ].map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button
                      tone="plain"
                      disabled={!page.lessonId || busy}
                      onClick={() =>
                        run(async () =>
                          setSourceLesson(
                            project.book.plan?.some(
                              (p) => p.lessonId === page.lessonId,
                            )
                              ? {
                                  title: page.title,
                                  data: JSON.stringify(
                                    project.book.plan.find(
                                      (p) => p.lessonId === page.lessonId,
                                    ),
                                  ),
                                }
                              : (
                                  await adminApi.get(
                                    `${ROOT}/lessons/${encodeURIComponent(page.lessonId)}`,
                                  )
                                ).lesson,
                          ),
                        )
                      }
                    >
                      Read linked lesson
                    </Button>
                    {sourceLesson && (
                      <details
                        open
                        className="rounded-xl bg-stone-50 p-3 text-sm"
                      >
                        <summary>
                          {sourceLesson.title} · lesson reference
                        </summary>
                        <div className="break-words max-h-72 overflow-auto mt-2">
                          <LessonReference
                            value={JSON.parse(sourceLesson.data)}
                          />
                        </div>
                      </details>
                    )}
                    <label className="block text-sm font-semibold">
                      Learning goal
                      <input
                        className={field}
                        disabled={page.locked}
                        value={page.goal}
                        maxLength={300}
                        onChange={(e) => editPage({ goal: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm font-semibold">
                      Teaching content and activities
                      <textarea
                        className={field}
                        rows={9}
                        disabled={page.locked}
                        value={page.text}
                        maxLength={2400}
                        onChange={(e) => editPage({ text: e.target.value })}
                      />
                    </label>
                    <p className="text-xs text-stone-500">
                      AI creates illustrations only. Locking preserves your
                      exact wording and a snapshot of the linked lesson; you
                      check their educational alignment.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        disabled={dirty || busy}
                        onClick={() =>
                          run(() => action(page.locked ? "unlock" : "lock"))
                        }
                      >
                        {page.locked
                          ? "Unlock to edit"
                          : "Lock content & lesson"}
                      </Button>
                      <Button
                        tone="plain"
                        disabled={pageIndex === 0 || busy}
                        onClick={() => {
                          const pages = [...project.book.pages];
                          [pages[pageIndex - 1], pages[pageIndex]] = [
                            pages[pageIndex],
                            pages[pageIndex - 1],
                          ];
                          edit({ ...project.book, pages });
                          setPageIndex(pageIndex - 1);
                        }}
                      >
                        Move earlier
                      </Button>
                      <Button
                        tone="plain"
                        disabled={
                          page.locked || project.book.pages.length === 1 || busy
                        }
                        onClick={() => {
                          edit({
                            ...project.book,
                            pages: project.book.pages.filter(
                              (p) => p.id !== page.id,
                            ),
                          });
                          setPageIndex(Math.max(0, pageIndex - 1));
                        }}
                      >
                        Remove page
                      </Button>
                    </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-semibold">
                        Illustration quality
                        <select
                          className={field}
                          value={artModel}
                          onChange={(e) => setArtModel(e.target.value)}
                        >
                          <option value="klein">
                            FLUX.2 Klein · US$0.015 per 1024px image before free
                            allowance
                          </option>
                          <option value="schnell">
                            FLUX Schnell · economical draft
                          </option>
                        </select>
                      </label>
                      <label className="block text-sm font-semibold">
                        Illustration brief
                        <textarea
                          className={field}
                          rows={3}
                          maxLength={1400}
                          value={prompt}
                          placeholder={
                            page.prompt ||
                            "A curious little dragon discovering a woodland reading nook…"
                          }
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </label>
                      <Button
                        className="mt-2"
                        disabled={
                          dirty ||
                          busy ||
                          !prompt.trim() ||
                          !catalogue.capabilities.art
                        }
                        onClick={() =>
                          run(() =>
                            action("illustrate", { prompt, model: artModel }),
                          )
                        }
                      >
                        {busy
                          ? "Working…"
                          : page.art
                            ? "Generate replacement artwork"
                            : "Generate artwork"}
                      </Button>
                      <p className="text-xs text-stone-500 mt-2">
                        Up to 30 illustrations per day. Generated artwork is
                        saved privately with your project.
                      </p>
                    </div>
                  </fieldset>
                </Card>
              )}
              <Card title="Preview & quality checks">
                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={busy || dirty}
                    onClick={() =>
                      run(async () => {
                        setPreview(
                          (await adminApi.get(`${ROOT}/${project.id}/preview`))
                            .html,
                        );
                      })
                    }
                  >
                    Preview saved pages
                  </Button>
                  <Button
                    tone="plain"
                    disabled={busy || dirty}
                    onClick={() => run(() => action("qa"))}
                  >
                    Run checks
                  </Button>
                  <Button
                    disabled={busy || dirty || !catalogue.capabilities.pdf}
                    onClick={() => run(() => action("render"))}
                  >
                    Generate PDF
                  </Button>
                  {project.book.pdf && !dirty && (
                    <Button
                      tone="plain"
                      disabled={busy}
                      onClick={() => run(() => download())}
                    >
                      Download PDF
                    </Button>
                  )}
                </div>
                {qa && (
                  <div className="mt-3" role="status">
                    {qa.length ? (
                      <ul className="list-disc pl-5 text-sm text-amber-900">
                        {qa.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        Structure and lesson snapshots pass. Inspect every PDF
                        page for clipping, readability, artwork quality and
                        correct teaching content.
                      </p>
                    )}
                  </div>
                )}
                {preview && (
                  <iframe
                    title="Book print preview"
                    sandbox=""
                    srcDoc={preview}
                    className="w-full mt-4 rounded-xl border bg-stone-200"
                    style={{ height: 650 }}
                  />
                )}
              </Card>
              <Card title="Approve & publish">
                <p className="text-sm text-stone-600">
                  Publishing creates a hidden digital book in Shop with its
                  approved PDF attached. Set pricing and switch it on there when
                  ready.
                </p>
                <label className="flex gap-2 text-sm my-3">
                  <input
                    type="checkbox"
                    checked={reviewed}
                    onChange={(e) => setReviewed(e.target.checked)}
                    disabled={!project.book.pdf || dirty}
                  />
                  I inspected the downloaded PDF, checked every page and
                  illustration, and confirmed lesson alignment and rights to
                  sell this content.
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={busy || dirty || !reviewed || !project.book.pdf}
                    onClick={() => run(() => action("approve", { reviewed }))}
                  >
                    {project.book.approved ? "Approved" : "Approve this PDF"}
                  </Button>
                  <Button
                    disabled={
                      busy ||
                      dirty ||
                      !project.book.approved ||
                      project.book.releases.some(
                        (r) => r.key === project.book.pdf,
                      )
                    }
                    onClick={() => run(() => action("publish"))}
                  >
                    Publish to Shop drafts
                  </Button>
                  <Link
                    className="underline text-sm p-2"
                    to="/parent/command-centre/shop"
                  >
                    Open Shop
                  </Link>
                </div>
                {project.book.releases.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="font-bold text-sm">Published editions</h3>
                    {project.book.releases.map((r) => (
                      <div
                        key={r.key}
                        className="text-sm flex justify-between border-t pt-2"
                      >
                        <span>
                          {r.title} ·{" "}
                          {new Date(r.date).toLocaleDateString("en-AU")}
                        </span>
                        <button
                          className="underline"
                          disabled={busy}
                          onClick={() => run(() => download(r.key))}
                        >
                          Download edition
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </main>
          )}
        </div>
      </details>
    </div>
  );
}
