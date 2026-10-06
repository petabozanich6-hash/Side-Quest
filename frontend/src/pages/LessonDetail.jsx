import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";



export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
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

        {lesson.outcome_codes?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {lesson.outcome_codes.map((code) => (
              <span
                key={code}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {code}
              </span>
            ))}
          </div>
        )}

        <section className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-xl font-semibold">Your mission</h2>
          <p className="mt-2">
  {lesson.child_mission || lesson.learning_intention || "Work through the lesson steps and show what you have learned."}
</p>

          {lesson.materials?.length > 0 && (
            <>
              <h3 className="font-semibold mt-4">You will need</h3>
              <ul className="list-disc ml-5 mt-2">
                {lesson.materials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        {lesson.steps?.length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Lesson steps</h2>
            <ol className="mt-4 space-y-4">
              {lesson.steps.map((step, index) => (
                <li key={index}>
                  <div className="font-semibold">
                    {index + 1}. {step.title}
                  </div>
                  <p className="text-slate-700">{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {lesson.resources?.length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Videos and games</h2>
            <div className="mt-4 space-y-3">
              {lesson.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-slate-100 hover:bg-slate-200 rounded-lg p-4"
                >
                  <strong>
                    {resource.type === "video" ? "🎬" : "🎮"} {resource.title}
                  </strong>
                  <p className="text-sm text-slate-600">Open resource</p>
                </a>
              ))}
            </div>
          </section>
        )}

                {lesson.quiz?.length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Check your learning</h2>

            <div className="mt-4 space-y-6">
              {lesson.quiz.map((question, questionIndex) => {
                const selected = quizAnswers[questionIndex];

                return (
                  <div key={questionIndex} className="border rounded-lg p-4">
                    <p className="font-medium">
                      {questionIndex + 1}. {question.question}
                    </p>

                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isCorrect =
                          optionIndex === question.correct_index;
                        const showResult = quizSubmitted;

                        let buttonClass =
                          "w-full text-left px-4 py-2 rounded-lg border transition";

                        if (showResult && isCorrect) {
                          buttonClass +=
                            " border-green-500 bg-green-50 text-green-800";
                        } else if (showResult && isSelected && !isCorrect) {
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

                    {quizSubmitted && (
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
                disabled={
                  Object.keys(quizAnswers).length !== lesson.quiz.length
                }
                className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                Check my answers
              </button>
            ) : (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-900">
                <p className="font-semibold">
                  You answered{" "}
                  {
                    lesson.quiz.filter(
                      (question, index) =>
                        quizAnswers[index] === question.correct_index
                    ).length
                  }{" "}
                  of {lesson.quiz.length} correctly.
                </p>
              </div>
            )}
          </section>
        )}

        {lesson.evidence_instructions && (
          <section className="bg-white rounded-xl shadow p-6 mt-6">
            <h2 className="text-xl font-semibold">Show your learning</h2>
            <p className="mt-2">{lesson.evidence_instructions}</p>
            <p className="text-slate-600 mt-2">
              Evidence upload will be added next.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
