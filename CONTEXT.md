# MindsKit — Context for AI/Developer Continuation

## Product

- **Name:** MindsKit
- **Goal:** A lightweight, expandable developer toolbox that runs in the browser.
- **Principles:**
  - User data stays in the browser whenever possible — no pasted content is sent to a server.
  - Simple, focused tools over an all-in-one complex app.

## Tech Stack

Vite, React, TypeScript (strict), Tailwind CSS v4, shadcn/ui (Radix base), lucide-react, React Router, sonner, pnpm.

## Architecture

- **Tool registry** (`src/config/tools.ts`): single source of truth for every tool (id, name, description, category, path, icon). Sidebar, home page, and routing all read from this — never hardcode tool metadata elsewhere.
- **Feature logic** (`src/features/formatters/*`): pure, UI-free functions (`formatJson`, `minifyJson`, `validateJson`, `formatXml`, `minifyXml`, `validateXml`). All return `FormatResult` / `ValidateResult` from `src/types/format.ts`. Kept separate from components so they stay easy to reason about and reuse.
- **Shared tool UI** (`src/components/tool/*`): `CodeEditor` (plain monospace textarea), `CopyButton`, `IndentSelect`, `ToolStatus` (inline valid/invalid banner), `ToolPageHeader`, and `FormatterPage` (generic two-pane input/output page used by JSON Formatter and JSON Minifier). XML Formatter has its own page component because it needs two actions (Format + Minify) instead of one. JSON Validator has its own page because it's single-pane (no output editor, since it must never modify input).
- **Routing**: React Router, defined in `src/App.tsx`. All tool routes are nested under a shared `AppShell` layout (`src/components/layout/app-shell.tsx`) which renders the sidebar (desktop) / Sheet drawer (mobile) plus the theme toggle.
- **Client-side processing only**: JSON via native `JSON.parse`/`JSON.stringify`; XML via native `DOMParser`/`XMLSerializer` (with a hand-written recursive pretty-printer, since the browser doesn't pretty-print XML natively).
- **Theming**: `src/hooks/use-theme.tsx` toggles a `dark` class on `<html>`, persisted to `localStorage`. An inline script in `index.html` applies the class before React mounts to avoid a flash of the wrong theme.

## Current Scope (Phase 1 — complete)

- JSON Formatter (`/formatters/json`)
- JSON Minifier (`/formatters/json-minify`)
- JSON Validator (`/formatters/json-validator`)
- XML Formatter (`/formatters/xml`, includes format + minify + validate)

## Decisions

- No backend, no database, no auth, no Firebase, no Cloudflare Workers — static SPA only.
- No Monaco editor — plain styled `<textarea>` is enough for Phase 1 (no syntax highlighting yet).
- All formatting/validation happens client-side; nothing pasted is ever sent over the network.
- Deploys to Cloudflare Pages as a static site (`pnpm build` → `dist`); `public/_redirects` handles SPA routing fallback.
- Accent color is a single violet (`--primary`/`--ring` in `src/index.css`); everything else is neutral gray, matching the "minimal visual noise" design direction.

## Future (not yet implemented — do not build ahead of need)

- Text Tools
- Encode / Decode
- Generators
- Converters

The tool registry and route structure are already generic enough to add these as new entries/pages without restructuring.
