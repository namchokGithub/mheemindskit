import { Braces, Eraser, FileText, WrapText } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { TextStats } from '@/components/tool/text-stats'
import { Button } from '@/components/ui/button'
import { parseJsonString, stringifyJsonText } from '@/features/formatters/json'
import { useLargeInputConfirmation } from '@/hooks/use-large-input-confirmation'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'
import { cn } from '@/lib/utils'
import type { FormatResult } from '@/types/format'

type Operation = 'stringify' | 'parse'

const samples: Record<Operation, string> = {
  stringify: 'Hello, MindsKit!\nThis text will become a JSON string.',
  parse: '"Hello, MindsKit!\\nThis JSON string will become plain text."',
}

export function JsonStringifyPage() {
  const { enabled: saveLocally } = useSaveLocally()
  const [input, setInput] = usePersistedInput('json-stringify', saveLocally)
  const [operation, setOperation] = useState<Operation>('stringify')
  const [result, setResult] = useState<FormatResult | null>(null)
  const [wrap, setWrap] = useState(false)
  const { confirm, dialog } = useLargeInputConfirmation()

  const run = (value = input, nextOperation = operation) => {
    setResult(nextOperation === 'stringify' ? stringifyJsonText(value) : parseJsonString(value))
  }

  const changeOperation = (nextOperation: Operation) => {
    setOperation(nextOperation)
    setInput(samples[nextOperation])
    setResult(null)
  }

  const inputIsJson = operation === 'parse'

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <ToolPageHeader title="JSON Stringify" description="Convert plain text to a JSON string, or parse a JSON string back to text." />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
          <Button type="button" size="sm" onClick={() => confirm(input, () => run())} disabled={!input.trim()}><Braces />{operation === 'stringify' ? 'Stringify' : 'Parse string'}</Button>
          <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
            <Button type="button" size="xs" variant={operation === 'stringify' ? 'secondary' : 'ghost'} aria-pressed={operation === 'stringify'} onClick={() => changeOperation('stringify')}>Stringify</Button>
            <Button type="button" size="xs" variant={operation === 'parse' ? 'secondary' : 'ghost'} aria-pressed={operation === 'parse'} onClick={() => changeOperation('parse')}>Parse</Button>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => { const sample = samples[operation]; setInput(sample); run(sample) }}><FileText />Sample</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => { setInput(''); setResult(null) }} disabled={!input}><Eraser />Clear</Button>
          <Button type="button" variant="outline" size="sm" aria-pressed={wrap} onClick={() => setWrap((value) => !value)} className={cn(wrap && 'bg-accent text-accent-foreground')}><WrapText />Wrap</Button>
        </div>

        <div className="tool-workspace-grid grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
          <section className="flex min-h-0 min-w-0 flex-col border-b border-border lg:border-r lg:border-b-0">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">{inputIsJson ? 'JSON string input' : 'Text input'}</span><TextStats value={input} /></div>
            <CodeEditor bare value={input} onChange={(value) => { setInput(value); setResult(null) }} placeholder={inputIsJson ? 'Paste a JSON string, e.g. "Hello\\nworld"…' : 'Paste text here…'} wrap={wrap} ariaLabel="Input" language={inputIsJson ? 'json' : 'text'} errorLine={result && !result.ok ? result.line : undefined} />
          </section>
          <section className="flex min-h-0 min-w-0 flex-col">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">{inputIsJson ? 'Plain text output' : 'JSON string output'}</span><CopyButton value={result?.ok ? result.output : ''} /></div>
            <CodeEditor bare value={result?.ok ? result.output : ''} readOnly placeholder="Result will appear here." wrap={wrap} ariaLabel="Output" language={inputIsJson ? 'text' : 'json'} />
          </section>
        </div>
      </div>

      <ToolStatus state={result === null ? 'idle' : result.ok ? 'valid' : 'invalid'} message={result && !result.ok ? result.message : undefined} line={result && !result.ok ? result.line : undefined} column={result && !result.ok ? result.column : undefined} validLabel={operation === 'stringify' ? 'Stringified successfully' : 'Parsed successfully'} />
      {dialog}
    </div>
  )
}
