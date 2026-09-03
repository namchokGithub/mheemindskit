import { Braces, Eraser, FileText } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { TextStats } from '@/components/tool/text-stats'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { formatSqlInClause } from '@/features/sql'
import { useLargeInputConfirmation } from '@/hooks/use-large-input-confirmation'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'

const sample = '550e8400-e29b-41d4-a716-446655440000\n6ba7b810-9dad-11d1-80b4-00c04fd430c8\n7d444840-9dc0-11d1-b245-5ffdce74fad2'

export function SqlInClausePage() {
  const { enabled } = useSaveLocally()
  const [input, setInput] = usePersistedInput('sql-in-clause', enabled)
  const [column, setColumn] = useState('id')
  const [removeDuplicates, setRemoveDuplicates] = useState(true)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const { confirm, dialog } = useLargeInputConfirmation()

  const format = (value = input) => {
    try {
      setOutput(formatSqlInClause(value, column, removeDuplicates))
      setError('')
    } catch (formatError) {
      setOutput('')
      setError(formatError instanceof Error ? formatError.message : 'Unable to create the SQL clause.')
    }
  }

  const useSample = () => {
    setInput(sample)
    format(sample)
  }

  return <div className="flex min-h-0 flex-col gap-4 lg:h-full"><ToolPageHeader title="UUID → SQL IN" description="Turn UUIDs or values into a SQL WHERE … IN (…) clause in your browser." /><div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2"><Button type="button" size="sm" onClick={() => confirm(input, () => format())} disabled={!input.trim()}><Braces />Format SQL</Button><label className="flex items-center gap-1.5 text-xs text-muted-foreground">Column<input value={column} onChange={(event) => setColumn(event.target.value)} className="h-7 w-28 rounded-lg border border-input bg-transparent px-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" /></label><label className="flex items-center gap-1.5 text-xs text-muted-foreground"><Checkbox checked={removeDuplicates} onCheckedChange={(checked) => setRemoveDuplicates(checked === true)} />Remove duplicates</label><Button type="button" size="sm" variant="outline" onClick={useSample}><FileText />Sample</Button><Button type="button" size="sm" variant="outline" onClick={() => { setInput(''); setOutput(''); setError('') }} disabled={!input && !output}><Eraser />Clear</Button></div>{error && <div className="shrink-0 px-3 pt-3"><ToolStatus state="invalid" message={error} /></div>}<div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0"><section className="flex min-h-65 min-w-0 flex-col bg-editor/40 lg:min-h-0"><div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">UUIDs or values</span><TextStats value={input} /></div><CodeEditor bare value={input} onChange={(value) => { setInput(value); setOutput(''); setError('') }} placeholder="Paste one UUID per line, or comma-separated values…" wrap ariaLabel="UUID or value input" language="text" /></section><section className="flex min-h-65 min-w-0 flex-col bg-muted/20 lg:min-h-0"><div className="flex items-center justify-between px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">SQL clause</span><CopyButton value={output} /></div><CodeEditor bare value={output} readOnly placeholder="Your SQL WHERE clause will appear here." wrap ariaLabel="SQL clause output" language="sql" /></section></div></div><ToolStatus state={error ? 'invalid' : output ? 'valid' : 'idle'} message={error} validLabel="SQL clause generated successfully" />{dialog}</div>
}
