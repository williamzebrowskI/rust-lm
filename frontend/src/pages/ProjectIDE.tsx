import { useEffect, useState } from "react";
import { runTests } from "../api";
import HighlightedCode from "../components/HighlightedCode";
import Terminal from "../components/Terminal";
import InlineCodeEditor from "../components/InlineCodeEditor";

type FileName = "main.rs" | "tests.rs" | string;

type IdeNode =
  | { type: "file"; name: string; path: string }
  | { type: "folder"; name: string; path: string; children: IdeNode[] };

const defaultCode = `fn main() {
    println!("Hello from the Project IDE!");
}

// Add helper functions below and click Run Tests
`;

const defaultTests = `#[cfg(test)]
mod tests {
    #[test]
    fn placeholder() {
        // This is a placeholder test. Extend this to practice.
        assert_eq!(2 + 2, 4);
    }
}
`;

function ProjectIDE() {
  const [files, setFiles] = useState<Record<FileName, string>>({
    "main.rs": defaultCode,
    "tests.rs": defaultTests,
  });
  const [tree, setTree] = useState<IdeNode[]>([
    { type: "file", name: "main.rs", path: "main.rs" },
    { type: "file", name: "tests.rs", path: "tests.rs" },
  ]);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [dirtyFiles, setDirtyFiles] = useState<Record<string, boolean>>({});
  const [openFiles, setOpenFiles] = useState<FileName[]>(["main.rs"]);
  const [currentFile, setCurrentFile] = useState<FileName>("main.rs");
  const [selectedPath, setSelectedPath] = useState<string>("main.rs");
  const [selectedIsFolder, setSelectedIsFolder] = useState(false);
  const [cwd, setCwd] = useState<string>("/");
  const [openEditorsOpen, setOpenEditorsOpen] = useState(true);
  const [pendingCreate, setPendingCreate] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [results, setResults] = useState<{ name: string; pass: boolean; message?: string }[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    open: boolean;
    x: number;
    y: number;
    target?: string;
    isFolder?: boolean;
  }>({ open: false, x: 0, y: 0 });
  const [renamingPath, setRenamingPath] = useState<string | null>(null);

  const handleRun = async () => {
    setStatus("running");
    setError(null);
    setResults([]);
    setOutput(null);
    setTerminalLines((prev) => [...prev, "> cargo test (simulated)"]);
    try {
      const response = await runTests({
        userCode: files["main.rs"],
        tests: files["tests.rs"],
        exerciseId: "project-ide",
        lessonId: "project-ide",
        lessonTitle: "Project IDE",
      });
      setResults(response.results);
      setOutput(response.rawOutput ?? null);
      setStatus("done");
      if (response.rawOutput !== undefined) {
        const log = response.rawOutput;
        setTerminalLines((prev) => [...prev, log]);
      }
    } catch (err) {
      setStatus("done");
      setError(err instanceof Error ? err.message : String(err));
      setTerminalLines((prev) => [
        ...prev,
        typeof err === "string" ? err : "Error running tests",
      ]);
    }
  };

  const handleReset = () => {
    setFiles({
      "main.rs": defaultCode,
      "tests.rs": defaultTests,
    });
    setTree([
      { type: "file", name: "main.rs", path: "main.rs" },
      { type: "file", name: "tests.rs", path: "tests.rs" },
    ]);
    setCurrentFile("main.rs");
    setSelectedPath("main.rs");
    setSelectedIsFolder(false);
    setCwd("/");
    setResults([]);
    setOutput(null);
    setStatus("idle");
    setError(null);
  };

  const upsertNode = (
    nodes: IdeNode[],
    parts: string[],
    isFile: boolean,
    parentPath = ""
  ): IdeNode[] => {
    if (parts.length === 0) return nodes;
    const [head, ...rest] = parts;
    const path = parentPath ? `${parentPath}/${head}` : head;
    const idx = nodes.findIndex((n) => n.name === head);
    if (rest.length === 0) {
      if (isFile) {
        if (idx !== -1 && nodes[idx].type === "file") return nodes;
        const newFile: IdeNode = { type: "file", name: head, path };
        return idx === -1
          ? [...nodes, newFile]
          : nodes.map((n, i) => (i === idx ? newFile : n));
      } else {
        if (idx !== -1 && nodes[idx].type === "folder") return nodes;
        return idx === -1
          ? [...nodes, { type: "folder", name: head, path, children: [] }]
          : nodes;
      }
    } else {
      // Ensure folder exists
      let folderNode: IdeNode | undefined = nodes[idx];
      if (!folderNode || folderNode.type !== "folder") {
        folderNode = { type: "folder", name: head, path, children: [] };
        nodes = [...nodes, folderNode];
      }
      const updatedChildren = upsertNode(folderNode.children, rest, isFile, path);
      return nodes.map((n) =>
        n.path === path ? { ...n, children: updatedChildren } as IdeNode : n
      );
    }
  };

  const unique = (arr: string[]) => Array.from(new Set(arr));

  const addFile = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setFiles((prev) => ({ ...prev, [trimmed]: prev[trimmed] ?? "// scratch file\n" }));
    setTree((prev) => upsertNode(prev, trimmed.split("/"), true));
    setOpenFiles((prev) => unique(prev.concat(trimmed)));
    setDirtyFiles((prev) => ({ ...prev, [trimmed]: false }));
    setCurrentFile(trimmed);
    setSelectedPath(trimmed);
    setSelectedIsFolder(false);
    revealPath(trimmed);
  };

  const addFolder = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setTree((prev) => upsertNode(prev, trimmed.split("/"), false));
    setOpenFolders((prev) => ({ ...prev, [trimmed]: true }));
    setSelectedPath(trimmed);
    setSelectedIsFolder(true);
    revealPath(trimmed);
  };

  const createNewItem = (type: "file" | "folder") => {
    const base = selectedIsFolder ? selectedPath : parentPath(selectedPath);
    addChildInPath(base, type);
  };

  const removeNode = (
    nodes: IdeNode[],
    targetPath: string
  ): { updated: IdeNode[]; removed?: IdeNode } => {
    let removed: IdeNode | undefined;
    const filtered = nodes
      .map((node) => {
        if (node.path === targetPath) {
          removed = node;
          return null;
        }
        if (node.type === "folder") {
          const res = removeNode(node.children, targetPath);
          if (res.removed) {
            removed = res.removed;
            return { ...node, children: res.updated };
          }
        }
        return node;
      })
      .filter(Boolean) as IdeNode[];
    return { updated: filtered, removed };
  };

  const upsertExisting = (nodes: IdeNode[], node: IdeNode): IdeNode[] => {
    const parts = node.path.split("/");
    const isFile = node.type === "file";
    return upsertNode(nodes, parts, isFile);
  };

  const pathParts = (path: string) => (path ? path.split("/") : []);
  const parentPath = (path: string) => {
    const parts = pathParts(path);
    parts.pop();
    return parts.join("/");
  };

  const revealPath = (path: string) => {
    const parts = pathParts(path);
    let acc = "";
    const updates: Record<string, boolean> = {};
    parts.forEach((part, idx) => {
      if (idx === parts.length - 1) return;
      acc = acc ? `${acc}/${part}` : part;
      updates[acc] = true;
    });
    setOpenFolders((prev) => ({ ...prev, ...updates }));
  };

  const ensureUniqueName = (base: string, siblings: IdeNode[]) => {
    let candidate = base;
    let counter = 1;
    const names = new Set(siblings.map((n) => n.name));
    while (names.has(candidate)) {
      candidate = `${base}-${counter++}`;
    }
    return candidate;
  };

  const addChildInPath = (basePath: string, type: "file" | "folder") => {
    const children = basePath ? listChildren(basePath) : tree;
    const baseName = type === "file" ? "untitled.rs" : "NewFolder";
    const name = ensureUniqueName(baseName, children);
    const fullPath = basePath ? `${basePath}/${name}` : name;
    if (type === "file") addFile(fullPath);
    else addFolder(fullPath);
    setRenamingPath(fullPath);
    setPendingCreate((prev) => ({ ...prev, [fullPath]: true }));
  };

  const remapPaths = (node: IdeNode, from: string, to: string): IdeNode => {
    const newNode = { ...node, path: node.path.replace(new RegExp(`^${from}`), to) };
    if (newNode.type === "folder") {
      newNode.children = newNode.children.map((child) => remapPaths(child, from, to));
    }
    return newNode;
  };

  const renameNode = (nodes: IdeNode[], oldPath: string, newPath: string): { updated: IdeNode[]; renamed?: IdeNode } => {
    let renamed: IdeNode | undefined;
    const updated = nodes.map((node) => {
      if (node.path === oldPath) {
        const newName = newPath.split("/").pop() || node.name;
        if (node.type === "file") {
          renamed = { ...node, name: newName, path: newPath };
          return renamed;
        }
        if (node.type === "folder") {
          const remapped = remapPaths({ ...node, name: newName, path: newPath }, oldPath, newPath);
          renamed = remapped;
          return remapped;
        }
      }
      if (node.type === "folder") {
        const res = renameNode(node.children, oldPath, newPath);
        if (res.renamed) renamed = res.renamed;
        return { ...node, children: res.updated };
      }
      return node;
    });
    return { updated, renamed };
  };

  const openContextMenu = (x: number, y: number, target?: string, isFolder?: boolean) => {
    setContextMenu({ open: true, x, y, target, isFolder });
  };

  const closeContextMenu = () => setContextMenu({ open: false, x: 0, y: 0 });

  const normalizePath = (base: string, target: string) => {
    const stack: string[] = [];
    const raw = target.startsWith("/")
      ? target.slice(1)
      : base === "/"
      ? target
      : `${base.slice(1)}/${target}`;
    raw.split("/").forEach((part) => {
      if (!part || part === ".") return;
      if (part === "..") {
        stack.pop();
      } else {
        stack.push(part);
      }
    });
    return stack.join("/");
  };

  const findNode = (nodes: IdeNode[], targetPath: string): IdeNode | undefined => {
    for (const node of nodes) {
      if (node.path === targetPath) return node;
      if (node.type === "folder") {
        const found = findNode(node.children, targetPath);
        if (found) return found;
      }
    }
    return undefined;
  };

  const listChildren = (path: string): IdeNode[] => {
    if (!path) return tree;
    const node = findNode(tree, path);
    if (node && node.type === "folder") {
      return node.children;
    }
    return [];
  };

  const runShellCommand = async (cmd: string) => {
    const prompt = `${cwd}> ${cmd}`;
    setTerminalLines((prev) => [...prev, prompt]);
    if (!cmd.trim()) return;

    const [binary, ...args] = cmd.trim().split(/\s+/);

    if (binary === "pwd") {
      setTerminalLines((prev) => [...prev, cwd]);
      return;
    }

    if (binary === "ls") {
      const pathArg = args[0];
      const target = pathArg ? normalizePath(cwd, pathArg) : cwd === "/" ? "" : cwd.slice(1);
      const children = listChildren(target);
      const line =
        children.length === 0
          ? "(empty)"
          : children
              .map((n) => (n.type === "folder" ? `${n.name}/` : n.name))
              .join("  ");
      setTerminalLines((prev) => [...prev, line]);
      return;
    }

    if (binary === "cd") {
      const pathArg = args[0] ?? "/";
      const target = normalizePath(cwd, pathArg);
      const node = target ? findNode(tree, target) : ({ type: "folder" } as IdeNode);
      if (!target || (node && node.type === "folder")) {
        const display = target ? `/${target}` : "/";
        setCwd(display);
        setSelectedPath(target || "/");
        setSelectedIsFolder(true);
        setOpenFolders((prev) => ({ ...prev, [target || "/"]: true }));
      } else {
        setTerminalLines((prev) => [...prev, `cd: no such directory: ${pathArg}`]);
      }
      return;
    }

    if (binary === "mkdir") {
      const pathArg = args[0];
      if (!pathArg) {
        setTerminalLines((prev) => [...prev, "mkdir: missing operand"]);
        return;
      }
      const target = normalizePath(cwd, pathArg);
      addFolder(target);
      return;
    }

    if (binary === "touch") {
      const pathArg = args[0];
      if (!pathArg) {
        setTerminalLines((prev) => [...prev, "touch: missing file operand"]);
        return;
      }
      const target = normalizePath(cwd, pathArg);
      addFile(target);
      return;
    }

    if (binary === "cat") {
      const pathArg = args[0];
      if (!pathArg) {
        setTerminalLines((prev) => [...prev, "cat: missing file operand"]);
        return;
      }
      const target = normalizePath(cwd, pathArg);
      const content = files[target];
      if (content !== undefined) {
        setTerminalLines((prev) => [...prev, content]);
      } else {
        setTerminalLines((prev) => [...prev, `cat: ${pathArg}: No such file`]);
      }
      return;
    }

    if (binary === "clear" || binary === "cls") {
      setTerminalLines([]);
      return;
    }

    if (binary === "help") {
      setTerminalLines((prev) => [
        ...prev,
        "Supported commands:",
        "  pwd, ls, cd <path>, mkdir <path>, touch <path>, cat <file>, clear/cls, cargo test, cargo run",
      ]);
      return;
    }

    if (binary === "cargo" && (args[0] === "test" || args[0] === "run")) {
      await handleRun();
      return;
    }

    if (binary === "rustc") {
      const pathArg = args[0] ?? "main.rs";
      const target = normalizePath(cwd, pathArg) || "main.rs";
      if (!files[target]) {
        setTerminalLines((prev) => [...prev, `rustc: cannot find ${pathArg}`]);
        return;
      }
      setTerminalLines((prev) => [...prev, `Compiling ${target} (simulated)`]);
      await handleRun();
      return;
    }

    if (binary.startsWith("./")) {
      setTerminalLines((prev) => [...prev, `Running binary ${binary} (simulated)`]);
      await handleRun();
      return;
    }

    setTerminalLines((prev) => [...prev, `Command not supported: ${cmd}`]);
  };

  const sortedNodes = (nodes: IdeNode[]) => {
    return [...nodes].sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  };

  const renderNodes = (nodes: IdeNode[], depth = 0): JSX.Element[] => {
    return sortedNodes(nodes).map((node) => {
      if (node.type === "file") {
        const isRenaming = renamingPath === node.path;
        return (
          <div key={node.path} className="explorer-file-row" style={{ paddingLeft: 12 + depth * 12 }}>
            {isRenaming ? (
              <input
                className="rename-input"
                autoFocus
                defaultValue={renamingPath === node.path ? "" : node.name}
                placeholder=""
                onBlur={(e) => applyRename(node.path, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyRename(node.path, (e.target as HTMLInputElement).value);
                  if (e.key === "Escape") setRenamingPath(null);
                }}
              />
            ) : (
              <button
                className={`explorer-file ${currentFile === node.path ? "active" : ""} ${selectedPath === node.path ? "selected" : ""}`}
                onClick={() => {
                  setCurrentFile(node.path);
                  setOpenFiles((prev) => unique(prev.concat(node.path)));
                  setSelectedPath(node.path);
                  setSelectedIsFolder(false);
                  revealPath(node.path);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  openContextMenu(e.clientX, e.clientY, node.path, false);
                }}
              >
                <span className="file-label">
                  {node.name}
                  {dirtyFiles[node.path] && <span className="dirty-dot">•</span>}
                </span>
              </button>
            )}
          </div>
        );
      }
      const isOpen = openFolders[node.path] ?? true;
      return (
        <div key={node.path} className="explorer-folder">
          {renamingPath === node.path ? (
            <div className="explorer-file-row" style={{ paddingLeft: 8 + depth * 12 }}>
              <input
                className="rename-input"
                autoFocus
                defaultValue={renamingPath === node.path ? "" : node.name}
                placeholder=""
                onBlur={(e) => applyRename(node.path, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyRename(node.path, (e.target as HTMLInputElement).value);
                  if (e.key === "Escape") setRenamingPath(null);
                }}
              />
            </div>
          ) : (
            <button
              className={`explorer-file folder ${selectedPath === node.path ? "selected" : ""}`}
              style={{ paddingLeft: 8 + depth * 12 }}
              onClick={() =>
                setOpenFolders((prev) => ({ ...prev, [node.path]: !isOpen }))
              }
              onDoubleClick={() => {
                setSelectedPath(node.path);
                setSelectedIsFolder(true);
              }}
              onClickCapture={() => {
                setSelectedPath(node.path);
                setSelectedIsFolder(true);
                revealPath(node.path);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                openContextMenu(e.clientX, e.clientY, node.path, true);
              }}
            >
              <span className="caret">{isOpen ? "▾" : "▸"}</span>
              <span className={`glyph folder ${isOpen ? "open" : "closed"}`} />
              {node.name}
            </button>
          )}
          {isOpen && node.children.length === 0 && (
            <div className="explorer-empty" style={{ paddingLeft: 20 + depth * 12 }}>
              Empty folder
            </div>
          )}
          {isOpen && renderNodes(node.children, depth + 1)}
        </div>
      );
    });
  };

  const onEdit = (value: string) => {
    setFiles((prev) => ({ ...prev, [currentFile]: value }));
    setDirtyFiles((prev) => ({ ...prev, [currentFile]: true }));
  };

  const markSaved = () => {
    setDirtyFiles((prev) => ({ ...prev, [currentFile]: false }));
  };

  const sendTerminalCommand = async (cmd: string) => {
    await runShellCommand(cmd);
  };

  const closeFile = (path: string) => {
    setOpenFiles((prev) => prev.filter((p) => p !== path));
    if (currentFile === path) {
      const next = openFiles.find((p) => p !== path) || "main.rs";
      setCurrentFile(next as FileName);
      revealPath(next);
    }
  };

  const startRename = (path: string) => {
    setRenamingPath(path);
  };

  const applyRename = (path: string, newName: string) => {
    const parent = parentPath(path);
    const newPath = parent ? `${parent}/${newName}` : newName;
    if (newPath === path || !newName.trim()) {
      if (pendingCreate[path]) {
        setPendingCreate((prev) => {
          const clone = { ...prev };
          delete clone[path];
          return clone;
        });
        applyDelete(path);
      }
      setRenamingPath(null);
      return;
    }
    setTree((prev) => {
      const { updated, renamed } = renameNode(prev, path, newPath);
      if (!renamed) return prev;
      setFiles((filesPrev) => {
        if (renamed?.type === "file" && filesPrev[path] !== undefined) {
          const clone = { ...filesPrev };
          clone[newPath] = clone[path];
          delete clone[path];
          return clone;
        }
        return filesPrev;
      });
      setDirtyFiles((dirtyPrev) => {
        if (dirtyPrev[path] === undefined) return dirtyPrev;
        const clone = { ...dirtyPrev };
        clone[newPath] = clone[path];
        delete clone[path];
        return clone;
      });
      setOpenFiles((filesPrev) =>
        filesPrev.map((f) => (f === path ? (renamed.type === "file" ? newPath : f) : f))
      );
      if (currentFile === path) setCurrentFile(newPath as FileName);
      setSelectedPath(newPath);
      setRenamingPath(null);
      return updated;
    });
  };

  const applyDelete = (path: string) => {
    setTree((prev) => {
      const { updated, removed } = removeNode(prev, path);
      if (!removed) return prev;
      setFiles((prevFiles) => {
        if (removed.type === "file" && prevFiles[path] !== undefined) {
          const clone = { ...prevFiles };
          delete clone[path];
          return clone;
        }
        if (removed.type === "folder") {
          const clone = { ...prevFiles };
          Object.keys(clone).forEach((k) => {
            if (k.startsWith(`${path}/`) || k === path) delete clone[k];
          });
          return clone;
        }
        return prevFiles;
      });
      setDirtyFiles((prevDirty) => {
        const clone = { ...prevDirty };
        Object.keys(clone).forEach((k) => {
          if (k.startsWith(`${path}/`) || k === path) delete clone[k];
        });
        return clone;
      });
      setPendingCreate((prev) => {
        const clone = { ...prev };
        Object.keys(clone).forEach((k) => {
          if (k.startsWith(`${path}/`) || k === path) delete clone[k];
        });
        return clone;
      });
      setOpenFiles((prevOpen) => prevOpen.filter((f) => f !== path && !f.startsWith(`${path}/`)));
      if (currentFile === path || currentFile.startsWith(`${path}/`)) {
        const fallback = updated.find((n) => n.type === "file")?.path || "main.rs";
        setCurrentFile(fallback as FileName);
      }
      if (selectedPath.startsWith(path)) {
        setSelectedPath("main.rs");
        setSelectedIsFolder(false);
      }
      return updated;
    });
  };

  useEffect(() => {
    const raw = localStorage.getItem("ide-state");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.files) setFiles(parsed.files);
        if (parsed.tree) setTree(parsed.tree);
        if (parsed.dirtyFiles) setDirtyFiles(parsed.dirtyFiles);
        if (parsed.openFiles) setOpenFiles(unique(parsed.openFiles));
        if (parsed.currentFile) setCurrentFile(parsed.currentFile);
        if (parsed.openFolders) setOpenFolders(parsed.openFolders);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ide-state",
      JSON.stringify({ files, tree, dirtyFiles, openFiles, currentFile, openFolders })
    );
  }, [files, tree, dirtyFiles, openFiles, currentFile, openFolders]);

  useEffect(() => {
    if (currentFile) revealPath(currentFile);
  }, [currentFile]);

  return (
    <div className="ide-shell ide-page">
      <div className="ide-topbar" />

      <div className="ide-body">
        <div className="ide-explorer">
          <div className="explorer-header">
              <div className="explorer-actions">
              <button className="icon-btn new-file" title="New File" onClick={() => createNewItem("file")} aria-label="New File">
                📄+
              </button>
              <button className="icon-btn new-folder" title="New Folder" onClick={() => createNewItem("folder")} aria-label="New Folder">
                📁+
              </button>
              <button
                className="icon-btn rename"
                title="Rename/Move"
                onClick={() => {
                  if (!selectedPath) return;
                  startRename(selectedPath);
                }}
                aria-label="Rename/Move"
              >
                ✎
              </button>
              <button
                className="icon-btn delete"
                title="Delete"
                onClick={() => {
                  if (!selectedPath) return;
                  const confirm = window.confirm(`Delete ${selectedPath}?`);
                  if (!confirm) return;
                  applyDelete(selectedPath);
                }}
                aria-label="Delete"
              >
                🗑
              </button>
            </div>
          </div>
          <div className="explorer-workspace">RUST-LM</div>
          <div className="explorer-files">{renderNodes(tree)}</div>
          <div className="open-editors">
            <button
              className="explorer-file folder"
              onClick={() => setOpenEditorsOpen((v) => !v)}
            >
              <span className="caret">{openEditorsOpen ? "▾" : "▸"}</span>
              OPEN EDITORS
            </button>
            {openEditorsOpen &&
              openFiles.map((file) => (
                <button
                  key={file}
                  className={`explorer-file ${currentFile === file ? "active" : ""}`}
                  onClick={() => {
                    setCurrentFile(file);
                    revealPath(file);
                  }}
                >
                  <span className="file-label">
                    {file.split("/").pop()}
                    {dirtyFiles[file] && <span className="dirty-dot">•</span>}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file);
                    }}
                  >
                    ×
                  </span>
                </button>
              ))}
          </div>
        </div>
        <div className="ide-pane">
          <div className="tab-bar">
            {openFiles.map((file) => (
              <button
                key={file}
                className={`tab ${currentFile === file ? "active" : ""}`}
                onClick={() => {
                  setCurrentFile(file);
                  revealPath(file);
                }}
              >
                <span className="file-label">
                  {file.split("/").pop()}
                  {dirtyFiles[file] && <span className="dirty-dot">•</span>}
                </span>
                <span
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file);
                  }}
                >
                  ×
                </span>
              </button>
            ))}
          </div>
          <div className="panel-header">
            <span className="eyebrow">
              {currentFile} {dirtyFiles[currentFile] && <span className="dirty-dot small" title="Unsaved">•</span>}
            </span>
          </div>
          <InlineCodeEditor value={files[currentFile]} onChange={onEdit} onSave={markSaved} />
        </div>
      </div>

      <div className="ide-results">
        {results.map((r) => (
          <div key={r.name} className={`result ${r.pass ? "pass" : "fail"}`}>
            <span>{r.name}</span>
            <span>{r.pass ? "pass" : "fail"}</span>
            {r.message && <p className="message">{r.message}</p>}
          </div>
        ))}
        {error && <p className="error">{error}</p>}
        {output && (
          <details>
            <summary>Runner output</summary>
            <HighlightedCode code={output} level="Beginner" />
          </details>
        )}
      </div>

      <div className="ide-terminal">
        <Terminal cwd={cwd} lines={terminalLines} onCommand={sendTerminalCommand} />
      </div>

      {contextMenu.open && (
        <div
          className="context-menu-overlay"
          onClick={closeContextMenu}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
            <button
              onClick={() => {
                const base = contextMenu.isFolder ? contextMenu.target || "" : parentPath(contextMenu.target || "");
                addChildInPath(base, "file");
                closeContextMenu();
              }}
            >
              New File
            </button>
            <button
              onClick={() => {
                const base = contextMenu.isFolder ? contextMenu.target || "" : parentPath(contextMenu.target || "");
                addChildInPath(base, "folder");
                closeContextMenu();
              }}
            >
              New Folder
            </button>
            {contextMenu.target && (
              <>
                <button
                  onClick={() => {
                    startRename(contextMenu.target!);
                    closeContextMenu();
                  }}
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    applyDelete(contextMenu.target!);
                    closeContextMenu();
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(contextMenu.target!);
                    closeContextMenu();
                  }}
                >
                  Copy Path
                </button>
              </>
            )}
            <button
              onClick={() => {
                setOpenFolders({});
                closeContextMenu();
              }}
            >
              Collapse All
            </button>
            <button
              onClick={() => {
                setTree((prev) => [...prev]);
                closeContextMenu();
              }}
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      <div className="ide-statusbar">
        <span>Rust</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>{status === "running" ? "Running tests..." : "Ready"}</span>
      </div>
    </div>
  );
}

export default ProjectIDE;
