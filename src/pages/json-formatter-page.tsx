import { Braces } from 'lucide-react'

import { FormatterPage } from '@/components/tool/formatter-page'
import { JsonTreePreview } from '@/components/tool/json-tree-preview'
import { formatJson } from '@/features/formatters/json'
import { getRandomSampleJson } from '@/features/formatters/samples'

export function JsonFormatterPage() {
  return (
    <FormatterPage
      title="JSON Formatter"
      description="Paste JSON and beautify it with your preferred indentation."
      actionLabel="Format"
      actionIcon={Braces}
      successLabel="Formatted successfully"
      sample={getRandomSampleJson}
      showIndent
      inputPlaceholder="Paste JSON here…"
      storageKey="json-formatter"
      process={formatJson}
      outputPreview={(output) => <JsonTreePreview value={output} />}
    />
  )
}
