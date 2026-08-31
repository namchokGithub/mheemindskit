import { CheckCircle2, Eraser, FileText } from 'lucide-react'
import { useState } from 'react'

import { CodeEditor } from '@/components/tool/code-editor'
import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { Button } from '@/components/ui/button'
import { validateJson } from '@/features/formatters/json'
import { getRandomSampleJson } from '@/features/formatters/samples'
import { usePersistedInput } from '@/hooks/use-persisted-input'
import type { ValidateResult } from '@/types/format'

export function JsonValidatorPage() {
  const [input, setInput] = usePersistedInput('json-validator')
  const [result, setResult] = useState<ValidateResult | null>(null)

  const handleInputChange = (next: string) => {
    setInput(next)
    setResult(null)
  }

  const handleSample = () => {
    const sample = getRandomSampleJson()
    setInput(sample)
    setResult(validateJson(sample))
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <ToolPageHeader
        title="JSON Validator"
        description="Check whether JSON is well-formed without modifying it."
      />

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button type="button" onClick={() => setResult(validateJson(input))} disabled={!input.trim()}>
          <CheckCircle2 />
          Validate
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleSample}>
          <FileText />
          Sample
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={!input}>
          <Eraser />
          Clear
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <span className="text-sm font-medium text-muted-foreground">Input</span>
        <CodeEditor
          value={input}
          onChange={handleInputChange}
          placeholder="Paste JSON to validate…"
          wrap
          ariaLabel="Input"
          errorLine={result && !result.valid ? result.line : undefined}
        />
      </div>

      <div className="shrink-0">
        <ToolStatus
          state={result === null ? 'idle' : result.valid ? 'valid' : 'invalid'}
          message={result?.message}
          line={result?.line}
          column={result?.column}
          validLabel="Valid JSON"
        />
      </div>
    </div>
  )
}
