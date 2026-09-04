import { ArrowLeftRight, CalendarClock, Eraser, FileText } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { TextStats } from '@/components/tool/text-stats'
import { Button } from '@/components/ui/button'
import { convertDateToRoman, convertRomanToDate } from '@/features/value-converters'
import { useLargeInputConfirmation } from '@/hooks/use-large-input-confirmation'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'

type Direction = 'date-to-roman' | 'roman-to-date'

export function RomanNumeralDatePage() {
  const { enabled } = useSaveLocally()
  const [direction, setDirection] = useState<Direction>('date-to-roman')
  const [input, setInput] = usePersistedInput('roman-numeral-date', enabled)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const { confirm, dialog } = useLargeInputConfirmation()
  const isRomanOutput = direction === 'date-to-roman'

  const convert = (value = input) => {
    try {
      setOutput(isRomanOutput ? convertDateToRoman(value) : convertRomanToDate(value))
      setError('')
    } catch (cause) {
      setOutput('')
      setError(cause instanceof Error ? cause.message : 'Unable to convert this date.')
    }
  }

  const changeDirection = (next: Direction) => {
    setDirection(next)
    setInput('')
    setOutput('')
    setError('')
  }

  const useSample = () => {
    const sample = isRomanOutput ? '2026-09-03' : 'III/IX/MMXXVI'
    setInput(sample)
    convert(sample)
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-full">
      <ToolPageHeader title="Roman Numeral Date" description="Convert Gregorian dates to Roman numerals and back, entirely in your browser." />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
          <div className="flex items-center gap-1 rounded-lg border border-input p-1">
            <Button type="button" size="sm" variant={isRomanOutput ? 'secondary' : 'ghost'} onClick={() => changeDirection('date-to-roman')}>Date → Roman</Button>
            <Button type="button" size="sm" variant={!isRomanOutput ? 'secondary' : 'ghost'} onClick={() => changeDirection('roman-to-date')}>Roman → Date</Button>
          </div>
          <Button type="button" size="sm" onClick={() => confirm(input, () => convert())} disabled={!input.trim()}><ArrowLeftRight />Convert</Button>
          <Button type="button" size="sm" variant="outline" onClick={useSample}><FileText />Sample</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => { setInput(''); setOutput(''); setError('') }} disabled={!input && !output}><Eraser />Clear</Button>
        </div>
        <div className="tool-workspace-grid grid min-h-0 flex-1 grid-cols-1 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <section className="flex min-h-65 min-w-0 flex-col bg-editor/40 lg:min-h-0">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">{isRomanOutput ? 'Gregorian date' : 'Roman numeral date'}</span><TextStats value={input} /></div>
            <CodeEditor bare value={input} onChange={(value) => { setInput(value); setOutput(''); setError('') }} placeholder={isRomanOutput ? 'YYYY-MM-DD or DD/MM/YYYY' : 'e.g. III/IX/MMXXVI'} wrap ariaLabel={isRomanOutput ? 'Gregorian date input' : 'Roman date input'} language="text" />
          </section>
          <section className="flex min-h-65 min-w-0 flex-col bg-muted/20 lg:min-h-0">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">{isRomanOutput ? 'Roman numeral date' : 'Gregorian date'}</span><CopyButton value={output} /></div>
            <CodeEditor bare value={output} readOnly placeholder="Converted date will appear here." wrap ariaLabel={isRomanOutput ? 'Roman date output' : 'Gregorian date output'} language="text" />
          </section>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 text-sm shadow-sm"><div className="flex items-center gap-2 font-medium text-foreground"><CalendarClock className="size-4 text-primary" />Accepted formats</div><p className="mt-1 text-muted-foreground">Gregorian input accepts <code>YYYY-MM-DD</code> or <code>DD/MM/YYYY</code>. Roman dates use <code>DD/MM/YYYY</code>, such as <code>III/IX/MMXXVI</code>. Years are supported from 1 to 3999.</p></div>
      <ToolStatus state={error ? 'invalid' : output ? 'valid' : 'idle'} message={error} validLabel="Date converted successfully" />
      {dialog}
    </div>
  )
}
