import type { LucideIcon } from 'lucide-react'

export type ToolCategory = 'formatters' | 'text-tools' | 'encode-decode' | 'generators' | 'converters'

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: ToolCategory
  path: string
  icon: LucideIcon
  comingSoon?: boolean
}

export interface CategoryDefinition {
  id: ToolCategory
  name: string
}
