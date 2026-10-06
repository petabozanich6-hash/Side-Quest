import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, fileUrl } from "../../lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  Film,
  Image as ImgIcon,
  Loader2,
  Lock,
  Mic,
  Printer,
  Send,
  Target,
  Upload
} from "lucide-react";
import PetCompanion from "../../components/shared/PetCompanion";
import { Leaf } from "../../components/shared/Botanical";

export default function ChildLesson() {
  const { aid } = useParams();
  const nav = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [response, setResponse] = useState("");
  const [reflection, setReflection] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsHelp, setNeedsHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [unlockedCard, setUnlockedCard] = useState(0);
  const [completedCards, setCompletedCards] = useState({});
  const [completedQuestSteps, setCompletedQuestSteps] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [challengeResponse, setChallengeResponse] = useState("");
  const [challengeFiles, setChallengeFiles] = useState([]);

  const cardRefs = useRef([]);
  const fileRef = useRef();
  const chFileRef = useRef();

  useEffect(() => {
    api.get(`/assignments/${aid}`).then((result) => {
      setAssignment(result.data);

      if (result.data.status === "not_started") {
        api.put(`/assignments/${aid}/status?status=opened`).catch(() => {});
      }

      if (result.data.submissions?.length > 0) {
        setSubmitted(true);
      }
    });
  }, [aid]);

  const completeCard = (cardIndex) => {
    setCompletedCards((current) => ({
      ...current,
      [cardIndex]: true
    }));

    setUnlockedCard((current) => Math.max(current, cardIndex + 1));

    window.setTimeout(() => {
      cardRefs.current[cardIndex + 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 120);
  };

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
    const lesson = assignment.lesson;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>${lesson.title}</title>
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
          <h1>${lesson.title}</h1>
          <p>${lesson.stage} · ${lesson.learning_area}</p>

          <h2>Your mission</h2>
          <p>${lesson.child_mission || lesson.learning_intention || ""}</p>

          <h2>Success criteria</h2>
          <ul>
            ${(lesson.success_criteria || [])
              .map((criterion) => `<li>${criterion}</li>`)
              .join("")}
          </ul>

          <h2>Lesson steps</h2>
          <ol>
            ${(lesson.steps || [])
              .map(
                (step) =>
                  `<li><strong>${step.title}</strong><br/>${step.detail}</li>`
              )
              .join("")}
          </ol>

          <h2>Explicit teaching</h2>
          <p>${(lesson.explicit_teaching || "").replace(/\n/g, "<br/>")}</p>

          <h2>Worked example</h2>
          <p>${lesson.worked_example || ""}</p>

          <h2>Guided practice</h2>
          <p>${lesson.guided_practice || ""}</p>

          <h2>Independent task</h2>
          <p>${lesson.independent_task || ""}</p>

          <br/>
          <br/>
          <div style="border-top: 1px dashed #333; padding-top: 10px">
            My response:
            <br/><br/><br/><br/>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  if (!assignment) {
    return <div className="text-stone-500">Loading…</div>;
  }

  const lesson = assignment.lesson || {};
  const activities = lesson.interactive_activities || [];
  const resources = lesson.resources || [];
  const quiz = lesson.quiz || [];

  const supportBanner =
    assignment.support_level === "red"
      ? {
          cls: "bg-rose-50 border-rose-200 text-rose-900",
          text: "Red zone — wait for a grown-up before starting"
        }
      : assignment.support_level === "yellow"
        ? {
            cls: "bg-amber-50 border-amber-200 text-amber-900",
            text: "Yellow — try it, then ask for help if you get stuck"
          }
        : {
            cls: "bg-emerald-50 border-emerald-200 text-emerald-900",
            text: "Green — have a go on your own"
          };

  const flipActivities = activities.filter(
    (activity) => activity.type === "flip_cards"
  );

  const allFlipCards = flipActivities.flatMap((activity, activityIndex) =>
    (activity.cards || []).map((card, cardIndex) => ({
      ...card,
      activityIndex,
      cardIndex
    }))
  );

  const questStepsFinished =
    lesson.steps?.length > 0 &&
    lesson.steps.every((_, index) => completedQuestSteps[index]);

  const allFlipCardsViewed =
    allFlipCards.length === 0 ||
    allFlipCards.every(
      (card) => flippedCards[`${card.activityIndex}-${card.cardIndex}`]
    );

  const quizComplete =
    quiz.length > 0 &&
    quiz.every((question, index) => {
      const answer = quizAnswers[index];

      if (question.type === "short_answer") {
        return typeof answer === "string" && answer.trim().length > 0;
      }

      return typeof answer === "number";
    });

  const multipleChoiceQuestions = quiz.filter(
    (question) => question.type !== "short_answer"
  );

  const correctMultipleChoiceAnswers = multipleChoiceQuestions.filter(
    (question) => {
      const originalIndex = quiz.indexOf(question);
      return quizAnswers[originalIndex] === question.correct_index;
    }
  ).length;

  const lessonCards = [
    {
      key: "mission",
      n: "1",
      title: "What am I learning?",
      completeLabel: "I understand my mission",
      content: (
        <p className="text-base">
          {lesson.child_mission || lesson.learning_intention}
        </p>
      )
    },

    lesson.success_criteria?.length > 0 && {
      key: "success",
      n: "2",
      title: "How I’ll know I’ve got it",
      completeLabel: "I know what success looks like",
      content: (
        <ul className="list-disc pl-5 space-y-1">
          {lesson.success_criteria.map((criterion, index) => (
            <li key={index}>{criterion}</li>
          ))}
        </ul>
      )
    },

    {
      key: "materials",
      n: "3",
      title: "What I need",
      completeLabel: "I’m ready",
      content: (
        <p className="text-sm">
          {(lesson.materials || []).join(", ") || "Nothing special"}
        </p>
      )
    },

    lesson.steps?.length > 0 && {
      key: "quest-steps",
      n: "4",
      title: "Your quest steps",
      completeLabel: "I finished my quest steps",
      canComplete: questStepsFinished,
      content: (
        <>
          <ol className="space-y-3">
            {lesson.steps.map((step, index) => {
              const available =
                index === 0 || completedQuestSteps[index - 1];

              return (
                <li
                  key={index}
                  className={`rounded-xl border p-4 transition ${
                    available ? "bg-white" : "bg-stone-100 opacity-60"
                  }`}
                  style={{ borderColor: "#D4C8A8" }}
                >
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!completedQuestSteps[index]}
                      disabled={!available}
                      onChange={(event) =>
                        setCompletedQuestSteps((current) => ({
                          ...current,
                          [index]: event.target.checked
                        }))
                      }
                      className="mt-1 h-5 w-5 shrink-0"
                    />

                    <span>
                      <span className="block font-bold">
                        {index + 1}. {step.title}
                      </span>

                      <span className="block text-sm text-stone-700 mt-1">
                        {step.detail}
                      </span>

                      {step.duration_minutes && (
                        <span className="block text-xs font-mono text-stone-500 mt-1">
                          {step.duration_minutes} minutes
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ol>

          {!questStepsFinished && (
            <p className="mt-4 text-sm text-stone-600">
              Complete each quest step in order to continue.
            </p>
          )}
        </>
      )
    },

    lesson.key_vocabulary?.length > 0 && {
      key: "key-words",
      n: "5",
      title: "Key words",
      completeLabel: "I know these key words",
      content: (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {lesson.key_vocabulary.map((word, index) => (
            <li
              key={index}
              className="rounded-lg bg-white border border-stone-200 p-2"
            >
              {word}
            </li>
          ))}
        </ul>
      )
    },

    lesson.explicit_teaching && {
      key: "learn",
      n: "6",
      title: "Let’s learn",
      completeLabel: "I’ve read this",
      content: (
        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
          {lesson.explicit_teaching}
        </div>
      )
    },

    flipActivities.length > 0 && {
      key: "flip-cards",
      n: "7",
      title: "Try the learning cards",
      completeLabel: "I’ve checked every card",
      canComplete: allFlipCardsViewed,
      content: (
        <>
          <div className="space-y-5">
            {flipActivities.map((activity, activityIndex) => (
              <div key={activityIndex}>
                {activity.title && (
                  <h3 className="font-bold mb-3">{activity.title}</h3>
                )}

                <FlipCards
                  cards={activity.cards || []}
                  activityIndex={activityIndex}
                  flippedCards={flippedCards}
                  setFlippedCards={setFlippedCards}
                />
              </div>
            ))}
          </div>

          {!allFlipCardsViewed && (
            <p className="mt-4 text-sm text-stone-600">
              Tap each card to reveal its meaning before you continue.
            </p>
          )}
        </>
      )
    },

    resources.length > 0 && {
      key: "resources",
      n: "8",
      title: "Watch and play",
      completeLabel: "I’m ready to continue",
      content: (
        <div className="space-y-4">
          {resources.map((resource, index) => {
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
                  {resource.type === "video" ? "🎬" : "🎮"} {resource.title}
                </div>

                <div className="text-xs text-stone-600 mt-0.5">
                  Tap to open
                </div>
              </a>
            );
          })}
        </div>
      )
    },

    lesson.worked_example && {
      key: "example",
      n: "9",
      title: "Example",
      completeLabel: "I understand the example",
      content: (
        <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-sm">
          {lesson.worked_example}
        </div>
      )
    },

    lesson.guided_practice && {
      key: "guided-practice",
      n: "10",
      title: "Try with me",
      completeLabel: "I’m ready for my task",
      content: <p className="text-sm">{lesson.guided_practice}</p>
    },

    {
      key: "task",
      n: "11",
      title: "My task",
      completeLabel: quiz.length > 0
        ? "I’m ready for the quick check"
        : "I’m ready to show what I know",
      content: (
        <>
          <p className="text-base">{lesson.independent_task}</p>

          {lesson.response_prompt && (
            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm">
              <strong>Respond to:</strong> {lesson.response_prompt}
            </div>
          )}
        </>
      )
    },

    quiz.length > 0 && {
      key: "quiz",
      n: "12",
      title: "Quick check",
      completeLabel: "I’ve finished the quick check",
      canComplete: quizSubmitted,
      content: (
        <>
          <div className="space-y-4">
            {quiz.map((question, questionIndex) => {
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
                      const isCorrect = optionIndex === question.correct_index;

                      let buttonClass =
                        "w-full text-left px-3 py-2 rounded-lg border transition";

                      if (quizSubmitted && isCorrect) {
                        buttonClass +=
                          " border-green-500 bg-green-50 text-green-800";
                      } else if (
                        quizSubmitted &&
                        isSelected &&
                        !isCorrect
                      ) {
                        buttonClass +=
                          " border-red-500 bg-red-50 text-red-800";
                      } else if (isSelected) {
                        buttonClass +=
                          " border-blue-500 bg-blue-50 text-blue-800";
                      } else {
                        buttonClass +=
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
                          className={buttonClass}
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
                Compare your written response with the suggested answer and
                marking guide.
              </p>
            </div>
          )}
        </>
      )
    },

    {
      key: "response",
      n: "13",
      title: "Show what you know",
      showCompleteButton: false,
      content: (
        <div className="space-y-5">
          <div>
            <label className="font-bold text-sm">My response</label>

            <textarea
              rows={5}
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              placeholder="Type your answer here… (or upload a photo of your paper work below)"
              className="mt-2 w-full rounded-lg border px-3 py-2 text-base bg-white"
              style={{ borderColor: "#D4C8A8" }}
              data-testid="response-text"
            />
          </div>

          <div>
            <label className="font-bold text-sm">Upload my work</label>

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
              className="mt-2 rounded-xl border-2 border-dashed w-full p-6 flex flex-col items-center gap-2 hover:bg-stone-50 disabled:opacity-50"
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
          </div>

          <div>
            <label className="font-bold text-sm">Reflect</label>

            <textarea
              rows={3}
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder={
                lesson.reflection_prompts?.[0] ||
                lesson.reflection_prompt ||
                "What did you learn? What was tricky?"
              }
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-white"
              style={{ borderColor: "#D4C8A8" }}
              data-testid="reflection-text"
            />
          </div>

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
      )
    }
  ].filter(Boolean);

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
        <div className="text-xs font-mono text-stone-500">
          {lesson.stage} · {lesson.learning_area}
        </div>

        <h1
          className="font-display text-3xl font-bold mt-1"
          style={{ color: "#1F3B2D" }}
        >
          {lesson.title}
        </h1>

        <div
          className={`mt-4 rounded-xl border px-4 py-2 text-sm ${supportBanner.cls}`}
          data-testid="support-banner"
        >
          {supportBanner.text}
        </div>
      </header>

      {lesson.child_mission && (
        <div className="paper-card p-6">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-wider">
            Your mission
          </div>

          <p
            className="font-display text-xl font-bold mt-2"
            style={{ color: "#1F3B2D" }}
          >
            {lesson.child_mission}
          </p>
        </div>
      )}

      {lessonCards.map((card, index) => (
        <RevealStep
          key={card.key}
          cardIndex={index}
          unlockedCard={unlockedCard}
          completed={completedCards[index]}
          onComplete={completeCard}
          n={card.n}
          title={card.title}
          completeLabel={card.completeLabel}
          cardRefs={cardRefs}
          showCompleteButton={
            card.showCompleteButton !== false && card.canComplete !== false
          }
        >
          {card.content}

          {card.canComplete === false && (
            <p className="mt-4 text-sm text-stone-600">
              Complete this activity to continue.
            </p>
          )}
        </RevealStep>
      ))}

      {lesson.follow_up_challenges?.length > 0 && (
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
              ? "Pick a challenge to really show you’ve got it. Submit any and earn bonus pet XP."
              : "Submit your main task first — then these unlock."}
          </p>

          <div className="grid md:grid-cols-3 gap-3">
            {lesson.follow_up_challenges.map((challenge, index) => (
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

      <PetCompanion lessonId={lesson.id} />
    </div>
  );
}

const RevealStep = ({
  cardIndex,
  unlockedCard,
  completed,
  onComplete,
  n,
  title,
  completeLabel = "I’m ready for the next step",
  cardRefs,
  showCompleteButton = true,
  children
}) => {
  if (cardIndex > unlockedCard) {
    return null;
  }

  return (
    <div
      ref={(element) => {
        cardRefs.current[cardIndex] = element;
      }}
      className="animate-in fade-in slide-in-from-bottom-3 duration-500"
    >
      <Step n={n} title={title}>
        {children}

        {!completed && showCompleteButton && (
          <button
            type="button"
            onClick={() => onComplete(cardIndex)}
            className="mt-5 rounded-full px-5 py-3 text-sm font-bold transition hover:translate-y-[-1px]"
            style={{ backgroundColor: "#1F3B2D", color: "#F5EFE0" }}
          >
            {completeLabel} →
          </button>
        )}

        {completed && (
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-emerald-800">
            <CheckCircle2 size={16} />
            Done
          </div>
        )}
      </Step>
    </div>
  );
};

const FlipCards = ({
  cards,
  activityIndex,
  flippedCards,
  setFlippedCards
}) => {
  const toggle = (cardIndex) => {
    const key = `${activityIndex}-${cardIndex}`;

    setFlippedCards((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        const isFlipped = !!flippedCards[`${activityIndex}-${index}`];

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
