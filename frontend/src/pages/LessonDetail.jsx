import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import QuestVisual from "../components/shared/QuestVisual";

const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function Visuals({ items }) {
  const list = asList(items);
  if (!list.length) return null;
  return (
    <div className="mt-4 space-y-4">
      {list.map((v, i) => (
        <QuestVisual key={i} visual={v} />
      ))}
    </div>
  );
}

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [shortAnswers, setShortAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const response = await api.get(`/lessons/${id}`);
        setLesson(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Could not load lesson");
      }
    };

    loadLesson();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <p className="text-red-600">{error}</p>
        <Link to="/parent/lessons" className="text-blue-600 underline">
          Back to lessons
        </Link>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        Loading lesson…
      </div>
    );
  }

  const multipleChoiceQuestions = (lesson.quiz || []).filter(
    (question) => question.type === "multiple_choice"
  );

  const answeredAllMultipleChoice = multipleChoiceQuestions.every((question) => {
    const questionIndex = lesson.quiz.indexOf(question);
    return quizAnswers[questionIndex] !== undefined;
  });

  const correctMultipleChoice = (lesson.quiz || []).filter(
    (question, index) =>
      question.type === "multiple_choice" &&
      quizAnswers[index] === question.correct_index
  ).length;

  const teachSteps = lesson.teach_steps || [];
  const spelling = lesson.spelling;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/parent/lessons" className="text-blue-600 underline">
          ← Back to lessons
        </Link>

        <h1 className="text-3xl font-bold mt-4">{lesson.title}</h1>

        <p className="text-slate-600 mt-2">
          {lesson.stage} · {lesson.learning_area} · {lesson.year_level} ·{" "}
          {lesson.duration_minutes} minutes
        </p>

        {(lesson.outcome_codes || []).length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">NSW learning outcomes</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.outcome_codes.map((code) => (
                <span
                  key={typeof code === "string" ? code : code.code}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {typeof code === "string" ? code : code.code}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-xl font-semibold">Lesson overview</h2>

          <h3 className="font-semibold mt-4">Child mission</h3>
          <p className="mt-2">
            {lesson.child_mission ||
              lesson.learning_intention ||
              "Work through the lesson steps and show what you have learned."}
          </p>

          {lesson.learning_intention && (
            <>
              <h3 className="font-semibold mt-4">Learning intention</h3>
              <p className="mt-2">{lesson.learning_intention}</p>
            </>
          )}

          {(lesson.success_criteria || []).length > 0 && (
            <>
              <h3 className="font-semibold mt-4">Success criteria</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {lesson.success_criteria.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {(lesson.materials || []).length > 0 && (
            <>
              <h3 className="font-semibold mt-4">Materials</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {lesson.materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        {(lesson.steps || []).length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Lesson steps</h2>

            <ol className="mt-4 space-y-4">
              {lesson.steps.map((step, index) => (
                <li key={`${step.title}-${index}`}>
                  <div className="font-semibold">
                    {index + 1}. {step.title}
                    {step.duration_minutes
                      ? ` (${step.duration_minutes} minutes)`
                      : ""}
                  </div>
                  <p className="text-slate-700 mt-1">{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {teachSteps.length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6" data-testid="parent-teach-steps">
            <h2 className="text-xl font-semibold">Teaching steps (what your child sees)</h2>

            <div className="mt-4 space-y-8">
              {teachSteps.map((step, index) => (
                <div key={`${step.title}-${index}`} className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
                  <h3 className="text-lg font-semibold">
                    {index + 1}. {step.icon} {step.title}
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-slate-700">{step.explain}</p>

                  <Visuals items={step.visual_before} />

                  {step.example && (
                    <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Example</div>
                      <p className="whitespace-pre-wrap text-slate-800">{step.example}</p>
                    </div>
                  )}

                  <Visuals items={step.visual} />

                  {step.notice && (
                    <p className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-slate-800">
                      <strong>Notice:</strong> {step.notice}
                    </p>
                  )}

                  {step.check && (
                    <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
                      <p className="font-medium text-blue-900">Check: {step.check.question}</p>
                      <ul className="list-disc ml-5 mt-2 space-y-0.5">
                        {(step.check.options || []).map((opt, oi) => (
                          <li
                            key={oi}
                            className={oi === step.check.correct_index ? "font-semibold text-green-800" : "text-slate-700"}
                          >
                            {opt}
                            {oi === step.check.correct_index ? " (correct)" : ""}
                          </li>
                        ))}
                      </ul>
                      {step.check.explanation && (
                        <p className="mt-2 text-slate-700">{step.check.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {lesson.explicit_teaching && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Explicit teaching</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">
              {lesson.explicit_teaching}
            </p>
          </section>
        )}

        {(lesson.worked_example || asList(lesson.worked_visuals).length > 0) && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Worked example</h2>
            {lesson.worked_example && (
              <p className="mt-3 whitespace-pre-wrap text-slate-700">
                {lesson.worked_example}
              </p>
            )}
            <Visuals items={lesson.worked_visuals} />
          </section>
        )}

        {lesson.guided_practice && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Guided practice</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">
              {lesson.guided_practice}
            </p>
          </section>
        )}

        {lesson.independent_task && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Independent task</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">
              {lesson.independent_task}
            </p>

            {lesson.response_prompt && (
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
                <strong>Student response prompt:</strong> {lesson.response_prompt}
              </div>
            )}
          </section>
        )}

        {spelling && (spelling.words || []).length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Spelling: {spelling.focus}</h2>
            {spelling.teaching && (
              <p className="mt-3 whitespace-pre-wrap text-slate-700">{spelling.teaching}</p>
            )}
            <ul className="list-disc ml-5 mt-3 space-y-1">
              {spelling.words.map((w, i) => (
                <li key={i}>
                  <strong>{w.word || w.text || w.answer || ""}</strong>
                  {w.hint || w.clue ? ` – ${w.hint || w.clue}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(lesson.resources || []).length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Videos and resources</h2>

            <div className="mt-4 space-y-4">
              {lesson.resources.map((resource, index) => (
                <div
                  key={`${resource.title}-${index}`}
                  className="bg-slate-100 rounded-lg p-4"
                >
                  <strong>
                    {resource.type === "video" ? "🎬" : "🎮"} {resource.title}
                  </strong>

                  {resource.type === "video" && resource.embed_url ? (
                    <div className="aspect-video w-full mt-3 overflow-hidden rounded-lg bg-black">
                      <iframe
                        src={resource.embed_url}
                        title={resource.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-600 underline mt-2 text-sm"
                    >
                      Open resource
                    </a>
                  ) : null}

                  {resource.prompt && (
                    <p className="text-sm text-slate-600 mt-3">
                      {resource.prompt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(lesson.quiz || []).length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Check your learning</h2>

            <div className="mt-4 space-y-6">
              {lesson.quiz.map((question, questionIndex) => {
                const selected = quizAnswers[questionIndex];

                if (question.type === "short_answer") {
                  return (
                    <div
                      key={questionIndex}
                      className="border rounded-lg p-4"
                    >
                      <p className="font-medium">
                        {questionIndex + 1}. {question.question}
                      </p>

                      <textarea
                        value={shortAnswers[questionIndex] || ""}
                        onChange={(event) =>
                          setShortAnswers((current) => ({
                            ...current,
                            [questionIndex]: event.target.value
                          }))
                        }
                        rows={4}
                        placeholder="Type the student's answer here…"
                        disabled={quizSubmitted}
                        className="w-full mt-3 rounded-lg border border-slate-300 p-3"
                      />

                      {quizSubmitted && (
                        <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-slate-700">
                          <p>
                            <strong>Suggested answer:</strong>{" "}
                            {question.sample_answer ||
                              "Review this response using the marking guide."}
                          </p>
                          {question.marking_guide && (
                            <p className="mt-2">
                              <strong>Marking guide:</strong>{" "}
                              {question.marking_guide}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }

                const options = question.options || [];

                return (
                  <div key={questionIndex} className="border rounded-lg p-4">
                    <p className="font-medium">
                      {questionIndex + 1}. {question.question}
                    </p>

                    <div className="mt-3 space-y-2">
                      {options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isCorrect =
                          optionIndex === question.correct_index;

                        let buttonClass =
                          "w-full text-left px-4 py-2 rounded-lg border transition";

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
                            " border-gray-200 hover:border-blue-300";
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
                      <p className="mt-3 text-sm text-gray-700">
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
                disabled={!answeredAllMultipleChoice}
                className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Check multiple-choice answers
              </button>
            ) : (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-900">
                <p className="font-semibold">
                  The student answered {correctMultipleChoice} of{" "}
                  {multipleChoiceQuestions.length} multiple-choice questions
                  correctly.
                </p>
                <p className="text-sm mt-2">
                  Review any short-answer response using the suggested answer
                  and marking guide above.
                </p>
              </div>
            )}
          </section>
        )}

        {lesson.parent_notes && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Parent notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">
              {lesson.parent_notes}
            </p>
          </section>
        )}

        {lesson.evidence_instructions && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Evidence to collect</h2>
            <p className="mt-2">{lesson.evidence_instructions}</p>
          </section>
        )}

        {lesson.offline_alternative && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Offline alternative</h2>
            <p className="mt-2">{lesson.offline_alternative}</p>
          </section>
        )}

        {lesson.extension && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Extension</h2>
            <p className="mt-2">{lesson.extension}</p>
          </section>
        )}
      </div>
    </div>
  );
}
