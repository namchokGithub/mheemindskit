import { Shrink } from 'lucide-react'

import { FormatterPage } from '@/components/tool/formatter-page'
import { minifyJson } from '@/features/formatters/json'
import { SAMPLE_JSON } from '@/features/formatters/samples'

export function JsonMinifierPage() {
  return (
    <FormatterPage
      title="JSON Minifier"
      description="Paste JSON and collapse it into a single compact line."
      actionLabel="Minify"
      actionIcon={Shrink}
      successLabel="Minified successfully"
      sample={SAMPLE_JSON}
      showIndent={false}
      inputPlaceholder="Paste JSON here…"
      process={(input) => minifyJson(input)}
    />
  )
}
