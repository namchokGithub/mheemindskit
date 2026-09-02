import { useState } from 'react'

import { LargeInputDialog } from '@/components/tool/large-input-dialog'

export const DEFAULT_LARGE_INPUT_LIMIT_BYTES = 5 * 1024 * 1024

export function useLargeInputConfirmation(limitBytes = DEFAULT_LARGE_INPUT_LIMIT_BYTES) {
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const confirm = (input: string, action: () => void) => {
    if (new Blob([input]).size <= limitBytes) {
      action()
      return
    }
    setPendingAction(() => action)
  }

  const limitLabel = limitBytes < 1024 * 1024 ? `${Math.round(limitBytes / 1024)} KB` : `${Math.round(limitBytes / (1024 * 1024))} MB`
  const dialog = pendingAction ? <LargeInputDialog limitLabel={limitLabel} onCancel={() => setPendingAction(null)} onContinue={() => { const action = pendingAction; setPendingAction(null); action() }} /> : null

  return { confirm, dialog }
}
