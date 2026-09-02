export function TextStats({ value }: { value: string }) {
  const size = new Blob([value]).size
  const sizeLabel = size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(2)} MB`
  return <span className="text-xs font-normal text-muted-foreground">{value.length.toLocaleString()} characters · {sizeLabel}</span>
}
