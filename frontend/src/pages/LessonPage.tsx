import { Link, useParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { curriculum } from "../curriculum";
import QuizBlock from "../components/QuizBlock";
import CodeExerciseBlock from "../components/CodeExerciseBlock";
import HighlightedCode from "../components/HighlightedCode";
import { useProgress } from "../hooks/useProgress";

interface Props {
  progress: ReturnType<typeof useProgress>;
}

function LessonPage({ progress }: Props) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = useMemo(() => curriculum.find((l) => l.id === lessonId), [lessonId]);
  const [openSections, setOpenSections] = useState<Record<number | string, boolean>>({});
  const exercisePasses = progress.state.exercisePasses;
  const sectionQuizScores = progress.state.sectionQuizScores;
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (!lesson) {
    return (
      <div className="page">
        <p>Lesson not found.</p>
        <Link to="/">Return home</Link>
      </div>
    );
  }

  const exerciseIds = useMemo(() => {
    const ids: string[] = [];
    lesson.sections.forEach((section, idx) => {
      if (section.exercise) {
        ids.push(section.exercise.id || `${lesson.id}-section-${idx}`);
      }
    });
    if (lesson.exercise) ids.push(lesson.exercise.id);
    return ids;
  }, [lesson]);

  const sectionStates = lesson.sections.map((section, idx) => {
    const sectionKey = `${lesson.id}-section-${idx}`;
    const hasExercise = !!section.exercise;
    const hasQuiz = !!section.quiz;
    const exerciseDone = hasExercise ? !!exercisePasses[section.exercise!.id] : true;
    const quizDone = hasQuiz ? sectionQuizScores[sectionKey] === 100 : true;
    return { sectionKey, hasExercise, hasQuiz, exerciseDone, quizDone, done: exerciseDone && quizDone };
  });

  const allSectionsDone = sectionStates.every((s) => s.done);

  const canComplete =
    progress.state.quizScores[lesson.id] === 100 &&
    exerciseIds.every((id) => exercisePasses[id]);

  const markComplete = () => {
    if (canComplete) {
      progress.markLessonComplete(lesson.id);
    }
  };

  const renderInlineCode = (text: string) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={idx} className="inline-code">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="page lesson">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{lesson.level}</span>
      </div>
      <header className="lesson-header">
        <div>
          <p className="eyebrow">{lesson.level}</p>
          <h1>{lesson.title}</h1>
          <p className="lead">{lesson.description}</p>
        </div>
        <div className="lesson-actions">
          <button className="ghost" onClick={markComplete} disabled={!canComplete}>
            {canComplete ? "Mark complete" : "Finish quiz + exercises to complete"}
          </button>
          {progress.isLessonComplete(lesson.id) && <span className="pill strong">Completed</span>}
        </div>
      </header>

      {lesson.stub && (
        <div className="card stub-card">
          <p>This lesson is stubbed. The outline below shows how to extend it.</p>
        </div>
      )}

      <div className="sections">
      {lesson.sections.map((section, idx) => {
        const state = sectionStates[idx];
        const priorDone = idx === 0 || sectionStates.slice(0, idx).every((s) => s.done);
        const locked = !priorDone && !state.done;
        const isOpen = !locked && openSections[idx] !== false;

        return (
          <section
            key={idx}
            className="card section"
            ref={(el) => {
              sectionRefs.current[state.sectionKey] = el;
            }}
          >
            <button
              className="section-toggle"
              disabled={locked}
              onClick={() => {
                if (locked) return;
                setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
              }}
            >
              <div className="section-heading">
                <span className="lesson-dot" data-status={state.done ? "done" : "todo"} />
                <div>
                  <p className="eyebrow">Section {idx + 1}</p>
                  <h3>{section.title}</h3>
                  {locked && <span className="pill">Complete previous section to unlock</span>}
                </div>
              </div>
              <span>{isOpen ? "▾" : "▸"}</span>
            </button>
            {isOpen && (
              <>
                <div className="body">
                  {section.content.split("\n\n").map((p, i) => (
                    <p key={i}>{renderInlineCode(p)}</p>
                  ))}
                  </div>
                  {section.examples && section.examples.length > 0 && (
                    <div className="examples">
                      {section.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="example">
                          <div className="example-head">
                            <p className="eyebrow">{ex.title}</p>
                            {ex.description && <span className="pill">{ex.description}</span>}
                          </div>
                          <HighlightedCode code={ex.code} level={lesson.level} />
                        </div>
                      ))}
                    </div>
                  )}
                  {section.quiz && (
                    <QuizBlock
                      key={state.sectionKey}
                      lessonId={state.sectionKey}
                      questions={section.quiz}
                      initialAnswers={progress.state.quizAnswers[state.sectionKey]}
                      onScore={(score) =>
                        progress.recordSectionQuizScore(state.sectionKey, score)
                      }
                      onAnswersChange={(ans) => progress.recordQuizAnswers(state.sectionKey, ans)}
                    />
                  )}
                  {section.exercise && (
                    <CodeExerciseBlock
                      lessonId={lesson.id}
                      lessonTitle={lesson.title}
                      exercise={section.exercise}
                      onPass={() => progress.recordExercisePass(section.exercise!.id)}
                    />
                  )}
                </>
              )}
            </section>
          );
        })}
      </div>

      {lesson.quiz && (
        <section className="card section">
          <button
            className="section-toggle"
            disabled={!allSectionsDone}
            onClick={() => {
              if (!allSectionsDone) return;
              setOpenSections((prev) => ({
                ...prev,
                quiz: !(prev as any).quiz,
              }));
            }}
          >
            <div className="section-heading">
              <span className="lesson-dot" data-status={progress.state.quizScores[lesson.id] === 100 ? "done" : "todo"} />
              <div>
                <p className="eyebrow">Chapter Test</p>
                <h3>Check your understanding</h3>
                {!allSectionsDone && <span className="pill">Complete all sections to unlock</span>}
              </div>
            </div>
            <span>{(openSections as any).quiz === false ? "▸" : "▾"}</span>
          </button>
          {(openSections as any).quiz !== false && allSectionsDone && (
            <>
              <QuizBlock
                key={`${lesson.id}-chapter-quiz`}
                lessonId={lesson.id}
                questions={lesson.quiz}
                initialAnswers={progress.state.quizAnswers[lesson.id]}
                onScore={(score) => {
                  progress.recordQuizScore(lesson.id, score);
                }}
                onAnswersChange={(ans) => progress.recordQuizAnswers(lesson.id, ans)}
              />
              {lesson.exercise && (
                <CodeExerciseBlock
                  lessonId={lesson.id}
                  lessonTitle={lesson.title}
                  exercise={lesson.exercise}
                  questionNumber={(lesson.quiz?.length || 0) + 1}
                  onPass={() => {
                    setExercisePasses((prev) => ({ ...prev, [lesson.exercise!.id]: true }));
                  }}
                />
              )}
            </>
          )}
        </section>
      )}

      {canComplete && !progress.isLessonComplete(lesson.id) && (
          <div className="card success-callout">
            <div>
              <p className="eyebrow">Great work</p>
              <p>All exercises passed and quiz scored 100%. Mark the lesson complete.</p>
            </div>
            <button onClick={markComplete}>Mark complete</button>
          </div>
        )}
    </div>
  );
}

export default LessonPage;
