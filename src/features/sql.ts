export function formatSqlInClause(input: string, column: string, removeDuplicates: boolean): string {
  const values = input
    .split(/[\s,]+/)
    .map((value) => value.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)

  const ids = removeDuplicates ? [...new Set(values)] : values
  if (!ids.length) throw new Error('Paste at least one UUID or value.')
  if (!column.trim()) throw new Error('Enter a column name.')

  const quotedIds = ids.map((value) => `  '${value.replaceAll("'", "''")}'`).join(',\n')
  return `WHERE ${column.trim()} IN (\n${quotedIds}\n)`
}
