import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LessonPage from "./pages/LessonPage";
import ProjectIDE from "./pages/ProjectIDE";
import { useProgress } from "./hooks/useProgress";
import Sidebar from "./components/Sidebar";

function App() {
  const progress = useProgress();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Link to="/">From Dust to Rust</Link>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/ide">Project IDE</Link>
        </nav>
      </header>
      <div className="layout">
        <Sidebar progress={progress} />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage progress={progress} />} />
            <Route path="/lesson/:lessonId" element={<LessonPage progress={progress} />} />
            <Route path="/ide" element={<ProjectIDE />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
