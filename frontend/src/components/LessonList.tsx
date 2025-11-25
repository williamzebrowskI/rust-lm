import { Link } from "react-router-dom";
import { Lesson, Level } from "../types";

interface Props {
  lessons: Lesson[];
  completed: string[];
}

const levelOrder: Level[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

export function LessonList({ lessons, completed }: Props) {
  const completionSet = new Set(completed);
  const lessonOrder = new Map(lessons.map((lesson, idx) => [lesson.id, idx]));

  const isLocked = (lessonId: string) => {
    const idx = lessonOrder.get(lessonId) ?? 0;
    // Locked if any prior lesson in the overall ordering is not completed.
    for (let i = 0; i < idx; i++) {
      const prev = lessons[i];
      if (!completionSet.has(prev.id)) return true;
    }
    return false;
  };

  const grouped: Record<Level, Lesson[]> = {
    Beginner: [],
    Intermediate: [],
    Advanced: [],
    Expert: [],
  };

  lessons.forEach((lesson) => {
    grouped[lesson.level].push(lesson);
  });

  return (
    <div className="lesson-groups">
      {levelOrder.map((level) => (
        <section key={level} className="lesson-group">
          <div className="group-header">
            <h2>{level}</h2>
            <span className="pill">{grouped[level].length} lessons</span>
          </div>
          <div className="lesson-grid">
            {grouped[level].map((lesson) => {
              const isDone = completed.includes(lesson.id);
              const locked = isLocked(lesson.id) && !isDone;
              return (
                <Link
                  key={lesson.id}
                  to={locked ? "#" : `/lesson/${lesson.id}`}
                  className={`lesson-card ${isDone ? "done" : ""} ${locked ? "locked" : ""}`}
                  aria-disabled={locked}
                  onClick={(e) => locked && e.preventDefault()}
                >
                  <div className="card-top">
                    <p className="eyebrow">{lesson.level}</p>
                    {lesson.stub && <span className="stub">Stub</span>}
                    {locked && <span className="stub">Locked</span>}
                  </div>
                  <h3>{lesson.title}</h3>
                  <p className="desc">{lesson.description}</p>
                  <div className="progress-line">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                  <p className="status">{isDone ? "Completed" : "Start learning"}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default LessonList;
