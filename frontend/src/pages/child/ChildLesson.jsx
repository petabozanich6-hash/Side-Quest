import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, fileUrl } from "../../lib/api";
import { toast } from "sonner";
import {
  Upload,
  Send,
  Loader2,
  Image as ImgIcon,
  Mic,
  Film,
  FileText,
  ArrowLeft,
  Printer,
  Target,
  ExternalLink,
  CheckCircle2,
  Lock
} from "lucide-react";
import PetCompanion from "../../components/shared/PetCompanion";
import QuestBanner from "../../components/shared/QuestBanner";
import QuestQuiz from "../../components/shared/QuestQuiz";
import TeachStep from "../../components/shared/QuestTeach";
import {
  RevealCards,
  SortActivity,
  ChoiceSet,
  SentenceBuilder,
  Planner
} from "../../components/shared/QuestActivities";
import { Leaf } from "../../components/shared/Botanical";

const cleanStepTitle = (title = "") =>
  title.replace(/^(\S+\s)?Step \d+:\s*/, "$1");

const hasScoredQuiz = (lesson) =>
  (lesson?.quiz || []).some((q) => q.type !== "short_answer");

const CONTINUE_STYLE = { backgroundColor: "#1F3B2D", color: "#F5EFE0" };

const progressKey = (aid) => `sidequest-progress-${aid}`;

const shuffled = (arr, isBad) => {
  let out = arr;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    out = [...arr];

    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }

    const same = out.every((item, i) => item === arr[i]);

    if (!same && !(isBad && isBad(out))) return out;
  }

  return out;
};

const sortIsPredictable = (items, bucketCount) =>
  items.every((item, i) => item.answer === i % bucketCount);

const shuffleQuestion = (q) => {
  const order = shuffled(q.options.map((_, i) => i));

  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correct_index:
      typeof q.correct_index === "number"
        ? order.indexOf(q.correct_index)
        : q.correct_index
  };
};

