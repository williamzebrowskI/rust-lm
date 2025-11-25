export type Level = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface CodeExample {
  title: string;
  code: string;
  description?: string;
}

export interface LessonSection {
  title: string;
  content: string;
  examples?: CodeExample[];
  exercise?: CodeExercise;
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface CodeExercise {
  id: string;
  prompt: string;
  starterCode: string;
  tests: string;
  checks?: {
    mustInclude?: string[];
    mustNotInclude?: string[];
  };
}

export interface Lesson {
  id: string;
  title: string;
  level: Level;
  description: string;
  sections: LessonSection[];
  quiz?: QuizQuestion[];
  exercise?: CodeExercise;
  stub?: boolean;
}

export interface RunTestsRequest {
  userCode: string;
  tests: string;
  exerciseId: string;
  lessonId: string;
  lessonTitle: string;
  checks?: {
    mustInclude?: string[];
    mustNotInclude?: string[];
  };
}

export interface TestResult {
  name: string;
  pass: boolean;
  message?: string;
}

export interface RunTestsResponse {
  success: boolean;
  results: TestResult[];
  rawOutput?: string;
  notes?: string;
  error?: string;
}
