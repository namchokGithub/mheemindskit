import { Eraser, FileText, WrapText, type LucideIcon } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { IndentSelect } from '@/components/tool/indent-select'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { Button } from '@/components/ui/button'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'
import { cn } from '@/lib/utils'
import type { FormatResult, IndentOption } from '@/types/format'

export interface FormatterPageConfig {
  title: string
  description: string
  actionLabel: string
  actionIcon: LucideIcon
  successLabel: string
  sample: () => string
  showIndent: boolean
  inputPlaceholder: string
  storageKey: string
  process: (input: string, indent: IndentOption) => FormatResult
}

export function FormatterPage(config: FormatterPageConfig) {
  const { enabled: saveLocally } = useSaveLocally()
  const [input, setInput] = usePersistedInput(config.storageKey, saveLocally)
  const [indent, setIndent] = useState<IndentOption>('2')
  const [wrap, setWrap] = useState(false)
  const [result, setResult] = useState<FormatResult | null>(null)

  const ActionIcon = config.actionIcon

  const run = (nextInput: string, nextIndent: IndentOption) => {
    setResult(config.process(nextInput, nextIndent))
  }

  const handleInputChange = (next: string) => {
    setInput(next)
    setResult(null)
  }

  const handleIndentChange = (next: IndentOption) => {
    setIndent(next)
    if (result?.ok) run(input, next)
  }

  const handleSample = () => {
    const sample = config.sample()
    setInput(sample)
    run(sample, indent)
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <ToolPageHeader title={config.title} description={config.description} />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Input</span>
          <CodeEditor
            value={input}
            onChange={handleInputChange}
            placeholder={config.inputPlaceholder}
            wrap={wrap}
            ariaLabel="Input"
            errorLine={result && !result.ok ? result.line : undefined}
          />
        </div>

        <div className="order-first flex flex-wrap items-center gap-2 lg:order-none lg:w-40 lg:shrink-0 lg:flex-col lg:justify-center lg:gap-2.5 lg:border-x lg:border-border lg:px-4">
          <Button
            type="button"
            className="lg:w-full"
            onClick={() => run(input, indent)}
            disabled={!input.trim()}
          >
            <ActionIcon />
            {config.actionLabel}
          </Button>
          {config.showIndent && (
            <IndentSelect value={indent} onChange={handleIndentChange} className="lg:w-full" />
          )}
          <Button type="button" variant="outline" size="sm" className="lg:w-full" onClick={handleSample}>
            <FileText />
            Sample
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="lg:w-full"
            onClick={handleClear}
            disabled={!input}
          >
            <Eraser />
            Clear
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={wrap}
            onClick={() => setWrap((w) => !w)}
            className={cn('lg:w-full', wrap && 'bg-accent text-accent-foreground')}
          >
            <WrapText />
            Wrap
          </Button>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Output</span>
            <CopyButton value={result?.ok ? result.output : ''} />
          </div>
          <CodeEditor
            value={result?.ok ? result.output : ''}
            readOnly
            placeholder="Result will appear here."
            wrap={wrap}
            ariaLabel="Output"
          />
        </div>
      </div>

      <div className="shrink-0">
        <ToolStatus
          state={result === null ? 'idle' : result.ok ? 'valid' : 'invalid'}
          message={result && !result.ok ? result.message : undefined}
          line={result && !result.ok ? result.line : undefined}
          column={result && !result.ok ? result.column : undefined}
          validLabel={config.successLabel}
        />
      </div>
    </div>
  )
}
