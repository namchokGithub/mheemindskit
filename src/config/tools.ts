import {
  AlignLeft,
  Barcode,
  Binary,
  Bold,
  Braces,
  CheckCircle2,
  Clock,
  Code2,
  Combine,
  Eraser,
  FileCode,
  FileCode2,
  Fingerprint,
  KeyRound,
  Link2,
  QrCode,
  Shrink,
  Shuffle,
  SplitSquareHorizontal,
  Heading,
  Table2,
} from 'lucide-react'

import type { CategoryDefinition, ToolDefinition } from '@/types/tool'

export const categories: CategoryDefinition[] = [
  { id: 'formatters', name: 'Formatters' },
  { id: 'text-tools', name: 'Text Tools' },
  { id: 'encode-decode', name: 'Encode / Decode' },
  { id: 'generators', name: 'Generators' },
  { id: 'converters', name: 'Converters' },
]

export const tools: ToolDefinition[] = [
  // Formatters
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Beautify JSON with adjustable indentation.',
    category: 'formatters',
    path: '/formatters/json',
    icon: Braces,
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    description: 'Minify JSON into a single compact line.',
    category: 'formatters',
    path: '/formatters/json-minify',
    icon: Shrink,
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    description: 'Validate JSON and pinpoint syntax errors.',
    category: 'formatters',
    path: '/formatters/json-validator',
    icon: CheckCircle2,
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Beautify, minify, and validate XML.',
    category: 'formatters',
    path: '/formatters/xml',
    icon: FileCode2,
  },

  // Text Tools
  {
    id: 'remove-spaces',
    name: 'Remove Spaces',
    description: 'Strip extra or all whitespace from text.',
    category: 'text-tools',
    path: '/text-tools/remove-spaces',
    icon: Eraser,
  },
  {
    id: 'make-one-line',
    name: 'Make One Line',
    description: 'Join multi-line text into a single line.',
    category: 'text-tools',
    path: '/text-tools/make-one-line',
    icon: AlignLeft,
  },
  {
    id: 'text-decoration',
    name: 'Text Decoration',
    description: 'Apply case and style transforms to text.',
    category: 'text-tools',
    path: '/text-tools/text-decoration',
    icon: Bold,
  },
  {
    id: 'markdown',
    name: 'Markdown',
    description: 'Apply Markdown emphasis to text.',
    category: 'text-tools',
    path: '/text-tools/markdown',
    icon: Heading,
  },
  {
    id: 'split-text',
    name: 'Split Text',
    description: 'Split text into parts by a delimiter.',
    category: 'text-tools',
    path: '/text-tools/split-text',
    icon: SplitSquareHorizontal,
  },
  {
    id: 'join-text',
    name: 'Join Text',
    description: 'Join lines or parts back into one block of text.',
    category: 'text-tools',
    path: '/text-tools/join-text',
    icon: Combine,
  },

  // Encode / Decode
  {
    id: 'base64',
    name: 'Base64',
    description: 'Encode and decode Base64 strings.',
    category: 'encode-decode',
    path: '/encode-decode/base64',
    icon: Binary,
  },
  {
    id: 'url-encode-decode',
    name: 'URL Encode / Decode',
    description: 'Encode and decode URL components.',
    category: 'encode-decode',
    path: '/encode-decode/url',
    icon: Link2,
  },
  {
    id: 'html-encode-decode',
    name: 'HTML Encode / Decode',
    description: 'Encode and decode HTML entities.',
    category: 'encode-decode',
    path: '/encode-decode/html',
    icon: Code2,
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode a JSON Web Token to inspect its payload.',
    category: 'encode-decode',
    path: '/encode-decode/jwt',
    icon: KeyRound,
  },

  // Generators
  {
    id: 'uuid',
    name: 'UUID',
    description: 'Generate random UUIDs.',
    category: 'generators',
    path: '/generators/uuid',
    icon: Fingerprint,
  },
  {
    id: 'qr-code',
    name: 'QR Code',
    description: 'Generate a QR code from text or a URL.',
    category: 'generators',
    path: '/generators/qr-code',
    icon: QrCode,
  },
  {
    id: 'barcode',
    name: 'Barcode',
    description: 'Generate a barcode from text.',
    category: 'generators',
    path: '/generators/barcode',
    icon: Barcode,
  },
  {
    id: 'random-string',
    name: 'Random String',
    description: 'Generate random strings and passwords.',
    category: 'generators',
    path: '/generators/random-string',
    icon: Shuffle,
  },

  // Converters
  {
    id: 'json-to-yaml',
    name: 'JSON → YAML',
    description: 'Convert JSON data to YAML.',
    category: 'converters',
    path: '/converters/json-to-yaml',
    icon: FileCode,
  },
  {
    id: 'json-to-csv',
    name: 'JSON → CSV',
    description: 'Convert a JSON array to CSV.',
    category: 'converters',
    path: '/converters/json-to-csv',
    icon: Table2,
  },
  {
    id: 'unix-timestamp',
    name: 'Unix Timestamp',
    description: 'Convert between Unix timestamps and dates.',
    category: 'converters',
    path: '/converters/unix-timestamp',
    icon: Clock,
  },
]

export function getToolsByCategory(category: ToolDefinition['category']): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category)
}
