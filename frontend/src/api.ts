import { RunTestsRequest, RunTestsResponse } from "./types";

export async function runTests(payload: RunTestsRequest): Promise<RunTestsResponse> {
  const body = {
    user_code: payload.userCode,
    tests: payload.tests,
    exercise_id: payload.exerciseId,
    lesson_id: payload.lessonId,
    lesson_title: payload.lessonTitle,
    checks: payload.checks
      ? {
          must_include: payload.checks.mustInclude ?? [],
          must_not_include: payload.checks.mustNotInclude ?? [],
        }
      : undefined,
  };

  const res = await fetch("/api/run-tests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error (${res.status}): ${text}`);
  }

  return res.json();
}
