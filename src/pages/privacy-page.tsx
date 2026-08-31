import { CheckCircle2, ShieldCheck } from "lucide-react";

const POINTS = [
  "Pasted data is processed with native browser APIs (JSON, DOMParser, XMLSerializer) — it never leaves your device.",
  "MindsKit has no backend, no database, and no server-side processing of anything you paste.",
  "Saving your input across reloads is opt-in and off by default. When enabled, it's stored only in your browser's localStorage.",
  "No analytics capture the content of what you paste, and no accounts or tracking are used.",
];

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1.5">
        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          <ShieldCheck className="size-5 text-primary" />
          Privacy
        </h1>
        <p className="text-sm text-muted-foreground">
          MindsKit is built to keep your data on your device.
        </p>
      </div>

      <ul className="space-y-3">
        {POINTS.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
