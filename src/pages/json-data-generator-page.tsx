import { ArrowRight, Braces, Download, Eraser, FileText, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { generateJsonData, jsonFieldTypes, type JsonFieldType, type JsonGeneratorField } from '@/features/json-data-generator'
import { useLargeInputConfirmation } from '@/hooks/use-large-input-confirmation'

const initialFields: JsonGeneratorField[] = [
  { id: 'id', name: 'id', type: 'uuid', nullable: false, unique: true, enumValues: '' },
  { id: 'name', name: 'name', type: 'name', nullable: false, unique: false, enumValues: '' },
  { id: 'email', name: 'email', type: 'email', nullable: false, unique: true, enumValues: '' },
  { id: 'active', name: 'active', type: 'boolean', nullable: false, unique: false, enumValues: '' },
  { id: 'role', name: 'role', type: 'enum', nullable: false, unique: false, enumValues: 'admin, editor, viewer' },
]
const controlClass = 'h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground'

function newField(): JsonGeneratorField {
  return { id: crypto.randomUUID(), name: 'field', type: 'text', nullable: false, unique: false, enumValues: '' }
}

export function JsonDataGeneratorPage() {
  const [fields, setFields] = useState<JsonGeneratorField[]>(initialFields)
  const [count, setCount] = useState('10')
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { confirm, dialog } = useLargeInputConfirmation()
  const clearResult = () => { setOutput(''); setError('') }
  const updateField = (id: string, update: Partial<JsonGeneratorField>) => { setFields((current) => current.map((field) => field.id === id ? { ...field, ...update } : field)); clearResult() }
  const generate = () => { try { const spacing = indent === 'tab' ? '\t' : Number(indent); setOutput(JSON.stringify(generateJsonData(fields, Number(count)), null, spacing)); setError('') } catch (cause) { setOutput(''); setError(cause instanceof Error ? cause.message : 'Unable to generate JSON.') } }
  const useSample = () => { setFields(initialFields); setCount('10'); clearResult() }
  const download = () => { const url = URL.createObjectURL(new Blob([output], { type: 'application/json;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'generated-data.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) }
  const sendToInsert = () => { try { sessionStorage.setItem('mindskit:transfer:json-insert', output); navigate('/sql/insert') } catch { setError('Unable to transfer this JSON to SQL INSERT.') } }

  return <div className="flex min-h-0 flex-1 flex-col gap-4"><ToolPageHeader title="JSON Data Generator" description="Generate local JSON records from a configurable field schema." /><div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3"><label className="flex flex-col gap-1 text-xs text-muted-foreground">Records (1–1000)<input type="number" min={1} max={1000} className={`${controlClass} w-32`} value={count} onChange={(event) => { setCount(event.target.value); clearResult() }} /></label><label className="flex flex-col gap-1 text-xs text-muted-foreground">Indentation<select className={controlClass} value={indent} onChange={(event) => { setIndent(event.target.value as typeof indent); clearResult() }}><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tabs</option></select></label></div><p className="text-xs text-muted-foreground">Data is generated in this browser with cryptographically secure randomness. Names and emails are fictional; generated values are never sent to a server.</p><section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border bg-secondary/50 px-3 py-2"><h2 className="text-sm font-medium">Field schema</h2><Button size="sm" variant="outline" onClick={() => { setFields((current) => [...current, newField()]); clearResult() }}><Plus />Add field</Button></div><div className="overflow-x-auto"><div className="min-w-[760px] divide-y divide-border">{fields.map((field, index) => <div key={field.id} className="grid grid-cols-[2rem_11rem_10rem_1fr_auto_auto_auto] items-center gap-2 p-2"><span className="text-center text-xs text-muted-foreground">{index + 1}</span><input aria-label={`Field ${index + 1} name`} className={controlClass} value={field.name} onChange={(event) => updateField(field.id, { name: event.target.value })} placeholder="field name" /><select aria-label={`Field ${index + 1} type`} className={controlClass} value={field.type} onChange={(event) => updateField(field.id, { type: event.target.value as JsonFieldType })}>{jsonFieldTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select>{field.type === 'enum' ? <input aria-label={`Field ${index + 1} enum values`} className={controlClass} value={field.enumValues} onChange={(event) => updateField(field.id, { enumValues: event.target.value })} placeholder="admin, editor, viewer" /> : <span className="text-xs text-muted-foreground">{field.type === 'id' ? 'Starts at 1' : field.type === 'datetime' ? 'Within the last year' : field.type === 'integer' ? '0–9999' : field.type === 'decimal' ? '0–9999.99' : ''}</span>}<label className="flex items-center gap-1.5 text-xs"><Checkbox checked={field.nullable} onCheckedChange={(checked) => updateField(field.id, { nullable: checked === true })} />Nullable</label><label className="flex items-center gap-1.5 text-xs"><Checkbox checked={field.unique} onCheckedChange={(checked) => updateField(field.id, { unique: checked === true })} />Unique</label><Button size="icon" variant="ghost" aria-label={`Remove field ${field.name || index + 1}`} disabled={fields.length === 1} onClick={() => { setFields((current) => current.filter((item) => item.id !== field.id)); clearResult() }}><Trash2 /></Button></div>)}</div></div></section><div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap gap-2 border-b border-border bg-secondary/50 px-3 py-2"><Button size="sm" onClick={() => confirm(JSON.stringify(fields), generate)}><Braces />Generate JSON</Button><Button size="sm" variant="outline" onClick={useSample}><FileText />Reset sample</Button><Button size="sm" variant="outline" disabled={!output && !error} onClick={clearResult}><Eraser />Clear output</Button><div className="ml-auto flex gap-2"><Button size="sm" variant="outline" disabled={!output} onClick={sendToInsert}>Send to SQL INSERT<ArrowRight /></Button><Button size="sm" variant="outline" disabled={!output} onClick={download}><Download />.json</Button><CopyButton value={output} /></div></div><div className="min-h-[22rem] flex-1"><CodeEditor bare value={output} readOnly wrap ariaLabel="Generated JSON" language="json" placeholder="Generated JSON will appear here." /></div></div><ToolStatus state={error ? 'invalid' : output ? 'valid' : 'idle'} message={error || undefined} validLabel="JSON generated successfully" />{dialog}</div>
}
