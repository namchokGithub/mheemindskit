export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageBounds {
  width: number
  height: number
}

export type CropCorner = 'nw' | 'ne' | 'sw' | 'se'

const MIN_CROP_SIZE = 1

const EXPORTABLE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

/** Keeps a crop rect fully inside the image bounds with a minimum usable size. */
export function clampCropRect(rect: CropRect, bounds: ImageBounds): CropRect {
  const width = Math.min(Math.max(rect.width, MIN_CROP_SIZE), bounds.width)
  const height = Math.min(Math.max(rect.height, MIN_CROP_SIZE), bounds.height)
  const x = Math.min(Math.max(rect.x, 0), bounds.width - width)
  const y = Math.min(Math.max(rect.y, 0), bounds.height - height)
  return { x, y, width, height }
}

/** Re-fits a rect to a locked aspect ratio (width / height), anchored on its center. Pass `ratio: null` for freeform. */
export function applyAspectRatio(rect: CropRect, ratio: number | null, bounds: ImageBounds): CropRect {
  if (!ratio) return clampCropRect(rect, bounds)

  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2

  let width = rect.width
  let height = width / ratio
  if (height > bounds.height) {
    height = bounds.height
    width = height * ratio
  }
  if (width > bounds.width) {
    width = bounds.width
    height = width / ratio
  }

  return clampCropRect({ x: centerX - width / 2, y: centerY - height / 2, width, height }, bounds)
}

/** Moves a rect by a pointer delta (in natural image pixels), clamped to bounds. */
export function moveCropRect(startRect: CropRect, deltaX: number, deltaY: number, bounds: ImageBounds): CropRect {
  return clampCropRect({ ...startRect, x: startRect.x + deltaX, y: startRect.y + deltaY }, bounds)
}

/**
 * Resizes a rect by dragging one corner, anchored on the opposite corner.
 * If `ratio` is set, height always follows width. Bounded to stay inside the image.
 */
export function resizeCropRect(
  corner: CropCorner,
  startRect: CropRect,
  deltaX: number,
  deltaY: number,
  ratio: number | null,
  bounds: ImageBounds,
): CropRect {
  const anchorX = corner === 'nw' || corner === 'sw' ? startRect.x + startRect.width : startRect.x
  const anchorY = corner === 'nw' || corner === 'ne' ? startRect.y + startRect.height : startRect.y
  const freeX = corner === 'nw' || corner === 'sw' ? startRect.x + deltaX : startRect.x + startRect.width + deltaX
  const freeY = corner === 'nw' || corner === 'ne' ? startRect.y + deltaY : startRect.y + startRect.height + deltaY

  const width = Math.max(MIN_CROP_SIZE, corner === 'nw' || corner === 'sw' ? anchorX - freeX : freeX - anchorX)
  let height = Math.max(MIN_CROP_SIZE, corner === 'nw' || corner === 'ne' ? anchorY - freeY : freeY - anchorY)
  if (ratio) height = width / ratio

  const x = corner === 'nw' || corner === 'sw' ? anchorX - width : anchorX
  const y = corner === 'nw' || corner === 'ne' ? anchorY - height : anchorY

  return clampCropRect({ x, y, width, height }, bounds)
}

/** PNG/JPG/WebP round-trip as-is; anything canvas can decode but not re-encode (GIF, BMP, AVIF, …) falls back to PNG. */
export function resolveExportMimeType(inputType: string): string {
  return EXPORTABLE_MIME_TYPES.has(inputType) ? inputType : 'image/png'
}

export function exportFileName(originalName: string, mimeType: string): string {
  const base = originalName.replace(/\.[^./]+$/, '') || 'image'
  const extension = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/webp' ? 'webp' : 'png'
  return `${base}-cropped.${extension}`
}

export function cropToBlob(source: CanvasImageSource, rect: CropRect, mimeType: string, quality?: number): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(rect.width))
  canvas.height = Math.max(1, Math.round(rect.height))
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Canvas 2D context is unavailable.'))

  ctx.drawImage(source, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to export the cropped image.'))), mimeType, quality)
  })
}