export default function ChildLesson() {
  const { aid } = useParams();
  const nav = useNavigate();

  const [a, setA] = useState(null);
  const [response, setResponse] = useState("");
  const [promptAnswer, setPromptAnswer] = useState("");
  const [reflection, setReflection] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [quizResult, setQuizResult] = useState(null);
  const [plan, setPlan] = useState({});
  const [done, setDone] = useState({});
  const [skipped, setSkipped] = useState({});
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(0);
  const [sortActivity, setSortActivity] = useState(null);
  const [wordQsMixed, setWordQsMixed] = useState(null);
  const [restored, setRestored] = useState(false);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeResponse, setChallengeResponse] = useState("");
  const [challengeFiles, setChallengeFiles] = useState([]);

  const fileRef = useRef();
  const chFileRef = useRef();

  useEffect(() => {
    api.get(`/assignments/${aid}`).then((result) => {
      const lesson = result.data.lesson || {};

      if (lesson.sort_activity?.items?.length) {
        const bucketCount = (lesson.sort_activity.buckets || []).length || 3;

        setSortActivity({
          ...lesson.sort_activity,
          items: shuffled(lesson.sort_activity.items, (list) =>
            sortIsPredictable(list, bucketCount)
          )
        });
      }

      if (lesson.word_challenges?.length) {
        setWordQsMixed(shuffled(lesson.word_challenges).map(shuffleQuestion));
      }

      try {
        const raw = window.localStorage.getItem(progressKey(aid));

        if (raw) {
          const saved = JSON.parse(raw);

          setDone(saved.done || {});
          setSkipped(saved.skipped || {});
          setCurrent(saved.current || 0);
          setOpen(typeof saved.open === "number" ? saved.open : 0);
          setPlan(saved.plan || {});
          setResponse(saved.response || "");
          setPromptAnswer(saved.promptAnswer || "");
          setReflection(saved.reflection || "");
          setFiles(saved.files || []);
          setNeedsHelp(!!saved.needsHelp);
          setQuizResult(saved.quizResult || null);
        }
      } catch {
        // ignore unreadable saved progress
      }

      setA(result.data);
      setRestored(true);

      if (result.data.status === "not_started") {
        api.put(`/assignments/${aid}/status?status=opened`).catch(() => {});
      }

      if (result.data.submissions?.length > 0) {
        setSubmitted(true);
      }
    });
  }, [aid]);

  useEffect(() => {
    if (!restored) return;

    try {
      window.localStorage.setItem(
        progressKey(aid),
        JSON.stringify({
          done,
          skipped,
          current,
          open,
          plan,
          response,
          promptAnswer,
          reflection,
          files,
          needsHelp,
          quizResult
        })
      );
    } catch {
      // storage full or blocked; progress just will not be saved
    }
  }, [
    restored,
    aid,
    done,
    skipped,
    current,
    open,
    plan,
    response,
    promptAnswer,
    reflection,
    files,
    needsHelp,
    quizResult
  ]);

  const mark = (key) => (value) =>
    setDone((d) => (d[key] === value ? d : { ...d, [key]: value }));

  const uploadFile = async (file, setter) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("context", "submission");

    try {
      const { data } = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setter((current) => [...current, data]);
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const quizRequired = hasScoredQuiz(a?.lesson);
  const quizPassed = !quizRequired || !!quizResult?.passed;

  const submit = async () => {
    const lesson = a.lesson || {};

    if (!quizPassed) {
      toast.error("Clear the quiz (90% or more) before submitting");
      return;
    }

    if (!response.trim() && files.length === 0) {
      toast.error("Add your finished work or upload a photo of it");
      return;
    }

    setSubmitting(true);

    const quizLine = quizResult
      ? `[Quiz: ${quizResult.score}/${quizResult.total} (${quizResult.percent}%), attempt ${quizResult.attempt}, PASSED]\n`
      : "";

    const planLine = (lesson.planner_fields || []).length
      ? `[Plan] ${lesson.planner_fields
          .map((f) => `${f.key}: ${(plan[f.key] || "").trim()}`)
          .join(" | ")}\n`
      : "";

    const answerLine =
      promptAnswer.trim() && lesson.response_prompt
        ? `\n\n[Answer to "${lesson.response_prompt}"] ${promptAnswer.trim()}`
        : "";

    try {
      await api.post("/submissions", {
        assignment_id: aid,
        response_text: `${quizLine}${planLine}${response}${answerLine}`,
        reflection,
        file_ids: files.map((file) => file.id),
        needs_help: needsHelp
      });

      toast.success(
        needsHelp
          ? "Sent for help"
          : "Submitted! Try a follow-up challenge 🌱"
      );

      setSubmitted(true);
    } catch {
      toast.error("Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const submitChallenge = async () => {
    if (!challengeResponse.trim() && challengeFiles.length === 0) {
      toast.error("Show your work");
      return;
    }

    try {
      await api.post("/submissions", {
        assignment_id: aid,
        response_text: `[Challenge: ${activeChallenge.title}] ${challengeResponse}`,
        file_ids: challengeFiles.map((file) => file.id),
        needs_help: false
      });

      toast.success(`Challenge complete! ${activeChallenge.title} ✨`);
      setActiveChallenge(null);
      setChallengeResponse("");
      setChallengeFiles([]);
    } catch {
      toast.error("Failed");
    }
  };

  const printLesson = () => {
    const l = a.lesson;
    const w = window.open("", "_blank");

    w.document.write(`
      <html>
        <head>
          <title>${l.title}</title>
          <style>
            body {
              font-family: Georgia, serif;
              max-width: 720px;
              margin: 40px auto;
              padding: 0 20px;
            }
            h1 { font-size: 22px; }
            h2 {
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #555;
              margin-top: 20px;
            }
            p, li { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${l.title}</h1>
          <p>Stage ${l.stage} · ${l.learning_area}</p>

          <h2>Your mission</h2>
          <p>${l.child_mission || l.learning_intention || ""}</p>

          <h2>Success criteria</h2>
          <ul>
            ${(l.success_criteria || [])
              .map((criterion) => `<li>${criterion}</li>`)
              .join("")}
          </ul>

          <h2>Lesson steps</h2>
          <ol>
            ${(l.steps || [])
              .map(
                (step) =>
                  `<li><strong>${cleanStepTitle(step.title)}</strong><br/>${step.detail}</li>`
              )
              .join("")}
          </ol>

          <h2>Explicit teaching</h2>
          <p>${(l.explicit_teaching || "").replace(/\n/g, "<br/>")}</p>

          <h2>Worked example</h2>
          <p>${l.worked_example || ""}</p>

          <h2>Guided practice</h2>
          <p>${l.guided_practice || ""}</p>

          <h2>Independent task</h2>
          <p>${l.independent_task || ""}</p>

          <h2>Offline alternative</h2>
          <p>${l.offline_alternative || ""}</p>

          <br/>
          <br/>
          <div style="border-top: 1px dashed #333; padding-top: 10px">
            My finished work:
            <br/><br/><br/><br/>
          </div>
        </body>
      </html>
    `);

    w.document.close();
    w.print();
  };

  if (!a) {
    return <div className="text-stone-500">Loading…</div>;
  }

  const l = a.lesson || {};

  const embeds = (l.resources || []).filter(
    (r) => r.type === "video" && r.embed_url
  );
  const links = (l.resources || []).filter(
    (r) => !(r.type === "video" && r.embed_url)
  );
  const flip = (l.interactive_activities || []).find(
    (x) => x.type === "flip_cards"
  );
  const teachSteps = l.teach_steps || [];
  const wordQs = wordQsMixed || l.word_challenges || [];
  const sortData = sortActivity || l.sort_activity;
  const builder = l.suspense_builder;
  const plannerFields = l.planner_fields || [];

  const stages = [
    { key: "accept", icon: "📜", title: "Accept the quest" },
    ...teachSteps.map((step, i) => ({
      key: `teach${i}`,
      icon: step.icon || "📖",
      title: `Lesson ${i + 1}: ${step.title}`
    })),
    {
      key: "learn",
      icon: "🧭",
      title: teachSteps.length > 0 ? "Put it all together" : "Learn the map"
    },
    sortData && { key: "sort", icon: "🧩", title: "Spot the structure" },
    embeds.length > 0 && { key: "watch", icon: "🎬", title: "Watch and notice" },
    (wordQs.length > 0 || builder) && {
      key: "words",
      icon: "💎",
      title: "Word power"
    },
    plannerFields.length > 0 && {
      key: "plan",
      icon: "🗺️",
      title: "Plan your work"
    },
    { key: "write", icon: "✍️", title: "Do the task" },
    quizRequired && { key: "quiz", icon: "🛡️", title: "Quest check" },
    { key: "submit", icon: "🏆", title: "Hand it in" }
  ].filter(Boolean);

  const planOk = plannerFields.every(
    (f) => (plan[f.key] || "").trim().length >= 3
  );

  const stageDone = (key) => {
    if (skipped[key]) return true;

    switch (key) {
      case "accept":
        return !!done.accept;
      case "learn":
        return !!done.learn;
      case "sort":
        return !!done.sort;
      case "watch":
        return embeds.every((_, i) => done[`watch${i}`]);
      case "words":
        return (
          (wordQs.length === 0 || !!done.wordsA) &&
          (!builder || !!done.wordsB)
        );
      case "plan":
        return planOk;
      case "write":
        return response.trim().length > 0 || files.length > 0;
      case "quiz":
        return quizPassed;
      case "submit":
        return submitted;
      default:
        return !!done[key];
    }
  };

  const advance = (from) => {
    const next = Math.min(from + 1, stages.length - 1);
    setCurrent((c) => Math.max(c, next));
    setOpen(next);
  };

  const skipStage = (key) => {
    if (
      window.confirm(
        "Grown-up check: skip this activity? Only do this if it is not working."
      )
    ) {
      setSkipped((s) => ({ ...s, [key]: true }));
    }
  };

  const completed = stages.filter((s) => stageDone(s.key)).length;
  const percent = Math.round((completed / stages.length) * 100);

  const supportBanner =
    a.support_level === "red"
      ? {
          cls: "bg-rose-50 border-rose-200 text-rose-900",
          text: "Red zone — wait for a grown-up before starting"
        }
      : a.support_level === "yellow"
        ? {
            cls: "bg-amber-50 border-amber-200 text-amber-900",
            text: "Yellow — try it, then ask for help if you get stuck"
          }
        : {
            cls: "bg-emerald-50 border-emerald-200 text-emerald-900",
            text: "Green — have a go on your own"
          };

  const renderBody = (key) => {
    if (key.startsWith("teach")) {
      const index = Number(key.replace("teach", ""));

      return (
        <TeachStep step={teachSteps[index]} onComplete={mark(key)} />
      );
    }

    switch (key) {
      case "accept":
        return (
          <div>
            <p
              className="font-display text-xl font-bold"
              style={{ color: "#1F3B2D" }}
            >
              {l.child_mission || l.learning_intention}
            </p>

            <p className="text-sm mt-3 text-stone-700">
              Don't worry if this is new. You will learn each idea one small
              step at a time, with an example and a quick try before moving on.
            </p>

            {(l.success_criteria || []).length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-mono uppercase text-stone-500">
                  By the end you will be able to
                </div>

                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                  {l.success_criteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-sm mt-4">
              <strong>You will need:</strong>{" "}
              {(l.materials || []).join(", ") || "Nothing special"}
            </p>

            {!done.accept ? (
              <button
                type="button"
                onClick={() => {
                  mark("accept")(true);
                  advance(0);
                }}
                className="mt-5 rounded-full px-6 py-3 text-base font-bold"
                style={{ backgroundColor: "#C77B5B", color: "#F5EFE0" }}
                data-testid="accept-quest"
              >
                ⚔️ I accept this quest!
              </button>
            ) : (
              <p className="mt-4 text-sm font-bold text-green-800">
                Quest accepted. Good luck, explorer!
              </p>
            )}
          </div>
        );

      case "learn":
        return (
          <div className="space-y-4">
            {teachSteps.length === 0 && (
              <div className="whitespace-pre-wrap text-sm">
                {l.explicit_teaching}
              </div>
            )}

            {l.worked_example && (
              <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-sm">
                <div className="font-bold mb-1">
                  {teachSteps.length > 0
                    ? "Here is a whole story with every part. Read it slowly."
                    : "Read this example"}
                </div>
                {l.worked_example}
              </div>
            )}

            {flip && (
              <div>
                <div className="font-bold text-sm mb-2">{flip.title}</div>
                <RevealCards
                  cards={flip.cards || []}
                  onComplete={mark("learn")}
                />
              </div>
            )}

            {!flip && (
              <button
                type="button"
                onClick={mark("learn")}
                className="rounded-full px-5 py-2 text-sm font-bold"
                style={CONTINUE_STYLE}
              >
                I have read it
              </button>
            )}
          </div>
        );

      case "sort":
        return <SortActivity activity={sortData} onComplete={mark("sort")} />;

      case "watch":
        return (
          <div className="space-y-5">
            {embeds.map((resource, i) => (
              <div
                key={i}
                className="rounded-xl border p-3 bg-white"
                style={{ borderColor: "#D4C8A8" }}
              >
                <div className="font-semibold text-sm mb-2">
                  🎬 {resource.title}
                </div>

                <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <iframe
                    src={resource.embed_url}
                    title={resource.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: "#4A5D3A" }}
                  >
                    <ExternalLink size={12} />
                    Video not playing? Open it with a grown-up
                  </a>
                )}

                {resource.prompt && (
                  <p className="text-xs text-stone-700 mt-2">{resource.prompt}</p>
                )}

                <div className="mt-3">
                  {resource.check ? (
                    <ChoiceSet
                      questions={[resource.check]}
                      onComplete={mark(`watch${i}`)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => mark(`watch${i}`)(true)}
                      className="rounded-full px-5 py-2 text-sm font-bold"
                      style={CONTINUE_STYLE}
                    >
                      I watched it
                    </button>
                  )}
                </div>
              </div>
            ))}

            {links.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-stone-500">
                  Optional extras (with a grown-up)
                </div>

                {links.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl p-3 border bg-white hover:bg-stone-50 text-sm"
                    style={{ borderColor: "#D4C8A8" }}
                  >
                    📖 {resource.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        );

      case "words":
        return (
          <div className="space-y-5">
            {wordQs.length > 0 && (
              <div>
                <p className="text-sm text-stone-700 mb-3">
                  Pick the best word for each sentence.
                </p>
                <ChoiceSet questions={wordQs} onComplete={mark("wordsA")} />
              </div>
            )}

            {builder && (
              <SentenceBuilder builder={builder} onComplete={mark("wordsB")} />
            )}
          </div>
        );

      case "plan":
        return (
          <div>
            <p className="text-sm text-stone-700 mb-3">
              Good writers plan first. Fill in each box with a few words.
            </p>

            <Planner
              fields={plannerFields}
              values={plan}
              setValues={setPlan}
              onComplete={() => {}}
            />
          </div>
        );

      case "write":
        return (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm space-y-2">
              <div className="font-bold">What to do</div>

              <ol className="list-decimal pl-5 space-y-1">
                <li>{l.independent_task}</li>
                <li>
                  Type your finished work in the big box below, or write it on
                  paper and upload a photo.
                </li>
                {l.response_prompt && (
                  <li>
                    Then answer the question in the small box: "
                    {l.response_prompt}"
                  </li>
                )}
              </ol>
            </div>

            {plannerFields.length > 0 && (
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-sm">
                <div className="font-bold mb-1">Your plan</div>

                {plannerFields.map((f) => (
                  <div key={f.key}>
                    <strong>{f.label}:</strong> {plan[f.key]}
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-sm font-bold">Your finished work</label>

              <textarea
                rows={8}
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Type here… or leave empty and upload a photo of your paper work"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-base bg-white"
                style={{ borderColor: "#D4C8A8" }}
                data-testid="response-text"
              />
            </div>

            {l.response_prompt && (
              <div>
                <label className="text-sm font-bold">
                  Your answer: {l.response_prompt}
                </label>

                <textarea
                  rows={2}
                  value={promptAnswer}
                  onChange={(event) => setPromptAnswer(event.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                  style={{ borderColor: "#D4C8A8" }}
                />
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*,audio/*,video/*,application/pdf"
              onChange={(event) =>
                event.target.files[0] &&
                uploadFile(event.target.files[0], setFiles)
              }
              className="hidden"
              data-testid="file-input"
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-xl border-2 border-dashed w-full p-5 flex flex-col items-center gap-1 hover:bg-stone-50 disabled:opacity-50"
              style={{ borderColor: "#D4C8A8" }}
              data-testid="upload-btn"
            >
              {uploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Upload size={20} />
              )}

              <span className="text-sm font-bold">
                {uploading
                  ? "Uploading…"
                  : "Add a photo, recording or PDF of your work"}
              </span>
            </button>

            {files.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {files.map((file) => (
                  <FilePreview key={file.id} file={file} />
                ))}
              </div>
            )}

            <div>
              <label className="text-sm font-bold">Reflect (optional)</label>

              <textarea
                rows={2}
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder={
                  l.reflection_prompts?.[0] ||
                  l.reflection_prompt ||
                  "What did you learn? What was tricky?"
                }
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                style={{ borderColor: "#D4C8A8" }}
                data-testid="reflection-text"
              />
            </div>
          </div>
        );

      case "quiz":
        return (
          <QuestQuiz
            quiz={l.quiz}
            passMark={l.pass_mark || 0.9}
            onResult={setQuizResult}
          />
        );

      case "submit":
        return (
          <div className="space-y-3">
            <p className="text-sm">
              You have finished every stage. Hand in your work for a grown-up to
              review.
            </p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={needsHelp}
                onChange={(event) => setNeedsHelp(event.target.checked)}
                className="mt-1 h-5 w-5"
                data-testid="needs-help"
              />

              <span className="text-sm">
                I need help from a grown-up before I finish this.
              </span>
            </label>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={submit}
                disabled={submitting || submitted || !quizPassed}
                className="rounded-full px-6 py-3 text-sm font-bold hover:translate-y-[-1px] transition disabled:opacity-50 flex items-center gap-2"
                style={CONTINUE_STYLE}
                data-testid="submit-work"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 size={14} />
                    Submitted
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    {needsHelp ? "Send for help" : "Submit for review"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={printLesson}
                className="rounded-full border px-4 py-3 text-sm font-bold flex items-center gap-2"
                style={{ borderColor: "#D4C8A8" }}
                data-testid="print-btn"
              >
                <Printer size={14} />
                Print
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 animate-in relative" data-testid="child-lesson">
      <Leaf
        className="absolute right-0 top-0 opacity-40"
        size={60}
        color="#6B8A5B"
      />

      <button
        type="button"
        onClick={() => nav("/child")}
        className="text-sm font-bold flex items-center gap-1"
        style={{ color: "#4A5D3A" }}
        data-testid="back-home"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <header className="paper-card p-6 relative overflow-hidden">
        <QuestBanner lesson={l} />

        <div className="text-xs font-mono text-stone-500">
          {l.stage} · {l.learning_area}
        </div>

        <h1
          className="font-display text-3xl font-bold mt-1"
          style={{ color: "#1F3B2D" }}
        >
          {l.title}
        </h1>

        <div
          className={`mt-4 rounded-xl border px-4 py-2 text-sm ${supportBanner.cls}`}
          data-testid="support-banner"
        >
          {supportBanner.text}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs font-mono text-stone-500">
            <span>
              Quest progress: {completed} of {stages.length} stages
            </span>
            <span>{percent}%</span>
          </div>

          <div className="h-2 rounded-full bg-stone-200 mt-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${percent}%`, backgroundColor: "#4A5D3A" }}
            />
          </div>
        </div>
      </header>

      <div className="space-y-3">
        {stages.map((stage, i) => {
          const unlocked = i <= current;
          const finished = stageDone(stage.key);
          const isOpen = open === i && unlocked;
          const canSkip =
            isOpen &&
            !finished &&
            ["sort", "watch", "words"].includes(stage.key);

          return (
            <section
              key={stage.key}
              className="paper-card overflow-hidden"
              data-testid={`stage-${stage.key}`}
            >
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center gap-3 p-4 text-left disabled:opacity-60"
              >
                <span className="text-xl">{unlocked ? stage.icon : ""}</span>

                {!unlocked && <Lock size={16} className="text-stone-400" />}

                <span className="flex-1">
                  <span className="block text-[10px] font-mono uppercase text-stone-500">
                    Stage {i + 1} of {stages.length}
                  </span>

                  <span
                    className="font-display text-lg font-semibold"
                    style={{ color: "#1F3B2D" }}
                  >
                    {stage.title}
                  </span>
                </span>

                {finished && (
                  <CheckCircle2 size={20} className="text-green-700" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5">
                  {renderBody(stage.key)}

                  {stage.key !== "accept" &&
                    stage.key !== "submit" &&
                    i < stages.length - 1 && (
                      <div className="mt-5 flex items-center gap-3 flex-wrap">
                        <button
                          type="button"
                          disabled={!finished}
                          onClick={() => advance(i)}
                          className="rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-40"
                          style={CONTINUE_STYLE}
                          data-testid={`continue-${stage.key}`}
                        >
                          {finished
                            ? "Continue to the next stage →"
                            : "Finish this stage to continue"}
                        </button>

                        {canSkip && (
                          <button
                            type="button"
                            onClick={() => skipStage(stage.key)}
                            className="text-xs underline text-stone-500"
                          >
                            Grown-up: skip this activity
                          </button>
                        )}
                      </div>
                    )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {l.follow_up_challenges?.length > 0 && (
        <div
          className="paper-card p-6"
          style={{ backgroundColor: "#F0F4E8", borderColor: "#94A47F" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} style={{ color: "#4A5D3A" }} />

            <h2
              className="font-display text-xl font-bold"
              style={{ color: "#1F3B2D" }}
            >
              Prove it! Follow-up challenges
            </h2>
          </div>

          <p className="text-sm text-stone-700 mb-4">
            {submitted
              ? "Pick a challenge to really show you've got it. Submit any and earn bonus pet XP."
              : "Submit your main task first — then these unlock."}
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            {l.follow_up_challenges.map((challenge, index) => (
              <button
                key={index}
                type="button"
                onClick={() => submitted && setActiveChallenge(challenge)}
                disabled={!submitted}
                className={`rounded-xl p-4 text-left border bg-white transition ${
                  submitted
                    ? "hover:border-moss hover:translate-y-[-2px] cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
                style={{
                  borderColor: submitted ? "#4A5D3A" : "#D4C8A8"
                }}
                data-testid={`challenge-${index}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!submitted && <Lock size={10} className="text-stone-400" />}

                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    {challenge.type?.replace(/_/g, " ")}
                  </span>

                  <span
                    className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      challenge.difficulty === "stretch"
                        ? "bg-rose-100 text-rose-900"
                        : challenge.difficulty === "medium"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-emerald-100 text-emerald-900"
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>

                <div
                  className="font-display font-bold text-sm"
                  style={{ color: "#1F3B2D" }}
                >
                  {challenge.title}
                </div>

                <div className="text-xs text-stone-600 mt-1">
                  {challenge.description}
                </div>

                <div className="text-[10px] mt-2 font-mono text-stone-500">
                  Show: {challenge.evidence_type}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeChallenge && (
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveChallenge(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg paper-card p-6"
            data-testid="challenge-modal"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-script text-xl" style={{ color: "#C77B5B" }}>
                Follow-up challenge
              </div>

              <button
                type="button"
                onClick={() => setActiveChallenge(null)}
                aria-label="Close challenge"
              >
                <ArrowLeft size={18} />
              </button>
            </div>

            <h3
              className="font-display text-2xl font-bold"
              style={{ color: "#1F3B2D" }}
            >
              {activeChallenge.title}
            </h3>

            <p className="mt-2 text-sm">{activeChallenge.description}</p>

            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
                What you did
              </label>

              <textarea
                rows={4}
                value={challengeResponse}
                onChange={(event) => setChallengeResponse(event.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                style={{ borderColor: "#D4C8A8" }}
                data-testid="challenge-response"
              />
            </div>

            <input
              ref={chFileRef}
              type="file"
              accept="image/*,audio/*,video/*,application/pdf"
              onChange={(event) =>
                event.target.files[0] &&
                uploadFile(event.target.files[0], setChallengeFiles)
              }
              className="hidden"
            />

            <button
              type="button"
              onClick={() => chFileRef.current?.click()}
              className="mt-3 w-full rounded-xl border-2 border-dashed p-3 text-sm font-bold flex items-center justify-center gap-2"
              style={{ borderColor: "#D4C8A8" }}
              data-testid="challenge-upload"
            >
              <Upload size={14} />
              Add evidence ({activeChallenge.evidence_type})
            </button>

            {challengeFiles.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {challengeFiles.map((file) => (
                  <FilePreview key={file.id} file={file} />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={submitChallenge}
              className="mt-4 w-full rounded-full py-3 text-sm font-bold"
              style={{ backgroundColor: "#C77B5B", color: "#F5EFE0" }}
              data-testid="submit-challenge"
            >
              Submit challenge
            </button>
          </div>
        </div>
      )}

      <PetCompanion lessonId={l.id} />
    </div>
  );
}

const FilePreview = ({ file }) => {
  const Icon = file.content_type?.startsWith("image/")
    ? ImgIcon
    : file.content_type?.startsWith("audio/")
      ? Mic
      : file.content_type?.startsWith("video/")
        ? Film
        : FileText;

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: "#D4C8A8" }}
    >
      {file.content_type?.startsWith("image/") ? (
        <img
          src={fileUrl(file.id)}
          alt={file.original_filename}
          className="w-full h-20 object-cover"
        />
      ) : (
        <div className="h-20 bg-stone-50 grid place-items-center text-stone-500">
          <Icon size={20} />
        </div>
      )}

      <div className="p-1 text-[10px] truncate">{file.original_filename}</div>
    </div>
  );
};
