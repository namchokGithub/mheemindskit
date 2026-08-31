import { NavLink } from 'react-router-dom'

import { categories, getToolsByCategory } from '@/config/tools'
import { cn } from '@/lib/utils'

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6">
      {categories.map((category) => (
        <div key={category.id} className="flex flex-col gap-1">
          <span className="px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {category.name}
          </span>
          {getToolsByCategory(category.id).map((tool) => (
            <NavLink
              key={tool.id}
              to={tool.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )
              }
            >
              <tool.icon className="size-4 shrink-0" />
              {tool.name}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}
