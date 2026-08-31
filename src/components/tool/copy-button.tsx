import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/use-copy'

export function CopyButton({ value, disabled }: { value: string; disabled?: boolean }) {
  const { copied, copy } = useCopy()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || !value}
      onClick={() => copy(value)}
    >
      {copied ? <Check className="text-success" /> : <Copy />}
      Copy
    </Button>
  )
}
