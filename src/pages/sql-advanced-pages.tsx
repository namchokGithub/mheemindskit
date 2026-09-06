import { Braces, Eraser, FileText, ScanSearch } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { Button } from '@/components/ui/button'
import { createTableToTypes, previewSqlParameters, sqlDialects, validateSqlSyntax, type SqlDialect, type SqlTargetLanguage } from '@/features/sql'
import { useLargeInputConfirmation } from '@/hooks/use-large-input-confirmation'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'

const controlClass = 'h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground'

function DialectSelect({ value, onChange }: { value: SqlDialect; onChange: (value: SqlDialect) => void }) {
  return <label className="flex flex-col gap-1 text-xs text-muted-foreground">SQL dialect<select className={controlClass} value={value} onChange={(event) => onChange(event.target.value as SqlDialect)}>{sqlDialects.map((dialect) => <option key={dialect.value} value={dialect.value}>{dialect.label}</option>)}</select></label>
}

export function SqlParametersPage() {
  const { enabled } = useSaveLocally()
  const [query, setQuery] = usePersistedInput('sql-parameters-query', enabled)
  const [parameters, setParameters] = usePersistedInput('sql-parameters-values', enabled)
  const [dialect, setDialect] = useState<SqlDialect>('postgresql')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const { confirm, dialog } = useLargeInputConfirmation()
  const clearResult = () => { setOutput(''); setError('') }
  const run = () => { try { setOutput(previewSqlParameters(query, parameters, dialect)); setError('') } catch (cause) { setOutput(''); setError(cause instanceof Error ? cause.message : 'Unable to preview parameters.') } }
  const sample = () => { setQuery('SELECT * FROM users WHERE status = :status AND id = :id -- :ignored'); setParameters(JSON.stringify({ status: 'active', id: 42 }, null, 2)); setOutput("SELECT * FROM users WHERE status = 'active' AND id = 42 -- :ignored"); setError('') }

  return <div className="flex min-h-0 flex-1 flex-col gap-4"><ToolPageHeader title="SQL Parameters Preview" description="Preview a parameterized query with local JSON values substituted for debugging." /><div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3"><DialectSelect value={dialect} onChange={(value) => { setDialect(value); clearResult() }} /></div><p className="text-xs text-muted-foreground">Supports positional <code>?</code> and <code>$1</code> with a JSON array, or named <code>:name</code> with a JSON object. This preview is not safe to execute; use parameter binding in production.</p><div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap gap-2 border-b border-border bg-secondary/50 px-3 py-2"><Button size="sm" disabled={!query.trim() || !parameters.trim()} onClick={() => confirm(`${query}\n${parameters}`, run)}><Braces />Preview</Button><Button size="sm" variant="outline" onClick={sample}><FileText />Sample</Button><Button size="sm" variant="outline" disabled={!query && !parameters && !output && !error} onClick={() => { setQuery(''); setParameters(''); clearResult() }}><Eraser />Clear</Button></div><div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0"><section className="flex min-w-0 flex-col"><div className="h-11 px-3 pt-3 text-sm font-medium">SQL query</div><CodeEditor bare value={query} onChange={(value) => { setQuery(value); clearResult() }} wrap ariaLabel="SQL query" language="sql" placeholder="SELECT * FROM users WHERE id = $1" /></section><section className="flex min-w-0 flex-col"><div className="h-11 px-3 pt-3 text-sm font-medium">Parameters (JSON)</div><CodeEditor bare value={parameters} onChange={(value) => { setParameters(value); clearResult() }} wrap ariaLabel="SQL parameters JSON" language="json" placeholder={'[42]\nor\n{ "id": 42 }'} /></section><section className="flex min-w-0 flex-col"><div className="flex h-11 items-center justify-between px-3"><span className="text-sm font-medium">Preview</span><CopyButton value={output} /></div><CodeEditor bare value={output} readOnly wrap ariaLabel="SQL parameter preview" language="sql" placeholder="The query preview will appear here." /></section></div></div><ToolStatus state={error ? 'invalid' : output ? 'valid' : 'idle'} message={error || undefined} validLabel="Parameters previewed locally" />{dialog}</div>
}

