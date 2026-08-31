import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ToolStatusProps {
  state: 'idle' | 'valid' | 'invalid'
  message?: string
  line?: number
  column?: number
  validLabel?: string
}

export function ToolStatus({ state, message, line, column, validLabel = 'Looks good' }: ToolStatusProps) {
  if (state === 'idle') return null

  const isValid = state === 'valid'
  const location =
    line !== undefined ? ` (line ${line}${column !== undefined ? `, column ${column}` : ''})` : ''

  return (
    <div
      role={isValid ? 'status' : 'alert'}
      className={cn(
        'flex animate-in items-start gap-2 rounded-lg border px-3.5 py-2.5 text-sm fade-in slide-in-from-top-1 duration-200',
        isValid
          ? 'border-success/30 bg-success/10 text-success'
          : 'border-destructive/30 bg-destructive/10 text-destructive',
      )}
    >
      {isValid ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      )}
      <span className="break-words">
        {isValid ? validLabel : message}
        {!isValid && location}
      </span>
    </div>
  )
}
