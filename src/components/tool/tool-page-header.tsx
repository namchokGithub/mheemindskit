import { ShieldCheck } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { useSaveLocally } from "@/hooks/use-save-locally";

export function ToolPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { enabled, setEnabled } = useSaveLocally();

  return (
    <div className="space-y-1.5">
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <label className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground">
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => setEnabled(checked === true)}
        />
        <ShieldCheck className="size-3.5 shrink-0 text-primary" />
        Save my input locally in this browser (off by default, never uploaded)
      </label>
    </div>
  );
}
