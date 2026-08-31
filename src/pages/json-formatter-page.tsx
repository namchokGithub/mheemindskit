import { Braces } from 'lucide-react'

import { FormatterPage } from '@/components/tool/formatter-page'
import { formatJson } from '@/features/formatters/json'
import { SAMPLE_JSON } from '@/features/formatters/samples'

export function JsonFormatterPage() {
  return (
    <FormatterPage
      title="JSON Formatter"
      description="Paste JSON and beautify it with your preferred indentation."
      actionLabel="Format"
      actionIcon={Braces}
      successLabel="Formatted successfully"
      sample={SAMPLE_JSON}
      showIndent
      inputPlaceholder="Paste JSON here…"
      process={formatJson}
    />
  )
}
