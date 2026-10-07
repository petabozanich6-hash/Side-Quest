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
import { Leaf } from "../../components/shared/Botanical";

const cleanStepTitle = (title = "") =>
  title.replace(/^(\S+\s)?Step \d+:\s*/, "$1");

export default function ChildLesson() {
  const { aid } = useParams();
  const nav = useNavigate();

  const [a, setA] = useState(null);
  const [response, setResponse] = useState("");
  const [reflection, setReflection] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeResponse, setChallengeResponse] = useState("");
  const [challengeFiles, setChallengeFiles] = useState([]);

  const fileRef = useRef();
  const chFileRef = useRef();

  useEffect(() => {
    api.get(`/assignments/${aid}`).then((result) => {
      setA(result.data);

      if (result.data.status === "not_started") {
        api.put(`/assignments/${aid}/status?status=opened`).catch(() => {});
      }

      if (result.data.submissions?.length > 0) {
        setSubmitted(true);
      }
    });
  }, [aid]);

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

  const submit = async () => {
    if (!response.trim() && files.length === 0) {
      toast.error("Add a written response or upload your work");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/submissions", {
        assignment_id: aid,
        response_text: response,
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
            My response:
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

  const multipleChoiceQuestions = (l.quiz || []).filter(
    (question) => question.type !== "short_answer"
  );

  const correctMultipleChoiceAnswers = multipleChoiceQuestions.filter(
    (question) => {
      const originalIndex = l.quiz.indexOf(question);
      return quizAnswers[originalIndex] === question.correct_index;
    }
  ).length;

  const quizComplete =
    l.quiz?.length > 0 &&
    l.quiz.every((question, index) => {
      const answer = quizAnswers[index];

      if (question.type === "short_answer") {
        return typeof answer === "string" && answer.trim().length > 0;
      }

      return typeof answer === "number";
    });

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
      </header>

      {l.child_mission && (
        <div className="paper-card p-6">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Your mission
          </div>

          <p
            className="font-display text-xl font-bold mt-2"
            style={{ color: "#1F3B2D" }}
          >
            {l.child_mission}
          </p>
        </div>
      )}

      <Step n="1" title="What am I learning?">
        <p className="text-base">
          {l.child_mission || l.learning_intention}
        </p>
      </Step>

      <Step n="2" title="How I'll know I've got it">
        <ul className="list-disc pl-5 space-y-1">
          {(l.success_criteria || []).map((criterion, index) => (
            <li key={index}>{criterion}</li>
          ))}
        </ul>
      </Step>

      <Step n="3" title="What I need">
        <p className="text-sm">
          {(l.materials || []).join(", ") || "Nothing special"}
        </p>
      </Step>

      {l.steps?.length > 0 && (
        <Step n="3b" title="Your quest route">
          <ol className="space-y-3">
            {l.steps.map((step, index) => (
              <li
                key={index}
                className="rounded-xl border p-4 bg-white"
                style={{ borderColor: "#D4C8A8" }}
              >
                <div className="font-bold">
                  {index + 1}. {cleanStepTitle(step.title)}
                </div>

                <p className="text-sm text-stone-700 mt-1">
                  {step.detail}
                </p>

                {step.duration_minutes && (
                  <div className="text-xs font-mono text-stone-500 mt-1">
                    {step.duration_minutes} minutes
                  </div>
                )}
              </li>
            ))}
          </ol>
        </Step>
      )}

      {l.key_vocabulary?.length > 0 && (
        <Step n="4" title="Key words">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {l.key_vocabulary.map((word, index) => (
              <li
                key={index}
                className="rounded-lg bg-white border border-stone-200 p-2"
              >
                {word}
              </li>
            ))}
          </ul>
        </Step>
      )}

      <Step n="5" title="Let's learn">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
          {l.explicit_teaching}
        </div>
      </Step>

      {l.interactive_activities?.map((activity, index) => {
        if (activity.type === "flip_cards") {
          return (
            <Step key={index} n={`5c-${index}`} title={activity.title}>
              <FlipCards cards={activity.cards || []} />
            </Step>
          );
        }

        return null;
      })}

      {l.resources?.length > 0 && (
        <Step n="5b" title="Watch and play">
          <div className="space-y-4">
            {l.resources.map((resource, index) => {
              if (resource.type === "video" && resource.embed_url) {
                return (
                  <div
                    key={index}
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
                      <p className="text-xs text-stone-700 mt-2">
                        {resource.prompt}
                      </p>
                    )}

                    {resource.offline_alternative && (
                      <p className="text-xs text-stone-500 mt-2">
                        <strong>No internet?</strong>{" "}
                        {resource.offline_alternative}
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl p-3 border bg-white hover:bg-stone-50"
                  style={{ borderColor: "#D4C8A8" }}
                >
                  <div className="font-semibold text-sm">
                    {resource.type === "video"
                      ? "🎬"
                      : resource.type === "article"
                        ? "📖"
                        : "🎮"}{" "}
                    {resource.title}
                  </div>

                  <div className="text-xs text-stone-600 mt-0.5">
                    Tap to open
                  </div>
                </a>
              );
            })}
          </div>
        </Step>
      )}

      {l.suggested_resources?.length > 0 && (
        <Step n="6" title="Explore further (optional)">
          <p className="text-sm text-stone-600 mb-3">
            These are places your parent can help you find. Ask them first
            before opening anything online.
          </p>

          <div className="space-y-2">
            {l.suggested_resources.map((resource, index) => (
              <div
                key={index}
                className="rounded-xl p-3 border bg-white"
                style={{ borderColor: "#D4C8A8" }}
                data-testid={`res-${index}`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className="h-8 w-8 rounded-lg grid place-items-center shrink-0"
                    style={{ backgroundColor: "#F5EFE0", color: "#4A5D3A" }}
                  >
                    <ExternalLink size={14} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">
                      {resource.title}
                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider ml-1">
                        {resource.type}
                      </span>
                    </div>

                    {resource.provider && (
                      <div className="text-[11px] font-mono text-stone-500">
                        {resource.provider}
                        {resource.legally_free ? " · free" : ""}
                      </div>
                    )}

                    <div className="text-xs text-stone-600 mt-0.5">
                      {resource.purpose}
                    </div>

                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs mt-1 inline-flex items-center gap-1 font-semibold"
                        style={{ color: "#4A5D3A" }}
                      >
                        <ExternalLink size={10} />
                        Open {resource.provider || "resource"}
                      </a>
                    )}

                    {resource.where_to_find && (
                      <div className="text-xs italic mt-1 text-stone-500">
                        Search: "{resource.where_to_find}"
                      </div>
                    )}

                    {resource.offline_alternative && (
                      <div className="text-xs mt-1 text-stone-500">
                        <strong>No internet?</strong>{" "}
                        {resource.offline_alternative}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Step>
      )}

      {l.worked_example && (
        <Step n="7" title="Example">
          <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-sm">
            {l.worked_example}
          </div>
        </Step>
      )}

      {l.guided_practice && (
        <Step n="8" title="Try with me">
          <p className="text-sm">{l.guided_practice}</p>
        </Step>
      )}

      <Step n="9" title="My task">
        <p className="text-base">{l.independent_task}</p>

        {l.response_prompt && (
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm">
            <strong>Respond to:</strong> {l.response_prompt}
          </div>
        )}
      </Step>

      {l.quiz?.length > 0 && (
        <Step n="9b" title="Quick check">
          <div className="space-y-4">
            {l.quiz.map((question, questionIndex) => {
              const selected = quizAnswers[questionIndex];

              if (question.type === "short_answer") {
                return (
                  <div
                    key={questionIndex}
                    className="rounded-xl border p-4 bg-white"
                    style={{ borderColor: "#D4C8A8" }}
                  >
                    <p className="font-semibold">
                      {questionIndex + 1}. {question.question}
                    </p>

                    <textarea
                      rows={4}
                      value={quizAnswers[questionIndex] || ""}
                      onChange={(event) =>
                        setQuizAnswers((current) => ({
                          ...current,
                          [questionIndex]: event.target.value
                        }))
                      }
                      disabled={quizSubmitted}
                      placeholder="Type your answer here…"
                      className="mt-3 w-full rounded-lg border px-3 py-2 text-sm bg-white"
                      style={{ borderColor: "#D4C8A8" }}
                    />

                    {quizSubmitted && (
                      <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-stone-700">
                        <p>
                          <strong>Suggested answer:</strong>{" "}
                          {question.sample_answer ||
                            question.explanation ||
                            "Use the marking guide to review your answer."}
                        </p>

                        {question.marking_guide && (
                          <p className="mt-2">
                            <strong>Check:</strong> {question.marking_guide}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              const options = question.options || [];

              return (
                <div
                  key={questionIndex}
                  className="rounded-xl border p-4 bg-white"
                  style={{ borderColor: "#D4C8A8" }}
                >
                  <p className="font-semibold">
                    {questionIndex + 1}. {question.question}
                  </p>

                  <div className="mt-3 space-y-2">
                    {options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrect =
                        optionIndex === question.correct_index;

                      let className =
                        "w-full text-left px-3 py-2 rounded-lg border transition";

                      if (quizSubmitted && isCorrect) {
                        className +=
                          " border-green-500 bg-green-50 text-green-800";
                      } else if (
                        quizSubmitted &&
                        isSelected &&
                        !isCorrect
                      ) {
                        className +=
                          " border-red-500 bg-red-50 text-red-800";
                      } else if (isSelected) {
                        className +=
                          " border-blue-500 bg-blue-50 text-blue-800";
                      } else {
                        className +=
                          " border-stone-200 hover:border-blue-300";
                      }

                      return (
                        <button
                          key={optionIndex}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((current) => ({
                              ...current,
                              [questionIndex]: optionIndex
                            }))
                          }
                          className={className}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && question.explanation && (
                    <p className="mt-2 text-sm text-stone-700">
                      {question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              type="button"
              onClick={() => setQuizSubmitted(true)}
              disabled={!quizComplete}
              className="mt-4 rounded-full px-5 py-2 text-sm font-bold disabled:opacity-50"
              style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}
            >
              Check my answers
            </button>
          ) : (
            <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-3 text-green-900">
              <p className="font-bold">
                You got {correctMultipleChoiceAnswers} of{" "}
                {multipleChoiceQuestions.length} multiple-choice questions
                correct.
              </p>

              <p className="text-sm mt-2">
                Check the suggested answer for the written question.
              </p>
            </div>
          )}
        </Step>
      )}

      <Step n="10" title="My response">
        <textarea
          rows={5}
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="Type your answer here… (or upload a photo of your paper work below)"
          className="w-full rounded-lg border px-3 py-2 text-base bg-white"
          style={{ borderColor: "#D4C8A8" }}
          data-testid="response-text"
        />
      </Step>

      <Step n="11" title="Upload my work">
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
          className="rounded-xl border-2 border-dashed w-full p-6 flex flex-col items-center gap-2 hover:bg-stone-50 disabled:opacity-50"
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
              : "Tap to add photo, audio, video or PDF"}
          </span>

          <span className="text-xs text-stone-500">
            Great for paper work, drawings, recordings
          </span>
        </button>

        {files.length > 0 && (
          <div className="mt-3 grid grid-cols-3 md:grid-cols-5 gap-2">
            {files.map((file) => (
              <FilePreview key={file.id} file={file} />
            ))}
          </div>
        )}
      </Step>

      <Step n="12" title="Reflect">
        <textarea
          rows={3}
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
          placeholder={
            l.reflection_prompts?.[0] ||
            l.reflection_prompt ||
            "What did you learn? What was tricky?"
          }
          className="w-full rounded-lg border px-3 py-2 text-sm bg-white"
          style={{ borderColor: "#D4C8A8" }}
          data-testid="reflection-text"
        />
      </Step>

      <div className="paper-card p-6 space-y-3">
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
            disabled={submitting || submitted}
            className="rounded-full px-6 py-3 text-sm font-bold hover:translate-y-[-1px] transition disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}
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

const FlipCards = ({ cards }) => {
  const [flipped, setFlipped] = useState({});

  const toggle = (index) => {
    setFlipped((current) => ({
      ...current,
      [index]: !current[index]
    }));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        const isFlipped = !!flipped[index];

        return (
          <button
            key={index}
            type="button"
            onClick={() => toggle(index)}
            className="h-32 rounded-xl border p-3 text-left transition hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-[#4A5D3A]"
            style={{
              borderColor: "#D4C8A8",
              backgroundColor: isFlipped ? "#F0F4E8" : "#FFFFFF"
            }}
          >
            {!isFlipped ? (
              <div>
                <div className="text-[10px] font-mono uppercase text-stone-500">
                  Tap to reveal
                </div>

                <p
                  className="font-display font-bold text-lg mt-1"
                  style={{ color: "#1F3B2D" }}
                >
                  {card.front}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-[10px] font-mono uppercase text-stone-500">
                  Meaning
                </div>

                <p className="text-sm mt-1">{card.back}</p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

const Step = ({ n, title, children }) => (
  <section className="paper-card p-5" data-testid={`step-${n}`}>
    <div className="text-xs font-mono text-stone-500">Step {n}</div>

    <h2
      className="font-display text-lg font-semibold mt-0.5 mb-3"
      style={{ color: "#1F3B2D" }}
    >
      {title}
    </h2>

    <div className="text-stone-800">{children}</div>
  </section>
);

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

      <div className="p-1 text-[10px] truncate">
        {file.original_filename}
      </div>
    </div>
  );
};
