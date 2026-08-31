# MindsKit

> Small, privacy-first developer tools for working with JSON and XML — right in your browser.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

**[Open the repository](https://github.com/namchokGithub/mheemindskit)** · **[Run it locally](#getting-started)** · **[Live site — coming soon](#live-site)**

## What is MindsKit?

MindsKit is a lightweight, browser-only toolbox for everyday development tasks. Paste structured data, use the tool you need, and copy the result — without sending your content to a server.

It is designed to be quick, focused, and pleasant to use for small formatting and validation jobs.

## What can it do?

### JSON tools

- **Formatter** — prettify JSON with 2-space, 4-space, or tab indentation.
- **Minifier** — compact JSON into a single line.
- **Validator** — check JSON validity and show line/column error details without changing the input.

### XML tools

- **Formatter** — format, minify, and validate XML.

More tools for text, encoding, generators, and conversions are planned.

## Privacy first

All processing happens locally in the browser. MindsKit uses native browser APIs (`JSON`, `DOMParser`, and `XMLSerializer`) and does not send pasted content to a server or third-party API.

## Tech stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- [React Router](https://reactrouter.com/)
- [Lucide](https://lucide.dev/) icons
- [Sonner](https://sonner.emilkowal.ski/) notifications

## Getting started

### Prerequisites

- Node.js 20 or newer
- [pnpm](https://pnpm.io/)

### Install and run

```bash
git clone https://github.com/namchokGithub/mheemindskit.git
cd mheemindskit
pnpm install
pnpm dev
```

The development server opens automatically at [http://localhost:5173](http://localhost:5173).

### Production build

```bash
pnpm build
```

The production files are generated in `dist/`.

## Live site

The public MindsKit website is coming soon. Once it is deployed, this section will contain a direct link so anyone can start using the tools immediately.

## Deployment

MindsKit is a static, client-side app and can be deployed to services such as Cloudflare Pages.

- Build command: `pnpm build`
- Output directory: `dist`
- SPA redirects: `public/_redirects` includes `/* /index.html 200` for direct route navigation.

## License

License terms will be added soon.
