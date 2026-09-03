import { ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Checkbox } from "@/components/ui/checkbox";
import { categories, tools } from "@/config/tools";
import { useSaveLocally } from "@/hooks/use-save-locally";

export function ToolPageHeader({
  title,
  description,
  showRememberInput = true,
}: {
  title: string;
  description: string;
  showRememberInput?: boolean;
}) {
  const { enabled, setEnabled } = useSaveLocally();
  const { pathname } = useLocation();

  const category = tools.find((tool) => tool.path === pathname)?.category;
  const categoryName = categories.find((c) => c.id === category)?.name;

  return (
    <div className="space-y-1.5">
      {categoryName && (
        <p className="text-xs text-muted-foreground">
          {categoryName} / {title}
        </p>
      )}
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      {showRememberInput && <label className="flex w-full items-center gap-1.5 text-xs text-muted-foreground sm:w-fit">
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => setEnabled(checked === true)}
        />
        <ShieldCheck className="size-3.5 shrink-0 text-primary" />
        <span className="flex flex-col leading-tight">
          <span>Remember input</span>
          <span className="text-[11px] text-muted-foreground/80">
            Stored only in this browser
          </span>
        </span>
      </label>}
    </div>
  );
}
