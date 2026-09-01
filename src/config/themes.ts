export type ThemeMode = 'light' | 'dark'

export type ConcreteThemeName =
  | 'pearl-light'
  | 'midnight-violet'
  | 'aurora-blue'
  | 'cyber-rose'
  | 'mint-frost'
  | 'amber-dawn'

export type ThemePreference = 'system' | ConcreteThemeName

export interface ThemeDefinition {
  id: ConcreteThemeName
  name: string
  mode: ThemeMode
}

export const themes: ThemeDefinition[] = [
  { id: 'pearl-light', name: 'Pearl Light', mode: 'light' },
  { id: 'mint-frost', name: 'Mint Frost', mode: 'light' },
  { id: 'amber-dawn', name: 'Amber Dawn', mode: 'light' },
  { id: 'midnight-violet', name: 'Midnight Violet', mode: 'dark' },
  { id: 'aurora-blue', name: 'Aurora Blue', mode: 'dark' },
  { id: 'cyber-rose', name: 'Cyber Rose', mode: 'dark' },
]

export const DEFAULT_LIGHT_THEME: ConcreteThemeName = 'pearl-light'
export const DEFAULT_DARK_THEME: ConcreteThemeName = 'midnight-violet'

export function getThemeMode(theme: ConcreteThemeName): ThemeMode {
  return themes.find((t) => t.id === theme)?.mode ?? 'light'
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ConcreteThemeName {
  if (preference !== 'system') return preference
  return systemPrefersDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME
}
