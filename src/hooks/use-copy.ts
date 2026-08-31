import { useState } from 'react'
import { toast } from 'sonner'

export function useCopy() {
  const [copied, setCopied] = useState(false)

  const copy = async (value: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  return { copied, copy }
}
