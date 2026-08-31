import type { IndentOption } from '@/types/format'

export function indentUnit(indent: IndentOption): string {
  if (indent === 'tab') return '\t'
  return ' '.repeat(Number(indent))
}

export function offsetToLineColumn(text: string, offset: number): { line: number; column: number } {
  let line = 1
  let column = 1
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text[i] === '\n') {
      line++
      column = 1
    } else {
      column++
    }
  }
  return { line, column }
}
