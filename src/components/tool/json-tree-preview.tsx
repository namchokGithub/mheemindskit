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
