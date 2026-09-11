import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      // We always run @imgly/background-removal with device: 'cpu', so the
      // WebGPU/JSEP variant is dead code — but Rollup still statically follows
      // its `new URL(...)` wasm asset reference and bundles ~24MB nobody uses.
      // Collapsing both import specifiers to the plain build avoids that.
      'onnxruntime-web/webgpu': 'onnxruntime-web',
    },
  },
})
