import { CheckCircle2, Eraser, Eye, FileText } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { TextStats } from '@/components/tool/text-stats'
import { Button } from '@/components/ui/button'
import { validateXml } from '@/features/formatters/xml'
import { getRandomSampleXml } from '@/features/formatters/samples'
import { useLargeInputConfirmation } from '@/hooks/use-large-input-confirmation'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import { useSaveLocally } from '@/hooks/use-save-locally'
import type { FormatFailure, ValidateResult } from '@/types/format'

function XmlValidationPage({ title, description, storageKey }: { title: string; description: string; storageKey: string }) {
  const { enabled: saveLocally } = useSaveLocally()
  const [input, setInput] = usePersistedInput(storageKey, saveLocally)
  const [result, setResult] = useState<ValidateResult | null>(null)
  const { confirm, dialog } = useLargeInputConfirmation()
  const run = (value = input) => setResult(validateXml(value))

  return <div className="flex h-full min-h-0 flex-col gap-4"><ToolPageHeader title={title} description={description} /><div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2"><Button type="button" size="sm" onClick={() => confirm(input, () => run())} disabled={!input.trim()}><CheckCircle2 />Validate</Button><Button type="button" variant="outline" size="sm" onClick={() => { const sample = getRandomSampleXml(); setInput(sample); run(sample) }}><FileText />Sample</Button><Button type="button" variant="outline" size="sm" onClick={() => { setInput(''); setResult(null) }} disabled={!input}><Eraser />Clear</Button></div><div className="flex min-h-0 flex-1 flex-col"><div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">XML input</span><TextStats value={input} /></div><CodeEditor bare value={input} onChange={(value) => { setInput(value); setResult(null) }} placeholder="Paste XML here…" wrap ariaLabel="XML input" language="xml" errorLine={result && !result.valid ? result.line : undefined} /></div></div><ToolStatus state={result === null ? 'idle' : result.valid ? 'valid' : 'invalid'} message={result && !result.valid ? result.message : undefined} line={result && !result.valid ? result.line : undefined} column={result && !result.valid ? result.column : undefined} validLabel="Valid XML" />{dialog}</div>
}

export function XmlValidatorPage() {
  return <XmlValidationPage title="XML Validator" description="Validate XML syntax and find malformed markup." storageKey="xml-validator" />
}

type XmlTreeResult = { ok: true; root: Element } | FormatFailure

function parseXml(input: string): XmlTreeResult {
  if (!input.trim()) return { ok: false, message: 'Input is empty.' }
  const doc = new DOMParser().parseFromString(input, 'application/xml')
  const error = doc.getElementsByTagName('parsererror')[0]
  if (error) return { ok: false, message: error.textContent?.replace(/\s*Below is a rendering[\s\S]*/i, '').trim() || 'Invalid XML.' }
  return doc.documentElement ? { ok: true, root: doc.documentElement } : { ok: false, message: 'No root element found.' }
}

function XmlTree({ element }: { element: Element }) {
  const attributes = Array.from(element.attributes)
  const children = Array.from(element.children)
  const text = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent?.trim()).filter(Boolean).join(' ')
  const label = <span className="font-mono text-sm text-primary">&lt;{element.tagName}{attributes.map((attribute) => <span key={attribute.name} className="text-muted-foreground"> {' '}{attribute.name}=<span className="text-success">&quot;{attribute.value}&quot;</span></span>)}&gt;</span>
  if (!children.length) return <div className="py-0.5">{label}{text && <span className="ml-1 font-mono text-sm">{text}</span>}<span className="font-mono text-sm text-primary">&lt;/{element.tagName}&gt;</span></div>
  return <details open className="py-0.5"><summary className="cursor-pointer select-none">{label}</summary><div className="ml-4 border-l border-border pl-3"><>{text && <div className="py-0.5 font-mono text-sm">{text}</div>}{children.map((child, index) => <XmlTree key={`${child.tagName}-${index}`} element={child} />)}</></div><div className="font-mono text-sm text-primary">&lt;/{element.tagName}&gt;</div></details>
}

export function XmlViewerPage() {
  const { enabled: saveLocally } = useSaveLocally()
  const [input, setInput] = usePersistedInput('xml-viewer', saveLocally)
  const [result, setResult] = useState<XmlTreeResult | null>(null)
  const { confirm, dialog } = useLargeInputConfirmation()
  const view = (value = input) => setResult(parseXml(value))

  return <div className="flex h-full min-h-0 flex-col gap-4"><ToolPageHeader title="XML Viewer" description="Inspect valid XML as a collapsible tree." /><div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2"><Button type="button" size="sm" onClick={() => confirm(input, () => view())} disabled={!input.trim()}><Eye />View XML</Button><Button type="button" variant="outline" size="sm" onClick={() => { const sample = getRandomSampleXml(); setInput(sample); view(sample) }}><FileText />Sample</Button><Button type="button" variant="outline" size="sm" onClick={() => { setInput(''); setResult(null) }} disabled={!input}><Eraser />Clear</Button></div><div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2"><section className="flex min-h-0 min-w-0 flex-col border-b border-border lg:border-r lg:border-b-0"><div className="flex items-center justify-between gap-2 px-3 py-1.5"><span className="text-sm font-medium text-muted-foreground">XML input</span><TextStats value={input} /></div><CodeEditor bare value={input} onChange={(value) => { setInput(value); setResult(null) }} placeholder="Paste XML here…" wrap ariaLabel="XML input" language="xml" /></section><section className="min-h-0 overflow-auto bg-editor p-3"><span className="text-sm font-medium text-muted-foreground">Tree view</span><div className="mt-2">{result?.ok ? <XmlTree element={result.root} /> : <p className="text-sm text-muted-foreground">Valid XML tree will appear here.</p>}</div></section></div></div><ToolStatus state={result === null ? 'idle' : result.ok ? 'valid' : 'invalid'} message={result && !result.ok ? result.message : undefined} validLabel="XML loaded successfully" />{dialog}</div>
}
