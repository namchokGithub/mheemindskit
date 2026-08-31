export type IndentOption = '2' | '4' | 'tab'

export interface FormatSuccess {
  ok: true
  output: string
}

export interface FormatFailure {
  ok: false
  message: string
  line?: number
  column?: number
}

export type FormatResult = FormatSuccess | FormatFailure

export interface ValidateResult {
  valid: boolean
  message?: string
  line?: number
  column?: number
}
