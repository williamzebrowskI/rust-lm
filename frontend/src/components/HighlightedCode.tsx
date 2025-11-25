import { useMemo } from "react";

interface Props {
  code: string;
  level?: string;
}

const KEYWORDS =
  "fn|let|mut|pub|struct|enum|impl|trait|use|mod|match|if|else|while|loop|for|in|return|async|await|move|ref|crate|super|self|Self|const|static|unsafe|extern|type|where";

function escapeHtml(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightRust(code: string) {
  let html = escapeHtml(code);
  // Comments
  html = html.replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>');
  // Strings
  html = html.replace(/(\"(?:[^\"\\\\]|\\\\.)*\")/g, '<span class="tok-string">$1</span>');
  // Numbers with optional suffixes
  html = html.replace(/\\b(\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?(?:f32|f64|i\\d+|u\\d+|usize|isize)?)\\b/g, '<span class="tok-number">$1</span>');
  // Keywords
  html = html.replace(new RegExp(`\\b(${KEYWORDS})\\b`, "g"), '<span class="tok-keyword">$1</span>');
  // Types starting with uppercase
  html = html.replace(/\\b([A-Z][A-Za-z0-9_]*)\\b/g, '<span class="tok-type">$1</span>');
  return html;
}

function HighlightedCode({ code, level = "Beginner" }: Props) {
  const rendered = useMemo(() => highlightRust(code), [code]);

  return (
    <pre className="code-block" data-level={level}>
      <code dangerouslySetInnerHTML={{ __html: rendered }} />
    </pre>
  );
}

export default HighlightedCode;
