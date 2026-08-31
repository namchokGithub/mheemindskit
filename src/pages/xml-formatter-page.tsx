import { Eraser, FileCode2, FileText, Shrink, WrapText } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { CopyButton } from '@/components/tool/copy-button'
import { IndentSelect } from '@/components/tool/indent-select'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { Button } from '@/components/ui/button'
import { formatXml, minifyXml } from '@/features/formatters/xml'
import { SAMPLE_XML } from '@/features/formatters/samples'
import { cn } from '@/lib/utils'
import type { FormatResult, IndentOption } from '@/types/format'

export function XmlFormatterPage() {
  const [input, setInput] = useState('')
  const [indent, setIndent] = useState<IndentOption>('2')
  const [wrap, setWrap] = useState(false)
  const [result, setResult] = useState<FormatResult | null>(null)
  const [mode, setMode] = useState<'format' | 'minify'>('format')

  const handleInputChange = (next: string) => {
    setInput(next)
    setResult(null)
  }

  const handleFormat = () => {
    setMode('format')
    setResult(formatXml(input, indent))
  }

  const handleMinify = () => {
    setMode('minify')
    setResult(minifyXml(input))
  }

  const handleIndentChange = (next: IndentOption) => {
    setIndent(next)
    if (mode === 'format' && result?.ok) setResult(formatXml(input, next))
  }

  const handleSample = () => {
    setInput(SAMPLE_XML)
    setMode('format')
    setResult(formatXml(SAMPLE_XML, indent))
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
  }

  return (
    <div className="space-y-5">
      <ToolPageHeader
        title="XML Formatter"
        description="Paste XML, beautify or minify it, and catch malformed markup."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={handleFormat} disabled={!input.trim()}>
          <FileCode2 />
          Format
        </Button>
        <Button type="button" variant="secondary" onClick={handleMinify} disabled={!input.trim()}>
          <Shrink />
          Minify
        </Button>
        <IndentSelect value={indent} onChange={handleIndentChange} />
        <Button type="button" variant="outline" size="sm" onClick={handleSample}>
          <FileText />
          Sample
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={!input}>
          <Eraser />
          Clear
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-pressed={wrap}
          onClick={() => setWrap((w) => !w)}
          className={cn(wrap && 'bg-accent text-accent-foreground')}
        >
          <WrapText />
          Wrap
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Input</span>
          <CodeEditor
            value={input}
            onChange={handleInputChange}
            placeholder="Paste XML here…"
            wrap={wrap}
            ariaLabel="Input"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
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

      <ToolStatus
        state={result === null ? 'idle' : result.ok ? 'valid' : 'invalid'}
        message={result && !result.ok ? result.message : undefined}
        line={result && !result.ok ? result.line : undefined}
        column={result && !result.ok ? result.column : undefined}
        validLabel={mode === 'format' ? 'Formatted successfully' : 'Minified successfully'}
      />
    </div>
  )
}