export function CreateTableTypesPage() {
  const { enabled } = useSaveLocally()
  const [input, setInput] = usePersistedInput('create-table-types', enabled)
  const [language, setLanguage] = useState<SqlTargetLanguage>('typescript')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const { confirm, dialog } = useLargeInputConfirmation()
  const clearResult = () => { setOutput(''); setError('') }
  const run = (value = input) => { try { setOutput(createTableToTypes(value, language)); setError('') } catch (cause) { setOutput(''); setError(cause instanceof Error ? cause.message : 'Unable to generate types.') } }
  const sample = `CREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  email VARCHAR(255) NOT NULL,\n  active BOOLEAN NOT NULL DEFAULT true,\n  metadata JSONB,\n  created_at TIMESTAMP\n);`
  const outputLanguage = language === 'typescript' ? 'typescript' : 'go'
  return <div className="flex min-h-0 flex-1 flex-col gap-4"><ToolPageHeader title="CREATE TABLE → Types" description="Generate a TypeScript interface or Go struct from a CREATE TABLE statement." /><div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3"><label className="flex flex-col gap-1 text-xs text-muted-foreground">Output language<select className={controlClass} value={language} onChange={(event) => { setLanguage(event.target.value as SqlTargetLanguage); clearResult() }}><option value="typescript">TypeScript</option><option value="go">Go</option></select></label></div><p className="text-xs text-muted-foreground">Supports a single CREATE TABLE statement and common scalar SQL types. Constraints, generated expressions, domains, arrays, and engine-specific behavior are not fully modeled.</p><div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap gap-2 border-b border-border bg-secondary/50 px-3 py-2"><Button size="sm" disabled={!input.trim()} onClick={() => confirm(input, () => run())}><Braces />Generate types</Button><Button size="sm" variant="outline" onClick={() => { setInput(sample); run(sample) }}><FileText />Sample</Button><Button size="sm" variant="outline" disabled={!input && !output && !error} onClick={() => { setInput(''); clearResult() }}><Eraser />Clear</Button></div><div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-border lg:grid-cols-2 lg:divide-x lg:divide-y-0"><section className="flex min-w-0 flex-col"><div className="h-11 px-3 pt-3 text-sm font-medium">CREATE TABLE</div><CodeEditor bare value={input} onChange={(value) => { setInput(value); clearResult() }} wrap ariaLabel="CREATE TABLE input" language="sql" placeholder="CREATE TABLE users (...)" /></section><section className="flex min-w-0 flex-col"><div className="flex h-11 items-center justify-between px-3"><span className="text-sm font-medium">Generated types</span><CopyButton value={output} /></div><CodeEditor bare value={output} readOnly wrap ariaLabel="Generated types" language={outputLanguage} placeholder="Generated types will appear here." /></section></div></div><ToolStatus state={error ? 'invalid' : output ? 'valid' : 'idle'} message={error || undefined} validLabel="Types generated successfully" />{dialog}</div>
}

export function SqlSyntaxCheckerPage() {
  const { enabled } = useSaveLocally()
  const [input, setInput] = usePersistedInput('sql-syntax-checker', enabled)
  const [dialect, setDialect] = useState<SqlDialect>('postgresql')
  const [message, setMessage] = useState('')
  const [valid, setValid] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)
  const { confirm, dialog } = useLargeInputConfirmation()
  const clearResult = () => { setMessage(''); setValid(null) }
  const run = async (value = input) => { setBusy(true); const result = await validateSqlSyntax(value, dialect); setBusy(false); setValid(result.valid); setMessage(result.message ?? '') }
  const sample = 'SELECT id, name FROM users WHERE active = true ORDER BY name;'
  return <div className="flex min-h-0 flex-1 flex-col gap-4"><ToolPageHeader title="SQL Syntax Checker" description="Check whether a query can be parsed for the selected SQL dialect." /><div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3"><DialectSelect value={dialect} onChange={(value) => { setDialect(value); clearResult() }} /></div><p className="text-xs text-muted-foreground">This checks parser syntax only. It cannot confirm that tables, columns, permissions, or database-specific extensions exist.</p><div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap gap-2 border-b border-border bg-secondary/50 px-3 py-2"><Button size="sm" disabled={!input.trim() || busy} onClick={() => confirm(input, () => { void run() })}><ScanSearch />{busy ? 'Checking…' : 'Check syntax'}</Button><Button size="sm" variant="outline" onClick={() => { setInput(sample); void run(sample) }}><FileText />Sample</Button><Button size="sm" variant="outline" disabled={!input && valid === null} onClick={() => { setInput(''); clearResult() }}><Eraser />Clear</Button></div><div className="min-h-0 flex-1"><CodeEditor bare value={input} onChange={(value) => { setInput(value); clearResult() }} wrap ariaLabel="SQL syntax input" language="sql" placeholder="Paste SQL to check…" /></div></div><ToolStatus state={valid === null ? 'idle' : valid ? 'valid' : 'invalid'} message={valid === false ? message : undefined} validLabel="SQL parsed successfully" />{dialog}</div>
}
