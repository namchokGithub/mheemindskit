import { indentUnit, offsetToLineColumn } from '@/lib/indent'
import type { FormatFailure, FormatResult, IndentOption, ValidateResult } from '@/types/format'

interface ParseSuccess {
  ok: true
  value: unknown
}

type ParseFailure = FormatFailure

function locateJsonError(input: string, message: string): { line?: number; column?: number } {
  const positionMatch = message.match(/position (\d+)/i)
  if (positionMatch) {
    return offsetToLineColumn(input, Number(positionMatch[1]))
  }
  const lineColumnMatch = message.match(/line (\d+) column (\d+)/i)
  if (lineColumnMatch) {
    return { line: Number(lineColumnMatch[1]), column: Number(lineColumnMatch[2]) }
  }
  return {}
}

function cleanMessage(message: string): string {
  return message.replace(/\s*at position \d+(\s*\(line \d+ column \d+\))?/i, '').trim()
}

function safeParseJson(input: string): ParseSuccess | ParseFailure {
  if (!input.trim()) {
    return { ok: false, message: 'Input is empty.' }
  }
  try {
    return { ok: true, value: JSON.parse(input) }
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : 'Invalid JSON.'
    const { line, column } = locateJsonError(input, rawMessage)
    return { ok: false, message: cleanMessage(rawMessage), line, column }
  }
}

export function formatJson(input: string, indent: IndentOption): FormatResult {
  const parsed = safeParseJson(input)
  if (!parsed.ok) return parsed
  return { ok: true, output: JSON.stringify(parsed.value, null, indentUnit(indent)) }
}

export function minifyJson(input: string): FormatResult {
  const parsed = safeParseJson(input)
  if (!parsed.ok) return parsed
  return { ok: true, output: JSON.stringify(parsed.value) }
}

export function stringifyJsonText(input: string): FormatResult {
  return { ok: true, output: JSON.stringify(input) }
}

export function parseJsonString(input: string): FormatResult {
  const parsed = safeParseJson(input)
  if (!parsed.ok) return parsed
  if (typeof parsed.value !== 'string') {
    return { ok: false, message: 'Input must be a JSON string wrapped in double quotes.' }
  }
  return { ok: true, output: parsed.value }
}

export function validateJson(input: string): ValidateResult {
  const parsed = safeParseJson(input)
  if (!parsed.ok) {
    return { valid: false, message: parsed.message, line: parsed.line, column: parsed.column }
  }
  return { valid: true }
}
