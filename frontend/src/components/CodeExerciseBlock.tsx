import { useState } from "react";
import { CodeExercise } from "../types";
import { runTests } from "../api";
import InlineCodeEditor from "./InlineCodeEditor";

interface Props {
  lessonId: string;
  lessonTitle: string;
  exercise: CodeExercise;
  onPass?: () => void;
  questionNumber?: number;
}

function CodeExerciseBlock({ lessonId, lessonTitle, exercise, onPass, questionNumber }: Props) {
  const [code, setCode] = useState(exercise.starterCode.trim() + "\n");
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [results, setResults] = useState<{ name: string; pass: boolean; message?: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const allPassed = results.length > 0 && results.every((r) => r.pass);

  const handleRun = async () => {
    setStatus("running");
    setError(null);
    setOutput(null);
    try {
      const response = await runTests({
        userCode: code,
        tests: exercise.tests,
        exerciseId: exercise.id,
        lessonId,
        lessonTitle,
        checks: exercise.checks,
      });
      setResults(response.results);
      setOutput(response.rawOutput ?? null);
      setStatus("done");
      if (response.success) {
        onPass?.();
      }
    } catch (err) {
      setStatus("done");
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="card exercise">
      <div className="card-header">
        <div>
          <p className="eyebrow">
            {questionNumber !== undefined ? `Question ${questionNumber}` : "Exercise"}
          </p>
          <h3>{exercise.prompt}</h3>
        </div>
        <button className="run-btn" onClick={handleRun} disabled={status === "running"}>
          {status === "running" ? "Running..." : "Run Tests"}
        </button>
      </div>
      <div className="editor">
        <InlineCodeEditor value={code} onChange={setCode} />
        <div className="tests">
          <div className="test-header">
            <p className={`eyebrow ${status === "done" ? (allPassed ? "pass" : "fail") : ""}`}>
              Code Checks
            </p>
            {status === "done" && results.length > 0 && (
              <span className={`pill ${allPassed ? "pass" : "fail"}`}>
                {allPassed ? "✔ Passed" : "Try again"}
              </span>
            )}
          </div>
          {status !== "done" && <p className="muted">Run tests to see pass/fail.</p>}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {status === "done" && results.length > 0 && output && (
        <details>
          <summary>Raw runner output</summary>
          <pre>{output}</pre>
        </details>
      )}
    </div>
  );
}

export default CodeExerciseBlock;
