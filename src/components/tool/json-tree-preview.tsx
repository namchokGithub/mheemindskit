import { useEffect, useRef } from 'react'

export function JsonTreePreview({ value }: { value: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let active = true
    let editor: { destroy: () => void | Promise<void> } | null = null

    void import('vanilla-jsoneditor').then(({ createJSONEditor }) => {
      if (!active || !containerRef.current) return
      editor = createJSONEditor({
        target: containerRef.current,
        props: {
          content: { json: JSON.parse(value) },
          mode: 'tree',
          readOnly: true,
          mainMenuBar: false,
          navigationBar: false,
          statusBar: false,
        },
      })
    })

    return () => {
      active = false
      editor?.destroy()
    }
  }, [value])

  return <div ref={containerRef} className="json-tree-preview h-full min-h-[260px] overflow-auto bg-editor" />
}

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

function formatValue(value: JsonValue) {
  if (value === null) return 'null'
  if (typeof value === 'string') return value
  if (typeof value === 'object') return Array.isArray(value) ? `[${value.length} items]` : `{${Object.keys(value).length} fields}`
  return String(value)
}

function JsonFormFields({ value, path = 'root' }: { value: JsonValue; path?: string }) {
  if (value === null || typeof value !== 'object') {
    return <output className="json-form-value" aria-label={path}>{formatValue(value)}</output>
  }

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value)

  return (
    <div className="json-form-fields">
      {entries.map(([key, child]) => (
        <div key={key} className="json-form-field">
          <span className="json-form-key">{key}</span>
          {child !== null && typeof child === 'object' ? (
            <JsonFormFields value={child} path={`${path}.${key}`} />
          ) : (
            <output className="json-form-value" aria-label={`${path}.${key}`}>{formatValue(child)}</output>
          )}
        </div>
      ))}
    </div>
  )
}

export function JsonFormPreview({ value }: { value: string }) {
  const json = JSON.parse(value) as JsonValue

  return <div className="json-form-preview h-full min-h-[260px] overflow-auto bg-editor p-3"><JsonFormFields value={json} /></div>
}
