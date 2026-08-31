import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'mindskit:save-input-locally'

interface SaveLocallyContextValue {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
}

const SaveLocallyContext = createContext<SaveLocallyContextValue | null>(null)

function readEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function SaveLocallyProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readEnabled)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled))
    } catch {
      // localStorage unavailable — ignore
    }
  }, [enabled])

  return <SaveLocallyContext.Provider value={{ enabled, setEnabled }}>{children}</SaveLocallyContext.Provider>
}

export function useSaveLocally(): SaveLocallyContextValue {
  const context = useContext(SaveLocallyContext)
  if (!context) throw new Error('useSaveLocally must be used within a SaveLocallyProvider')
  return context
}
