import { ShieldCheck } from "lucide-react";

export function ToolPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 shrink-0 text-primary" />
        Everything stays in your browser — nothing is uploaded.
      </p>
    </div>
  );
}
