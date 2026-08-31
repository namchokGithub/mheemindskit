import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { IndentOption } from '@/types/format'

const INDENT_LABELS: Record<IndentOption, string> = {
  '2': '2 spaces',
  '4': '4 spaces',
  tab: 'Tab',
}

export function IndentSelect({
  value,
  onChange,
  className,
}: {
  value: IndentOption
  onChange: (value: IndentOption) => void
  className?: string
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as IndentOption)}>
      <SelectTrigger size="sm" className={cn('w-[130px]', className)} aria-label="Indentation">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(INDENT_LABELS) as IndentOption[]).map((option) => (
          <SelectItem key={option} value={option}>
            {INDENT_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
