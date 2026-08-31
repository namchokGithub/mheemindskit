export function ToolPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
