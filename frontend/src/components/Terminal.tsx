import { useRef, useState } from "react";

interface Props {
  cwd: string;
  lines: string[];
  onCommand: (cmd: string) => Promise<void> | void;
}

function Terminal({ cwd, lines, onCommand }: Props) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const displayPath = cwd === "/" ? "/rust-lm" : `/rust-lm${cwd}`;

  const submit = async () => {
    const cmd = input;
    setInput("");
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    await onCommand(cmd);
  };

  return (
    <>
      <div className="panel-header">
        <span className="eyebrow">Terminal</span>
      </div>
      <div
        className="terminal-output"
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        {lines.map((line, idx) => (
          <pre key={idx}>{line}</pre>
        ))}
        <div className="terminal-line input-line">
          <span className="prompt">{`${displayPath} >`}</span>
          <input
            ref={inputRef}
            className="terminal-inline-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void submit();
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHistoryIndex((idx) => {
                  const next = idx === -1 ? history.length - 1 : Math.max(0, idx - 1);
                  const cmd = history[next] ?? "";
                  setInput(cmd);
                  return next;
                });
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setHistoryIndex((idx) => {
                  if (idx === -1) return -1;
                  const next = idx + 1;
                  if (next >= history.length) {
                    setInput("");
                    return -1;
                  }
                  const cmd = history[next] ?? "";
                  setInput(cmd);
                  return next;
                });
              }
            }}
            placeholder=""
            autoFocus
          />
        </div>
      </div>
    </>
  );
}

export default Terminal;
