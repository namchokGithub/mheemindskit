import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  wrap: boolean
  ariaLabel: string
}

export function CodeEditor({ value, onChange, placeholder, readOnly, wrap, ariaLabel }: CodeEditorProps) {
  return (
    <textarea
      value={value}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      readOnly={readOnly}
      placeholder={placeholder}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      aria-label={ariaLabel}
      className={cn(
        'h-full min-h-[260px] w-full resize-none rounded-lg border border-input bg-transparent p-3.5',
        'font-mono text-[13px] leading-relaxed text-foreground',
        'placeholder:text-muted-foreground',
        'transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        'overflow-auto',
        wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
        readOnly && 'bg-muted/30',
      )}
    />
  )
}
