# MindsKit

Simple tools for everyday development.

MindsKit is a lightweight, browser-only developer toolbox. Paste your data, run a tool, get a result — nothing you paste is ever sent to a server.

## Current Phase

**Phase 1 — Formatters**

## Available Tools

- **JSON Formatter** — beautify JSON with 2-space, 4-space, or tab indentation
- **JSON Minifier** — collapse JSON to a single compact line
- **JSON Validator** — check JSON validity with line/column error reporting, without modifying your input
- **XML Formatter** — beautify, minify, and validate XML

More categories (Text Tools, Encode/Decode, Generators, Converters) are planned for later phases.

## Privacy

All formatting runs entirely in your browser using native `JSON` and `DOMParser`/`XMLSerializer` APIs. Pasted content is never sent to any server or third-party API.

## Tech Stack

- Vite
- React + TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui (Radix)
- lucide-react
- React Router
- sonner

## Installation

```bash
pnpm install
```

## Local Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

Output is written to `dist/`.

## Deployment (Cloudflare Pages)

This is a static, client-side-only app.

- Build command: `pnpm build`
- Build output directory: `dist`
- `public/_redirects` (`/* /index.html 200`) is included so direct navigation to routes like `/formatters/json` works correctly on Cloudflare Pages.
