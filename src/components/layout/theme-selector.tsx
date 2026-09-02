import { Check, Monitor, Palette } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { themes, type ThemePreference } from '@/config/themes'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

export function ThemeSelector() {
  const { preference, setPreference } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label="Choose theme" className="theme-trigger">
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Choose Theme
        </p>

        <button
          type="button"
          onClick={() => setPreference('system')}
          className={cn(
            'mb-2 flex w-full items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium transition-colors',
            preference === 'system'
              ? 'border-[color-mix(in_oklch,var(--primary)_20%,transparent)] bg-[color-mix(in_oklch,var(--primary)_8%,transparent)] text-primary-hover'
              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
          )}
        >
          <Monitor className="size-4 shrink-0" />
          System
          {preference === 'system' && <Check className="ml-auto size-4 shrink-0" />}
        </button>

        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              id={theme.id}
              name={theme.name}
              selected={preference === theme.id}
              onSelect={() => setPreference(theme.id)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ThemeCard({
  id,
  name,
  selected,
  onSelect,
}: {
  id: ThemePreference
  name: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border text-left transition-colors',
        selected
          ? 'border-[color-mix(in_oklch,var(--primary)_40%,transparent)] shadow-[0_10px_22px_-14px_var(--primary)] ring-2 ring-[color-mix(in_oklch,var(--primary)_25%,transparent)]'
          : 'border-border hover:border-[color-mix(in_oklch,var(--primary)_25%,transparent)]',
      )}
    >
      <div data-theme={id} className="app-gradient-bg relative h-12 w-full">
        {selected && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-2.5" />
          </span>
        )}
      </div>
      <span className="px-2 py-1.5 text-xs font-medium text-foreground">{name}</span>
    </button>
  )
}
