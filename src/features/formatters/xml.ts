import { indentUnit } from '@/lib/indent'
import type { FormatFailure, FormatResult, IndentOption, ValidateResult } from '@/types/format'

interface ParseSuccess {
  ok: true
  doc: Document
  declaration: string
}

type ParseFailure = FormatFailure

function extractDeclaration(input: string): string {
  const match = input.match(/^\s*(<\?xml[^?]*\?>)/i)
  return match ? match[1] : ''
}

function extractLineColumn(message: string): { line?: number; column?: number } {
  const combined = message.match(/line\s*(?:number)?[:\s]*?(\d+)[^0-9]*?column[:\s]*?(\d+)/i)
  if (combined) {
    return { line: Number(combined[1]), column: Number(combined[2]) }
  }
  const lineOnly = message.match(/line[:\s]*?(\d+)/i)
  return lineOnly ? { line: Number(lineOnly[1]) } : {}
}

function cleanXmlMessage(raw: string): string {
  return raw
    .replace(/^This page contains the following errors:\s*/i, '')
    .replace(/\s*Below is a rendering of the page up to the first error\.?.*$/is, '')
    .trim()
}

function getParserError(doc: Document): FormatFailure | null {
  const errorNode = doc.getElementsByTagName('parsererror')[0]
  if (!errorNode) return null
  const message = cleanXmlMessage(errorNode.textContent ?? 'Invalid XML.')
  const { line, column } = extractLineColumn(message)
  const display = message.replace(/^error on line \d+ at column \d+:\s*/i, '').trim()
  return { ok: false, message: display || message, line, column }
}

function safeParseXml(input: string): ParseSuccess | ParseFailure {
  if (!input.trim()) {
    return { ok: false, message: 'Input is empty.' }
  }
  const doc = new DOMParser().parseFromString(input, 'application/xml')
  const parserError = getParserError(doc)
  if (parserError) return parserError
  if (!doc.documentElement) {
    return { ok: false, message: 'No root element found.' }
  }
  return { ok: true, doc, declaration: extractDeclaration(input) }
}

const escapeText = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const escapeAttribute = (value: string) => escapeText(value).replace(/"/g, '&quot;')

function meaningfulChildren(node: Element): ChildNode[] {
  return Array.from(node.childNodes).filter(
    (child) => !(child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()),
  )
}

function serializeElement(el: Element, unit: string, depth: number, pretty: boolean): string {
  const pad = pretty ? unit.repeat(depth) : ''
  const attrs = Array.from(el.attributes)
    .map((attr) => `${attr.name}="${escapeAttribute(attr.value)}"`)
    .join(' ')
  const tagOpen = attrs ? `${el.tagName} ${attrs}` : el.tagName
  const children = meaningfulChildren(el)

  if (children.length === 0) {
    return `${pad}<${tagOpen} />`
  }
  if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
    const text = escapeText(children[0].textContent?.trim() ?? '')
    return `${pad}<${tagOpen}>${text}</${el.tagName}>`
  }

  const nl = pretty ? '\n' : ''
  const inner = children
    .map((child) => serializeNode(child, unit, depth + 1, pretty))
    .filter(Boolean)
    .join(nl)
  return `${pad}<${tagOpen}>${nl}${inner}${nl}${pad}</${el.tagName}>`
}

function serializeNode(node: ChildNode, unit: string, depth: number, pretty: boolean): string {
  const pad = pretty ? unit.repeat(depth) : ''
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      return serializeElement(node as Element, unit, depth, pretty)
    case Node.COMMENT_NODE:
      return `${pad}<!--${node.textContent}-->`
    case Node.CDATA_SECTION_NODE:
      return `${pad}<![CDATA[${node.textContent}]]>`
    case Node.TEXT_NODE: {
      const text = node.textContent?.trim()
      return text ? `${pad}${escapeText(text)}` : ''
    }
    default:
      return ''
  }
}

function serialize(parsed: ParseSuccess, unit: string, pretty: boolean): string {
  const body = serializeElement(parsed.doc.documentElement, unit, 0, pretty)
  if (!parsed.declaration) return body
  return pretty ? `${parsed.declaration}\n${body}` : `${parsed.declaration}${body}`
}

export function formatXml(input: string, indent: IndentOption): FormatResult {
  const parsed = safeParseXml(input)
  if (!parsed.ok) return parsed
  return { ok: true, output: serialize(parsed, indentUnit(indent), true) }
}

export function minifyXml(input: string): FormatResult {
  const parsed = safeParseXml(input)
  if (!parsed.ok) return parsed
  return { ok: true, output: serialize(parsed, '', false) }
}

export function validateXml(input: string): ValidateResult {
  const parsed = safeParseXml(input)
  if (!parsed.ok) {
    return { valid: false, message: parsed.message, line: parsed.line, column: parsed.column }
  }
  return { valid: true }
}
