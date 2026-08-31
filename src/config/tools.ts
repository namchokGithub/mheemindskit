import { Braces, CheckCircle2, FileCode2, Shrink } from 'lucide-react'

import type { CategoryDefinition, ToolDefinition } from '@/types/tool'

export const categories: CategoryDefinition[] = [{ id: 'formatters', name: 'Formatters' }]

export const tools: ToolDefinition[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Beautify JSON with adjustable indentation.',
    category: 'formatters',
    path: '/formatters/json',
    icon: Braces,
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    description: 'Minify JSON into a single compact line.',
    category: 'formatters',
    path: '/formatters/json-minify',
    icon: Shrink,
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    description: 'Validate JSON and pinpoint syntax errors.',
    category: 'formatters',
    path: '/formatters/json-validator',
    icon: CheckCircle2,
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Beautify, minify, and validate XML.',
    category: 'formatters',
    path: '/formatters/xml',
    icon: FileCode2,
  },
]

export function getToolsByCategory(category: ToolDefinition['category']): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category)
}
