import { removeBackground } from '@imgly/background-removal'

/**
 * Only the "isnet" (full, highest-quality) model and CPU-device WASM runtime
 * are self-hosted under /models/bg-removal/ (see scripts/fetch-bg-removal-assets.mjs) —
 * other models/devices are not available and would 404.
 *
 * On the CPU device the library always runs inference on the main thread
 * (it only proxies to a worker when device is "gpu"), so the tab can be
 * unresponsive for a few seconds while an image is processed.
 */
export function removeImageBackground(image: File | Blob, onProgress?: (key: string, current: number, total: number) => void): Promise<Blob> {
  return removeBackground(image, {
    // @imgly builds `new URL(chunk.name, publicPath)` internally — publicPath must be an
    // absolute URL (a root-relative path throws "Failed to construct 'URL': Invalid base URL").
    publicPath: new URL('/models/bg-removal/', window.location.origin).toString(),
    device: 'cpu',
    model: 'isnet',
    output: { format: 'image/png', quality: 0.8 },
    progress: onProgress,
  })
}
