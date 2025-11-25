import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { curriculum } from "../curriculum";
import { Level } from "../types";
import { useProgress } from "../hooks/useProgress";

interface Props {
  progress: ReturnType<typeof useProgress>;
}

const levelOrder: Level[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function Sidebar({ progress }: Props) {
  const location = useLocation();
  const currentLessonId = location.pathname.startsWith("/lesson/")
    ? location.pathname.replace("/lesson/", "")
    : null;

  const grouped: Record<Level, typeof curriculum> = {
    Beginner: [],
    Intermediate: [],
    Advanced: [],
    Expert: [],
  };
  curriculum.forEach((lesson) => grouped[lesson.level].push(lesson));

  const [openLevels, setOpenLevels] = useState<Record<Level, boolean>>({
    Beginner: true,
    Intermediate: false,
    Advanced: false,
    Expert: false,
  });

  const toggle = (level: Level) =>
    setOpenLevels((prev) => ({ ...prev, [level]: !prev[level] }));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="eyebrow">Curriculum</p>
        <h3>Levels</h3>
      </div>
      <div className="sidebar-groups">
        {levelOrder.map((level) => (
          <div key={level} className="sidebar-group">
            <button className="sidebar-group-title" onClick={() => toggle(level)}>
              <span>{level}</span>
              <span>{openLevels[level] ? "▾" : "▸"}</span>
            </button>
            {openLevels[level] && (
              <div className="sidebar-lessons">
                {grouped[level].map((lesson) => {
                  const done = progress.isLessonComplete(lesson.id);
                  const active = currentLessonId === lesson.id;
                  return (
                    <Link
                      key={lesson.id}
                      to={`/lesson/${lesson.id}`}
                      className={`sidebar-lesson ${active ? "active" : ""}`}
                    >
                      <span className="lesson-dot" data-status={done ? "done" : "todo"} />
                      <span className="lesson-title">{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        <div className="sidebar-group project-ide">
          <p className="eyebrow">Practice</p>
          <Link to="/ide" className="sidebar-lesson">
            <span className="lesson-dot" data-status="todo" />
            <span className="lesson-title">Project IDE</span>
          </Link>
          <p className="hint">Open a scratchpad with a VS Code–style editor to experiment.</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
