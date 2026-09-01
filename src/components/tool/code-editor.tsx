import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import { xml } from '@codemirror/lang-xml'
import { Decoration } from '@codemirror/view'
import { EditorView } from '@codemirror/view'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { useMemo } from 'react'

import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  wrap: boolean
  ariaLabel: string
  language?: 'json' | 'xml' | 'markdown' | 'text'
  errorLine?: number
}

const fontTheme = EditorView.theme({
  '&': { fontSize: '13px' },
  '.cm-content': { fontFamily: 'var(--font-mono)' },
  '.cm-gutters': { fontFamily: 'var(--font-mono)' },
})

const errorLineMark = Decoration.line({ class: 'cm-error-line' })

function lineStartOffset(text: string, lineNumber: number): number {
  const lines = text.split('\n')
  const targetIndex = Math.min(Math.max(lineNumber - 1, 0), lines.length - 1)
  let offset = 0
  for (let i = 0; i < targetIndex; i++) {
    offset += lines[i].length + 1
  }
  return offset
}

function errorLineExtension(text: string, lineNumber: number) {
  return EditorView.decorations.of(Decoration.set([errorLineMark.range(lineStartOffset(text, lineNumber))]))
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  readOnly,
  wrap,
  ariaLabel,
  language = 'json',
  errorLine,
}: CodeEditorProps) {
  const { theme } = useTheme()

  const extensions = useMemo(() => {
    const languageExtension = language === 'xml' ? xml() : language === 'markdown' ? markdown() : language === 'json' ? json() : []
    const base = [fontTheme, languageExtension]
    const withWrap = wrap ? [...base, EditorView.lineWrapping] : base
    return errorLine ? [...withWrap, errorLineExtension(value, errorLine)] : withWrap
  }, [language, wrap, errorLine, value])

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        'h-full min-h-[260px] w-full overflow-hidden rounded-lg border border-input',
        'transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50',
        readOnly && 'bg-muted/30',
      )}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        editable={!readOnly}
        theme={theme === 'dark' ? vscodeDark : vscodeLight}
        extensions={extensions}
        height="100%"
        style={{ height: '100%' }}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: false,
        }}
      />
    </div>
  )
}
