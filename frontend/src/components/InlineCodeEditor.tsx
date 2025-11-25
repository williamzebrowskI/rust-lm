import { useMemo } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSave?: () => void;
}

const KEYWORDS =
  "fn|let|mut|pub|struct|enum|impl|trait|use|mod|match|if|else|while|loop|for|in|return|async|await|move|ref|crate|super|self|Self|const|static|unsafe|extern|type|where";

function escapeHtml(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightRust(code: string) {
  let html = escapeHtml(code);
  html = html.replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>');
  html = html.replace(/(\"(?:[^\"\\\\]|\\\\.)*\")/g, '<span class="tok-string">$1</span>');
  html = html.replace(
    /\b(\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?(?:f32|f64|i\d+|u\d+|usize|isize)?)\b/g,
    '<span class="tok-number">$1</span>'
  );
  html = html.replace(new RegExp(`\\b(${KEYWORDS})\\b`, "g"), '<span class="tok-keyword">$1</span>');
  html = html.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, '<span class="tok-type">$1</span>');
  return html;
}

function InlineCodeEditor({ value, onChange, onSave }: Props) {
  const highlighted = useMemo(() => highlightRust(value), [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      onSave?.();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const tab = "  ";
      const nextValue = value.slice(0, start) + tab + value.slice(end);
      onChange(nextValue);
      // restore cursor position after React updates value
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + tab.length;
      });
    }
  };

  return (
    <div className="inline-editor">
      <pre className="editor-highlight" aria-hidden="true">
        <code dangerouslySetInnerHTML={{ __html: highlighted + "<br />" }} />
      </pre>
      <textarea
        className="editor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default InlineCodeEditor;
