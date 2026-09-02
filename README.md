# MindsKit

> A privacy-first developer toolbox that runs entirely in your browser.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

MindsKit is a focused collection of tools for formatting data, transforming text, encoding values, and generating identifiers. Paste your content, process it locally, and copy the result—nothing is uploaded to a server.

## Available tools

### Formatters

- JSON Formatter, Minifier, and Validator
- XML Formatter, Minifier, and Validator

### Text tools

- Remove Spaces
- Make One Line, with a custom separator
- Text Decoration: case transforms plus prefix and suffix wrapping
- Markdown: bold and italic transforms with a rendered Markdown preview
- Split Text and Join Text

### Encode / Decode

- Base64 Encode / Decode
- URL Encode / Decode
- HTML Encode / Decode
- JWT Decoder, with formatted header/payload inspection and expiry status (decoding only; no signature verification)

### Generators

- UUID v4, generated in batches of 1, 5, 10, or a custom amount up to 200
- Random String, with configurable count, length, character sets, uniqueness, prefix/suffix, and separators
- QR Code generator, with size/error-correction options and PNG download
- Barcode generator (Code 128, Code 39, EAN-13, EAN-8, and UPC-A), with SVG download

### Converters

- Unix Timestamp ↔ ISO date/time, with browser-local timezone by default and searchable timezone selection
- JSON → YAML, with copy and YAML-file download
- JSON → CSV for arrays of objects, with copy and CSV-file download

## Themes

Choose the system theme or one of six built-in themes. Light themes appear first in the picker:

- Pearl Light, Mint Frost, Amber Dawn
- Midnight Violet, Aurora Blue, Cyber Rose

## Privacy

All processing happens in the browser. Pasted text and generated values are not sent to a server or third-party API. Saving input locally is optional and off by default.

## Tech stack

- [Vite](https://vite.dev/)
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- [React Router](https://reactrouter.com/)
- [CodeMirror](https://codemirror.net/) for JSON, XML, and Markdown editing
- [react-markdown](https://github.com/remarkjs/react-markdown) for Markdown previews
- [qrcode](https://github.com/soldair/node-qrcode), [JsBarcode](https://github.com/lindell/JsBarcode), and [yaml](https://github.com/eemeli/yaml) for client-side generators and conversions

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

The development server opens at [http://localhost:5173](http://localhost:5173).

### Quality checks

```bash
pnpm lint
pnpm build
```

### Deployment

MindsKit is a static single-page application. Deploy it to a static host such as Cloudflare Pages with:

- Build command: `pnpm build`
- Output directory: `dist`
- SPA redirects: `public/_redirects`

## License

[MIT](LICENSE)
