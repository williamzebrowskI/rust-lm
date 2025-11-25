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

  const firstLesson = curriculum[0];

  return (
    <div className="page home">
      <section className="hero">
        <div>
          <p className="eyebrow">From Dust to Rust</p>
          <h1>Shape your Rust skills, one focused chapter at a time.</h1>
          <p className="lead">
            A respectful, beginner-to-expert path for Rust. Read concise chapters, run code, answer quizzes, and track progress locally. No logins, no fluff—just the essentials to become productive.
          </p>
          <div className="stats">
            <span className="pill strong">{totals.done}/{totals.total} lessons completed</span>
            <span className="pill">Local progress • No signup</span>
          </div>
          <div className="actions">
            {firstLesson && (
              <Link to={`/lesson/${firstLesson.id}`} className="btn">
                Start with {firstLesson.title}
              </Link>
            )}
            <Link to="/ide" className="btn ghost">Open Project IDE</Link>
          </div>
        </div>
        <div className="hero-card">
          <h3>What you get</h3>
          <ul>
            <li>Structured chapters from tooling to advanced topics.</li>
            <li>Runnable examples and code exercises with backend checks.</li>
            <li>Section locking to guide you in order—no skipping ahead.</li>
            <li>Progress saved locally (IndexedDB) without accounts.</li>
          </ul>
        </div>
      </section>

      <section className="feature-grid">
        <div className="card">
          <p className="eyebrow">Curriculum</p>
          <h3>Beginner → Expert</h3>
          <p className="muted">
            Follow the sidebar to browse chapters. Each chapter has gated sections, quizzes, and exercises to keep you on track.
          </p>
        </div>
        <div className="card">
          <p className="eyebrow">Practice</p>
          <h3>Project IDE</h3>
          <p className="muted">
            Open the built-in IDE to experiment with Rust code, run tests, and manage files in a VS Code–style workspace.
          </p>
          <Link to="/ide" className="btn mini">Launch IDE</Link>
        </div>
        <div className="card">
          <p className="eyebrow">Progress</p>
          <h3>Your pace, saved locally</h3>
          <p className="muted">
            Quiz answers, section completion, and chapter tests are stored in your browser. Come back anytime and continue where you left off.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
