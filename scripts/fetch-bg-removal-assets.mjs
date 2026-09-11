#!/usr/bin/env node
/**
 * Fetches the self-hosted @imgly/background-removal assets into public/models/bg-removal/.
 *
 * Only downloads the chunks needed for the "isnet" (full) model on the CPU device
 * (no GPU/JSEP, no other model sizes) — matches src/features/images/remove-background.ts.
 *
 * public/models/bg-removal/ is gitignored (~180MB binary) and instead fetched on every
 * `pnpm build` (see package.json) — Cloudflare Pages runs this on each deploy. Locally,
 * re-running is a fast no-op once the expected files already exist; delete the folder
 * (or bump the @imgly/background-removal version) to force a fresh re-download.
 *
 * Usage: node scripts/fetch-bg-removal-assets.mjs
 */
import { execFileSync } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, unlinkSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url))
const { dependencies } = JSON.parse(await readFile(packageJsonPath, 'utf8'))
const version = dependencies['@imgly/background-removal']?.replace(/^[^\d]*/, '')
if (!version) throw new Error('Could not resolve @imgly/background-removal version from package.json')

const DATA_TARBALL_URL = `https://staticimgly.com/@imgly/background-removal-data/${version}/package.tgz`
const NEEDED_RESOURCE_PATHS = [
  '/models/isnet',
  '/onnxruntime-web/ort-wasm-simd-threaded.wasm',
  '/onnxruntime-web/ort-wasm-simd-threaded.mjs',
]
const OUTPUT_DIR = fileURLToPath(new URL('../public/models/bg-removal', import.meta.url))
const TEMP_DIR = fileURLToPath(new URL('../.tmp-bg-removal-fetch', import.meta.url))
const TEMP_TARBALL = path.join(TEMP_DIR, 'package.tgz')
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'resources.json')

function alreadyUpToDate() {
  if (!existsSync(MANIFEST_PATH)) return false
  let manifest
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    return false
  }
  const sameResourceSet = JSON.stringify(Object.keys(manifest).sort()) === JSON.stringify([...NEEDED_RESOURCE_PATHS].sort())
  if (!sameResourceSet) return false
  return Object.values(manifest).every((entry) => entry.chunks.every((chunk) => existsSync(path.join(OUTPUT_DIR, chunk.name))))
}

if (alreadyUpToDate()) {
  console.log(`${OUTPUT_DIR} already has the expected assets — skipping download.`)
  process.exit(0)
}

mkdirSync(TEMP_DIR, { recursive: true })

console.log(`Downloading ${DATA_TARBALL_URL} …`)
const response = await fetch(DATA_TARBALL_URL)
if (!response.ok) throw new Error(`Failed to download ${DATA_TARBALL_URL}: ${response.status}`)
await pipeline(response.body, createWriteStream(TEMP_TARBALL))

console.log('Reading resources.json manifest …')
execFileSync('tar', ['-xzf', TEMP_TARBALL, '-C', TEMP_DIR, 'package/dist/resources.json'])
const resources = JSON.parse(await readFile(path.join(TEMP_DIR, 'package/dist/resources.json'), 'utf8'))

const neededMemberPaths = []
for (const resourcePath of NEEDED_RESOURCE_PATHS) {
  for (const chunk of resources[resourcePath].chunks) neededMemberPaths.push(`package/dist/${chunk.name}`)
}

console.log(`Extracting ${neededMemberPaths.length} chunk files into ${OUTPUT_DIR} …`)
mkdirSync(OUTPUT_DIR, { recursive: true })
execFileSync('tar', ['-xzf', TEMP_TARBALL, '-C', OUTPUT_DIR, '--strip-components=2', ...neededMemberPaths])

// @imgly fetches "resources.json" from `publicPath` at runtime (it is NOT bundled into the
// package's JS) — self-hosting must include a trimmed manifest covering only what we host,
// or every load fails with "Resource metadata not found" / an SPA-fallback JSON parse error.
const trimmedResources = Object.fromEntries(NEEDED_RESOURCE_PATHS.map((resourcePath) => [resourcePath, resources[resourcePath]]))
await writeFile(path.join(OUTPUT_DIR, 'resources.json'), JSON.stringify(trimmedResources, null, 2))

// Remove stale chunk files left over from a previous model/config choice.
const neededHashes = new Set(neededMemberPaths.map((memberPath) => path.basename(memberPath)))
for (const entry of readdirSync(OUTPUT_DIR)) {
  if (entry !== 'resources.json' && !neededHashes.has(entry)) unlinkSync(path.join(OUTPUT_DIR, entry))
}

rmSync(TEMP_DIR, { recursive: true, force: true })
console.log(`Done. ${OUTPUT_DIR} is gitignored — nothing to commit.`)
