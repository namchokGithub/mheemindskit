import { ArrowLeftRight, ChevronDown, Eraser, FileText } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { TextStats } from '@/components/tool/text-stats'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { convertLettersToNumbers, convertNumbersToLetters, numberLetterMappings, type NumberLetterMapping } from '@/features/value-converters'
import { useLargeInputConfirmation } from '@/hooks/use-large-input-confirmation'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'
import { cn } from '@/lib/utils'

const samples: Record<NumberLetterMapping, string> = {
  'a1z26-uppercase': '1, 2, 3, 13, 26',
  'a1z26-lowercase': '1, 2, 3, 13, 26',
  'reverse-uppercase': '1, 2, 3, 13, 26',
  'reverse-lowercase': '1, 2, 3, 13, 26',
  ascii: '72 101 108 108 111 33',
  roman: '1, 4, 9, 42, 2026',
}

const letterSamples: Record<NumberLetterMapping, string> = {
  'a1z26-uppercase': 'A, B, C, M, Z',
  'a1z26-lowercase': 'a, b, c, m, z',
  'reverse-uppercase': 'Z, Y, X, N, A',
  'reverse-lowercase': 'z, y, x, n, a',
  ascii: 'Hello!',
  roman: 'I, IV, IX, XLII, MMXXVI',
}

type Direction = 'numbers-to-letters' | 'letters-to-numbers'

export function NumbersToLettersPage() {
  const { enabled } = useSaveLocally()
  const [input, setInput] = usePersistedInput('numbers-to-letters', enabled)
  const [mapping, setMapping] = useState<NumberLetterMapping>('a1z26-uppercase')
  const [direction, setDirection] = useState<Direction>('numbers-to-letters')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const { confirm, dialog } = useLargeInputConfirmation()

  const convert = (value = input) => {
    try {
      setOutput(direction === 'numbers-to-letters' ? convertNumbersToLetters(value, mapping) : convertLettersToNumbers(value, mapping))
      setError('')
    } catch (cause) {
      setOutput('')
      setError(cause instanceof Error ? cause.message : 'Unable to convert these numbers.')
    }
  }

  const changeMapping = (next: NumberLetterMapping) => {
    setMapping(next)
    setOutput('')
    setError('')
  }

  const useSample = () => {
    const sample = direction === 'numbers-to-letters' ? samples[mapping] : letterSamples[mapping]
    setInput(sample)
    convert(sample)
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-full">
      <ToolPageHeader title="Letters ↔ Numbers" description="Convert numbers and letters using alphabet mappings, printable ASCII characters, or Roman numerals locally in your browser." />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
          <div className="flex items-center gap-1 rounded-lg border border-input p-1">
            <Button type="button" size="sm" variant={direction === 'numbers-to-letters' ? 'secondary' : 'ghost'} onClick={() => { setDirection('numbers-to-letters'); setOutput(''); setError('') }}>Numbers → Letters</Button>
            <Button type="button" size="sm" variant={direction === 'letters-to-numbers' ? 'secondary' : 'ghost'} onClick={() => { setDirection('letters-to-numbers'); setOutput(''); setError('') }}>Letters → Numbers</Button>
          </div>
          <Button type="button" size="sm" onClick={() => confirm(input, () => convert())} disabled={!input.trim()}><ArrowLeftRight />Convert</Button>
          <Button type="button" size="sm" variant="outline" onClick={useSample}><FileText />Sample</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => { setInput(''); setOutput(''); setError('') }} disabled={!input && !output}><Eraser />Clear</Button>
        </div>

        <div className="tool-workspace-grid grid min-h-0 flex-1 grid-cols-1 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <section className="flex min-h-65 min-w-0 flex-col bg-editor/40 lg:min-h-0">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">{direction === 'numbers-to-letters' ? 'Numbers input' : 'Letters input'}</span><TextStats value={input} /></div>
            <CodeEditor bare value={input} onChange={(value) => { setInput(value); setOutput(''); setError('') }} placeholder={direction === 'numbers-to-letters' ? 'e.g. 1, 2, 3, 26' : 'e.g. A, B, C, Z'} wrap ariaLabel={direction === 'numbers-to-letters' ? 'Numbers input' : 'Letters input'} language="text" />
          </section>
          <section className="flex min-h-65 min-w-0 flex-col bg-muted/20 lg:min-h-0">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">{direction === 'numbers-to-letters' ? 'Letters output' : 'Numbers output'}</span><CopyButton value={output} /></div>
            <CodeEditor bare value={output} readOnly placeholder="Converted values will appear here." wrap ariaLabel={direction === 'numbers-to-letters' ? 'Letters output' : 'Numbers output'} language="text" />
          </section>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-foreground">Conversion mapping</h2><p className="text-xs text-muted-foreground">Choose how values are represented in this direction.</p></div><span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">{numberLetterMappings[mapping].range}</span></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(numberLetterMappings) as Array<[NumberLetterMapping, typeof numberLetterMappings[NumberLetterMapping]]>).map(([value, option]) => <button key={value} type="button" onClick={() => changeMapping(value)} aria-pressed={mapping === value} className={cn('rounded-lg border p-3 text-left transition-colors hover:bg-accent/60', mapping === value ? 'border-primary bg-primary/10 ring-1 ring-primary/30' : 'border-border bg-background')}><span className="block text-sm font-medium text-foreground">{option.label}</span><span className="mt-1 block font-mono text-xs text-primary-hover">{direction === 'numbers-to-letters' ? option.example : letterSamples[value]}</span><span className="mt-1 block text-xs text-muted-foreground">{option.description}</span></button>)}
        </div>
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="mt-4 border-t border-border pt-3"><CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium text-foreground"><span>How input works</span><ChevronDown className={cn('size-4 transition-transform', advancedOpen && 'rotate-180')} /></CollapsibleTrigger><CollapsibleContent className="pt-2 text-sm text-muted-foreground">{direction === 'numbers-to-letters' ? 'Enter whole numbers separated by spaces, commas, or lines. Separators and other text are preserved in the output.' : 'Alphabet and Roman mappings preserve separators. ASCII converts every printable character and separates resulting character codes with spaces.'} Each mapping validates its supported range before converting.</CollapsibleContent></Collapsible>
      </section>

      <ToolStatus state={error ? 'invalid' : output ? 'valid' : 'idle'} message={error} validLabel={`${direction === 'numbers-to-letters' ? 'Letters' : 'Numbers'} converted successfully`} />
      {dialog}
    </div>
  )
}
