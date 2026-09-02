import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { Decoration } from "@codemirror/view";
import { EditorView } from "@codemirror/view";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { FileUp } from "lucide-react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  wrap: boolean;
  ariaLabel: string;
  language?: "json" | "xml" | "markdown" | "go" | "typescript" | "text";
  errorLine?: number;
  bare?: boolean;
}

const fontTheme = EditorView.theme({
  "&": { fontSize: "13px" },
  ".cm-content": { fontFamily: "var(--font-mono)" },
  ".cm-gutters": { fontFamily: "var(--font-mono)" },
});

const errorLineMark = Decoration.line({ class: "cm-error-line" });
const goTokenPattern = /(`[^`]*`)|\b(type|struct|func|package|import|return|var|const|map|interface|any)\b|\b(string|bool|int|int64|float64|byte|rune)\b/g;
const MAX_IMPORT_SIZE = 10 * 1024 * 1024;

const importFileOptions = {
  json: { accept: ".json,.geojson,.jsonl,.ndjson,.txt,application/json,text/plain", extensions: ["json", "geojson", "jsonl", "ndjson", "txt"] },
  xml: { accept: ".xml,.wsdl,.soap,.xsd,.txt,application/xml,text/xml,text/plain", extensions: ["xml", "wsdl", "soap", "xsd", "txt"] },
  markdown: { accept: ".md,.markdown,.txt,text/markdown,text/plain", extensions: ["md", "markdown", "txt"] },
  go: { accept: ".go,.txt,text/plain", extensions: ["go", "txt"] },
  typescript: { accept: ".ts,.tsx,.txt,text/plain", extensions: ["ts", "tsx", "txt"] },
  text: { accept: ".txt,.csv,.log,.md,text/plain,text/csv", extensions: ["txt", "csv", "log", "md"] },
};

function goHighlightExtension(text: string) {
  const decorations = [];
  for (const match of text.matchAll(goTokenPattern)) {
    const token = match[0];
    const className = token.startsWith("`")
      ? "cm-go-tag"
      : /^(string|bool|int|int64|float64|byte|rune)$/.test(token)
        ? "cm-go-type"
        : "cm-go-keyword";
    decorations.push(Decoration.mark({ class: className }).range(match.index!, match.index! + token.length));
  }
  return Decoration.set(decorations);
}

function lineStartOffset(text: string, lineNumber: number): number {
  const lines = text.split("\n");
  const targetIndex = Math.min(Math.max(lineNumber - 1, 0), lines.length - 1);
  let offset = 0;
  for (let i = 0; i < targetIndex; i++) {
    offset += lines[i].length + 1;
  }
  return offset;
}

function errorLineExtension(text: string, lineNumber: number) {
  return EditorView.decorations.of(
    Decoration.set([errorLineMark.range(lineStartOffset(text, lineNumber))]),
  );
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  readOnly,
  wrap,
  ariaLabel,
  language = "json",
  errorLine,
  bare = false,
}: CodeEditorProps) {
  const { mode } = useTheme();
  const importInputRef = useRef<HTMLInputElement>(null);
  const fileOptions = importFileOptions[language];

  const extensions = useMemo(() => {
    const languageExtension =
      language === "xml"
        ? xml()
        : language === "markdown"
          ? markdown()
        : language === "json"
            ? json()
            : language === "typescript"
              ? javascript({ typescript: true })
            : [];
    const base = [fontTheme, languageExtension];
    const withLanguageHighlighting = language === "go" ? [...base, EditorView.decorations.of(goHighlightExtension(value))] : base;
    const withWrap = wrap ? [...withLanguageHighlighting, EditorView.lineWrapping] : withLanguageHighlighting;
    return errorLine
      ? [...withWrap, errorLineExtension(value, errorLine)]
      : withWrap;
  }, [language, wrap, errorLine, value]);

  const importFile = async (file: File | undefined) => {
    if (!file || !onChange) return;
    if (file.size > MAX_IMPORT_SIZE) {
      toast.error("Choose a text file smaller than 10 MB.");
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !fileOptions.extensions.includes(extension)) {
      toast.error(`This editor accepts ${fileOptions.extensions.map((item) => `.${item}`).join(", ")} files.`);
      return;
    }
    try {
      onChange(await file.text());
      toast.success(`Imported ${file.name}`);
    } catch {
      toast.error("Unable to read this file.");
    }
  };

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        "relative h-full min-h-65 w-full overflow-hidden",
        readOnly ? "bg-muted/30" : "bg-editor",
        bare
          ? "transition-shadow"
          : cn(
              "rounded-[11px] border border-border shadow-sm transition-shadow",
              "focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_0_0_4px_rgba(139,92,246,0.08)]",
            ),
      )}>
      {!readOnly && onChange && (
        <>
          <input
            ref={importInputRef}
            type="file"
            accept={fileOptions.accept}
            className="hidden"
            onChange={(event) => {
              void importFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="absolute top-2 right-2 z-10 bg-background/90 shadow-sm"
            onClick={() => importInputRef.current?.click()}>
            <FileUp />
            Import
          </Button>
        </>
      )}
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        editable={!readOnly}
        theme={mode === "dark" ? vscodeDark : vscodeLight}
        extensions={extensions}
        height="100%"
        style={{ height: "100%" }}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: false,
        }}
      />
    </div>
  );
}
