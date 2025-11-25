import { useEffect, useMemo, useRef, useState } from "react";
import { QuizQuestion } from "../types";

interface Props {
  lessonId: string;
  questions: QuizQuestion[];
  onScore?: (scorePercent: number) => void;
  initialAnswers?: Record<number, number>;
  onAnswersChange?: (answers: Record<number, number>) => void;
}

interface AnswerState {
  choice: number;
  correct: boolean;
}

function QuizBlock({ lessonId, questions, onScore, initialAnswers, onAnswersChange }: Props) {
  const [answers, setAnswers] = useState<Record<number, AnswerState>>(() => {
    if (!initialAnswers) return {};
    const mapped: Record<number, AnswerState> = {};
    Object.entries(initialAnswers).forEach(([idx, choice]) => {
      const qIndex = Number(idx);
      const q = questions[qIndex];
      if (q) mapped[qIndex] = { choice, correct: q.answerIndex === choice };
    });
    return mapped;
  });
  const lastReportedScore = useRef<number | null>(null);

  useEffect(() => {
    // sync in persisted answers if they change
    if (!initialAnswers) return;
    setAnswers((prev) => {
      let changed = false;
      const next: Record<number, AnswerState> = { ...prev };
      Object.entries(initialAnswers).forEach(([idx, choice]) => {
        const qIndex = Number(idx);
        const q = questions[qIndex];
        if (!q) return;
        const correct = q.answerIndex === choice;
        const current = prev[qIndex];
        if (!current || current.choice !== choice || current.correct !== correct) {
          changed = true;
          next[qIndex] = { choice, correct };
        }
      });
      return changed ? next : prev;
    });
  }, [initialAnswers, questions]);

  const renderPrompt = (prompt: string, index: number) => {
    const match = prompt.match(/```[a-zA-Z]*\s*([\s\S]*?)```/m);
    if (!match || match.index === undefined) {
      return (
        <p className="prompt">
          <strong>{index + 1}.</strong> {prompt}
        </p>
      );
    }
    const code = match[1].trimEnd();
    const before = prompt.slice(0, match.index).trim();
    const after = prompt.slice(match.index + match[0].length).trim();
    return (
      <div className="prompt">
        <p>
          <strong>{index + 1}.</strong> {before}
        </p>
        <pre className="code-block" data-level="Prompt">
          <code>{code}</code>
        </pre>
        {after && <p>{after}</p>}
      </div>
    );
  };

  useEffect(() => {
    const answered = Object.values(answers);
    if (answered.length === questions.length) {
      const correct = answered.filter((a) => a.correct).length;
      const score = Math.round((correct / questions.length) * 100);
      if (score !== lastReportedScore.current) {
        lastReportedScore.current = score;
        onScore?.(score);
      }
    }
  }, [answers, questions.length, onScore]);

  useEffect(() => {
    // Reset tracker if questions change
    lastReportedScore.current = null;
  }, [lessonId, questions.length]);

  const score = useMemo(() => {
    const answered = Object.values(answers);
    if (answered.length === 0) return null;
    const correct = answered.filter((a) => a.correct).length;
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions.length]);

  const setChoice = (qIndex: number, optionIndex: number) => {
    const question = questions[qIndex];
    const correct = question.answerIndex === optionIndex;
    setAnswers((prev) => {
      const updated = {
        ...prev,
        [qIndex]: { choice: optionIndex, correct },
      };
      onAnswersChange?.(
        Object.fromEntries(
          Object.entries(updated).map(([k, v]) => [Number(k), v.choice])
        ) as Record<number, number>
      );
      return updated;
    });
  };

  return (
    <div className="card quiz">
      {score !== null && (
        <div className="card-header">
          <span className="pill strong">Score: {score}%</span>
        </div>
      )}
      <div className="quiz-list">
        {questions.map((q, idx) => {
          const answered = answers[idx];
          return (
            <div key={idx} className="quiz-item">
              {renderPrompt(q.prompt, idx)}
              <div className="options">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answered?.choice === optIdx;
                  const isCorrect = q.answerIndex === optIdx;
                  const className = [
                    "option",
                    isSelected ? "selected" : "",
                    answered ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <button key={optIdx} className={className} onClick={() => setChoice(idx, optIdx)}>
                      <span className="letter">{String.fromCharCode(65 + optIdx)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <p className={`explanation ${answered.correct ? "good" : "bad"}`}>
                  {answered.correct ? "Correct!" : "Try again."} {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuizBlock;
