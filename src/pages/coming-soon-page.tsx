import { Hourglass } from 'lucide-react'

import type { ToolDefinition } from '@/types/tool'

export function ComingSoonPage({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{tool.name}</h1>
        <p className="text-sm text-muted-foreground">{tool.description}</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-8 text-center">
        <Icon className="size-8 text-muted-foreground" />
        <div className="space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground">
            <Hourglass className="size-4 text-primary" />
            Coming soon
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {tool.name} isn't built yet — it's on the roadmap for a future update.
          </p>
        </div>
      </div>
    </div>
  )
}
