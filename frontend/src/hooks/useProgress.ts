import { useEffect, useState } from "react";

type ProgressState = {
  completedLessons: string[];
  quizScores: Record<string, number>;
  sectionQuizScores: Record<string, number>;
  exercisePasses: Record<string, boolean>;
  quizAnswers: Record<string, Record<number, number>>; // lesson/section id -> questionIndex -> choiceIndex
};

const STORAGE_KEY = "rust-lm-progress";
const DB_NAME = "rust-lm";
const STORE_NAME = "progress";
const DB_VERSION = 1;

const defaultState: ProgressState = {
  completedLessons: [],
  quizScores: {},
  sectionQuizScores: {},
  exercisePasses: {},
  quizAnswers: {},
};

// Minimal IndexedDB helpers -------------------------------------------------
const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const idbGet = async (key: string): Promise<unknown | undefined> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as unknown);
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (key: string, value: unknown): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export function useProgress() {
  const [state, setState] = useState<ProgressState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      // Try IndexedDB first; fall back to localStorage.
      let loaded: ProgressState | undefined;
      try {
        const raw = (await idbGet(STORAGE_KEY)) as ProgressState | undefined;
        if (raw) loaded = raw;
      } catch (err) {
        console.warn("IndexedDB load failed, falling back to localStorage", err);
      }

      if (!loaded) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            loaded = {
              completedLessons: parsed.completedLessons ?? [],
              quizScores: parsed.quizScores ?? {},
              sectionQuizScores: parsed.sectionQuizScores ?? {},
              exercisePasses: parsed.exercisePasses ?? {},
              quizAnswers: parsed.quizAnswers ?? {},
            };
          }
        } catch (err) {
          console.warn("localStorage load failed", err);
        }
      }

      if (!cancelled) {
        const normalized: ProgressState = {
          ...defaultState,
          ...(loaded as Partial<ProgressState> | undefined),
        };
        setState(normalized);
        setHydrated(true);
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) {
      const serialized = JSON.stringify(state);
      // Persist to both IndexedDB and localStorage (as a simple backup).
      void idbSet(STORAGE_KEY, state).catch((err) =>
        console.warn("IndexedDB save failed", err)
      );
      localStorage.setItem(STORAGE_KEY, serialized);
    }
  }, [state, hydrated]);

  const markLessonComplete = (lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return { ...prev, completedLessons: [...prev.completedLessons, lessonId] };
    });
  };

  const recordQuizScore = (lessonId: string, scorePercent: number) => {
    setState((prev) => ({
      ...prev,
      quizScores: { ...prev.quizScores, [lessonId]: scorePercent },
    }));
  };

  const recordSectionQuizScore = (sectionId: string, scorePercent: number) => {
    setState((prev) => ({
      ...prev,
      sectionQuizScores: { ...prev.sectionQuizScores, [sectionId]: scorePercent },
    }));
  };

  const recordExercisePass = (exerciseId: string) => {
    setState((prev) => ({
      ...prev,
      exercisePasses: { ...prev.exercisePasses, [exerciseId]: true },
    }));
  };

  const recordQuizAnswers = (quizId: string, answers: Record<number, number>) => {
    setState((prev) => ({
      ...prev,
      quizAnswers: { ...prev.quizAnswers, [quizId]: answers },
    }));
  };

  const isLessonComplete = (lessonId: string) => state.completedLessons.includes(lessonId);

  return {
    state,
    markLessonComplete,
    recordQuizScore,
    recordSectionQuizScore,
    recordExercisePass,
    recordQuizAnswers,
    isLessonComplete,
  };
}
