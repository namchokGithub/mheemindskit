import assert from 'node:assert/strict'
import test from 'node:test'

import { generateJsonData, type JsonGeneratorField } from '../src/features/json-data-generator.ts'

const fields: JsonGeneratorField[] = [
  { id: 'id', name: 'id', type: 'id', nullable: false, unique: true, enumValues: '' },
  { id: 'role', name: 'role', type: 'enum', nullable: false, unique: false, enumValues: 'admin, editor' },
  { id: 'active', name: 'active', type: 'boolean', nullable: false, unique: false, enumValues: '' },
]

test('generates a flat schema-shaped array with sequential IDs and enum values', () => {
  const generated = generateJsonData(fields, 3)
  assert.deepEqual(generated.map((row) => row.id), [1, 2, 3])
  assert.ok(generated.every((row) => row.role === 'admin' || row.role === 'editor'))
  assert.ok(generated.every((row) => typeof row.active === 'boolean'))
})

test('rejects invalid record limits and invalid field schemas', () => {
  assert.throws(() => generateJsonData(fields, 0), /between 1 and 1000/)
  assert.throws(() => generateJsonData([], 1), /at least one field/)
  assert.throws(() => generateJsonData([{ ...fields[0], name: '' }], 1), /needs a name/)
  assert.throws(() => generateJsonData([{ ...fields[0] }, { ...fields[1], id: 'other', name: 'id' }], 1), /must be unique/)
  assert.throws(() => generateJsonData([{ ...fields[1], type: 'enum', enumValues: '' }], 1), /enum value/)
})

test('reports impossible unique combinations instead of returning duplicates', () => {
  assert.throws(() => generateJsonData([{ id: 'flag', name: 'flag', type: 'boolean', nullable: false, unique: true, enumValues: '' }], 3), /Could not generate a unique value/)
})
