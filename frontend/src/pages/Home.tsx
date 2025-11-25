import { useMemo } from "react";
import { Link } from "react-router-dom";
import { curriculum } from "../curriculum";
import { useProgress } from "../hooks/useProgress";

interface Props {
  progress: ReturnType<typeof useProgress>;
}

function HomePage({ progress }: Props) {
  const { state } = progress;

  const totals = useMemo(() => {
    const total = curriculum.length;
    const done = state.completedLessons.length;
    return { total, done };
  }, [state.completedLessons.length]);

  const nextLesson = useMemo(() => {
    const remaining = curriculum.find((l) => !state.completedLessons.includes(l.id));
    return remaining ?? curriculum[0];
  }, [state.completedLessons]);

  const totalSections = useMemo(
    () => curriculum.reduce((acc, l) => acc + l.sections.length, 0),
    []
  );
  const totalExercises = useMemo(
    () =>
      curriculum.reduce(
        (acc, l) =>
          acc +
          l.sections.filter((s) => !!s.exercise).length +
          (l.exercise ? 1 : 0),
        0
      ),
    []
  );

  return (
    <div className="page home">
      <section className="hero hero-big-numbers">
        <div className="hero-main">
          <p className="eyebrow">From Dust to Rust</p>
          <h1 className="hero-title">Shape your Rust skills with intent.</h1>
          <p className="hero-sub">
            Chapters you can actually finish, code you can run, and progress that stays with you. Built for learners who want a clear, modern path into Rust.
          </p>
          <div className="hero-cta-row">
            {nextLesson && (
              <Link to={`/lesson/${nextLesson.id}`} className="btn">
                Continue learning
              </Link>
            )}
            <Link to="/ide" className="btn ghost">
              Project IDE
            </Link>
          </div>
          <div className="hero-metrics">
            <div className="metric-card primary">
              <span className="metric-label">Lessons</span>
              <span className="metric-value">
                {totals.done}/{totals.total}
              </span>
              <span className="metric-caption">Completed</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Sections</span>
              <span className="metric-value">{totalSections}</span>
              <span className="metric-caption">Structured steps</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Exercises</span>
              <span className="metric-value">{totalExercises}</span>
              <span className="metric-caption">Hands-on practice</span>
            </div>
          </div>
          <div className="hero-focus">
            <div className="focus-label">Today’s focus</div>
            <div className="focus-content">
              <h4>Install, build, test</h4>
              <ul>
                <li>rustup + toolchain basics</li>
                <li>cargo new, build, run, test</li>
                <li>fmt, clippy, doc</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
