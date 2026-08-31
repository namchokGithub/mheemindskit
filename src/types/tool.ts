import type { LucideIcon } from 'lucide-react'

export type ToolCategory = 'formatters'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: ToolCategory
  path: string
  icon: LucideIcon
}

export interface CategoryDefinition {
  id: ToolCategory
  name: string
}
