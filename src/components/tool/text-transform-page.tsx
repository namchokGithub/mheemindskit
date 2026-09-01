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

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <div className="flex min-h-8 items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">Input</span>
            {config.delimiter && (
              <label className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                <span className="shrink-0">{config.delimiter.label}</span>
                <input value={option} onChange={(event) => handleOptionChange(event.target.value)} placeholder={config.delimiter.placeholder} className="h-8 w-48 min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" />
              </label>
            )}
          </div>
          <CodeEditor value={input} onChange={handleInputChange} placeholder={config.inputPlaceholder} wrap={wrap} ariaLabel="Input" language={config.language ?? 'text'} />
        </div>

        <div className="order-first flex flex-wrap items-center gap-2 lg:order-none lg:w-56 lg:shrink-0 lg:flex-col lg:justify-center lg:gap-2.5 lg:border-x lg:border-border lg:px-4">
          <Button type="button" className="lg:w-full" onClick={() => run()} disabled={!input}>
            <ActionIcon />
            {config.actionLabel}
          </Button>
          {config.operations && (
            <Select value={option} onValueChange={handleOptionChange}>
              <SelectTrigger className="lg:w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{config.operations.map((operation) => <SelectItem key={operation.value} value={operation.value}>{operation.label}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {config.affixes && option === 'affix' && (
            <div className="flex w-full flex-col gap-2">
              <label className="space-y-1 text-xs text-muted-foreground">Prefix<input value={prefix} onChange={(event) => handlePrefixChange(event.target.value)} placeholder="Optional prefix" className="mt-1 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" /></label>
              <label className="space-y-1 text-xs text-muted-foreground">Suffix<input value={suffix} onChange={(event) => handleSuffixChange(event.target.value)} placeholder="Optional suffix" className="mt-1 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" /></label>
            </div>
          )}
          <Button type="button" variant="outline" size="sm" className="lg:w-full" onClick={handleSample}><FileText />Sample</Button>
          <Button type="button" variant="outline" size="sm" className="lg:w-full" onClick={handleClear} disabled={!input}><Eraser />Clear</Button>
          <Button type="button" variant="outline" size="sm" aria-pressed={wrap} onClick={() => setWrap((value) => !value)} className={cn('lg:w-full', wrap && 'bg-accent text-accent-foreground')}><WrapText />Wrap</Button>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between"><span className="text-sm font-medium text-muted-foreground">Output</span><CopyButton value={hasRun ? output : ''} /></div>
          {config.outputPreview ? (
            <div className="h-full min-h-[260px] w-full overflow-auto rounded-lg border border-input bg-muted/30 p-4">
              {hasRun ? config.outputPreview(output) : <span className="text-sm text-muted-foreground">Result will appear here.</span>}
            </div>
          ) : (
            <CodeEditor value={hasRun ? output : ''} readOnly placeholder="Result will appear here." wrap={wrap} ariaLabel="Output" language={config.language ?? 'text'} />
          )}
        </div>
      </div>
    </div>
  )
}
