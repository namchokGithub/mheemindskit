import { Eraser, FileText, WrapText, type LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'
import { cn } from '@/lib/utils'
import type { TextOperation } from '@/features/text-tools/text'

type TextTransformPageConfig = {
  title: string
  description: string
  actionLabel: string
  actionIcon: LucideIcon
  storageKey: string
  inputPlaceholder: string
  sample: string
  process: (input: string, option: string, prefix?: string, suffix?: string) => string
  operations?: TextOperation[]
  delimiter?: { label: string; placeholder: string; defaultValue: string }
  affixes?: boolean
  language?: 'json' | 'xml' | 'markdown' | 'text'
  outputPreview?: (output: string) => ReactNode
}

export function TextTransformPage(config: TextTransformPageConfig) {
  const { enabled: saveLocally } = useSaveLocally()
  const [input, setInput] = usePersistedInput(config.storageKey, saveLocally)
  const [output, setOutput] = useState('')
  const [wrap, setWrap] = useState(false)
  const [option, setOption] = useState(config.operations?.[0]?.value ?? config.delimiter?.defaultValue ?? '')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [hasRun, setHasRun] = useState(false)
  const ActionIcon = config.actionIcon

  const run = (nextInput = input, nextOption = option) => {
    setOutput(config.process(nextInput, nextOption, prefix, suffix))
    setHasRun(true)
  }

  const handleInputChange = (next: string) => {
    setInput(next)
    setHasRun(false)
  }

  const handleOptionChange = (next: string) => {
    setOption(next)
    if (hasRun) run(input, next)
  }

  const handlePrefixChange = (value: string) => {
    setPrefix(value)
    if (hasRun) setOutput(config.process(input, option, value, suffix))
  }

  const handleSuffixChange = (value: string) => {
    setSuffix(value)
    if (hasRun) setOutput(config.process(input, option, prefix, value))
  }

  const handleSample = () => {
    setInput(config.sample)
    run(config.sample)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setHasRun(false)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <ToolPageHeader title={config.title} description={config.description} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
          <Button type="button" size="sm" onClick={() => run()} disabled={!input}>
            <ActionIcon />
            {config.actionLabel}
          </Button>
          {config.operations && (
            <Select value={option} onValueChange={handleOptionChange}>
              <SelectTrigger size="sm" className="w-auto min-w-[8rem]"><SelectValue /></SelectTrigger>
              <SelectContent>{config.operations.map((operation) => <SelectItem key={operation.value} value={operation.value}>{operation.label}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {config.delimiter && (
            <label className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <span className="shrink-0">{config.delimiter.label}</span>
              <input value={option} onChange={(event) => handleOptionChange(event.target.value)} placeholder={config.delimiter.placeholder} className="h-8 w-40 min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" />
            </label>
          )}
          {config.affixes && option === 'affix' && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">Prefix<input value={prefix} onChange={(event) => handlePrefixChange(event.target.value)} placeholder="Optional prefix" className="h-8 w-32 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" /></label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">Suffix<input value={suffix} onChange={(event) => handleSuffixChange(event.target.value)} placeholder="Optional suffix" className="h-8 w-32 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" /></label>
            </div>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleSample}><FileText />Sample</Button>
          <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={!input}><Eraser />Clear</Button>
          <Button type="button" variant="outline" size="sm" aria-pressed={wrap} onClick={() => setWrap((value) => !value)} className={cn(wrap && 'bg-accent text-accent-foreground')}><WrapText />Wrap</Button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
          <div className="flex min-h-0 min-w-0 flex-col border-b border-border lg:border-r lg:border-b-0">
            <span className="px-3 py-1.5 text-sm font-medium text-muted-foreground">Input</span>
            <CodeEditor bare value={input} onChange={handleInputChange} placeholder={config.inputPlaceholder} wrap={wrap} ariaLabel="Input" language={config.language ?? 'text'} />
          </div>

          <div className="flex min-h-0 min-w-0 flex-col">
            <div className="flex items-center justify-between px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">Output</span><CopyButton value={hasRun ? output : ''} /></div>
            {config.outputPreview ? (
              <div className="h-full min-h-[260px] w-full overflow-auto bg-muted/30 p-4">
                {hasRun ? config.outputPreview(output) : <span className="text-sm text-muted-foreground">Result will appear here.</span>}
              </div>
            ) : (
              <CodeEditor bare value={hasRun ? output : ''} readOnly placeholder="Result will appear here." wrap={wrap} ariaLabel="Output" language={config.language ?? 'text'} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
