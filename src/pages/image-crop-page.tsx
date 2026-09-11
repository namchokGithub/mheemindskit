import { Crop as CropIcon, Download, Eraser, ImagePlus } from 'lucide-react'
import { useRef, useState } from 'react'

import { ToolPageHeader } from '@/components/tool/tool-page-header'
import { ToolStatus } from '@/components/tool/tool-status'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  applyAspectRatio,
  clampCropRect,
  cropToBlob,
  exportFileName,
  moveCropRect,
  resizeCropRect,
  resolveExportMimeType,
  type CropCorner,
  type CropRect,
  type ImageBounds,
} from '@/features/images/crop'
import { cn } from '@/lib/utils'

const RATIO_OPTIONS: { value: string; label: string; ratio: number | null }[] = [
  { value: 'free', label: 'Freeform', ratio: null },
  { value: '1:1', label: '1:1 (square)', ratio: 1 },
  { value: '4:3', label: '4:3', ratio: 4 / 3 },
  { value: '3:2', label: '3:2', ratio: 3 / 2 },
  { value: '16:9', label: '16:9', ratio: 16 / 9 },
  { value: '9:16', label: '9:16', ratio: 9 / 16 },
]

type DragMode = 'move' | CropCorner

interface DragState {
  mode: DragMode
  startPointer: { x: number; y: number }
  startRect: CropRect
}

function download(href: string, filename: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  link.click()
}

export function ImageCropPage() {
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('')
  const [imageSrc, setImageSrc] = useState('')
  const [naturalSize, setNaturalSize] = useState<ImageBounds | null>(null)
  const [cropRect, setCropRect] = useState<CropRect | null>(null)
  const [ratioKey, setRatioKey] = useState('free')
  const [error, setError] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [resultFileName, setResultFileName] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)

  const imgRef = useRef<HTMLImageElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ratio = RATIO_OPTIONS.find((option) => option.value === ratioKey)?.ratio ?? null

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (imageSrc) URL.revokeObjectURL(imageSrc)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setError('')
    setFileName(file.name)
    setFileType(file.type)
    setNaturalSize(null)
    setCropRect(null)
    setResultUrl('')
    setResultFileName('')
    setImageSrc(URL.createObjectURL(file))
  }

  const handleImageLoad = () => {
    const img = imgRef.current
    if (!img) return
    const bounds: ImageBounds = { width: img.naturalWidth, height: img.naturalHeight }
    const inset: CropRect = { x: bounds.width * 0.1, y: bounds.height * 0.1, width: bounds.width * 0.8, height: bounds.height * 0.8 }
    setNaturalSize(bounds)
    setCropRect(ratio ? applyAspectRatio(inset, ratio, bounds) : clampCropRect(inset, bounds))
  }

  const handleImageError = () => {
    setError('Could not read this image file.')
    setNaturalSize(null)
    setCropRect(null)
  }

  const handleClear = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc)
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    setImageSrc('')
    setFileName('')
    setFileType('')
    setNaturalSize(null)
    setCropRect(null)
    setResultUrl('')
    setResultFileName('')
    setError('')
  }

  const handleRatioChange = (value: string) => {
    setRatioKey(value)
    const nextRatio = RATIO_OPTIONS.find((option) => option.value === value)?.ratio ?? null
    if (cropRect && naturalSize) setCropRect(applyAspectRatio(cropRect, nextRatio, naturalSize))
  }

  const pointToNatural = (clientX: number, clientY: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper || !naturalSize) return null
    const bounds = wrapper.getBoundingClientRect()
    if (bounds.width === 0 || bounds.height === 0) return null
    return {
      x: ((clientX - bounds.left) / bounds.width) * naturalSize.width,
      y: ((clientY - bounds.top) / bounds.height) * naturalSize.height,
    }
  }

  const startDrag = (event: React.PointerEvent<HTMLDivElement>, mode: DragMode) => {
    if (!cropRect) return
    event.preventDefault()
    event.stopPropagation()
    const point = pointToNatural(event.clientX, event.clientY)
    if (!point) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { mode, startPointer: point, startRect: cropRect }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || !naturalSize) return
    const point = pointToNatural(event.clientX, event.clientY)
    if (!point) return
    const deltaX = point.x - drag.startPointer.x
    const deltaY = point.y - drag.startPointer.y
    const next =
      drag.mode === 'move'
        ? moveCropRect(drag.startRect, deltaX, deltaY, naturalSize)
        : resizeCropRect(drag.mode, drag.startRect, deltaX, deltaY, ratio, naturalSize)
    setCropRect(next)
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const runCrop = async () => {
    if (!imgRef.current || !cropRect) return
    try {
      const mimeType = resolveExportMimeType(fileType)
      const blob = await cropToBlob(imgRef.current, cropRect, mimeType, mimeType === 'image/jpeg' ? 0.92 : undefined)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(URL.createObjectURL(blob))
      setResultFileName(exportFileName(fileName, mimeType))
      setError('')
    } catch {
      setError('Failed to crop this image.')
    }
  }

  return (
    <div className="flex min-h-0 flex-col gap-4 lg:h-full">
      <ToolPageHeader
        title="Image Crop"
        description="Crop PNG, JPG, and WebP images entirely in your browser."
        showRememberInput={false}
      />

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button type="button" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus />
          {imageSrc ? 'Change image' : 'Choose image'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
            event.target.value = ''
          }}
        />
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Aspect ratio
          <Select value={ratioKey} onValueChange={handleRatioChange}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATIO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <Button type="button" onClick={() => void runCrop()} disabled={!cropRect}>
          <CropIcon />
          Crop
        </Button>
        <Button type="button" variant="outline" onClick={handleClear} disabled={!imageSrc}>
          <Eraser />
          Clear
        </Button>
      </div>

      <ToolStatus state={error ? 'invalid' : 'idle'} message={error} />

      <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        {!imageSrc ? (
          <div
            onDragOver={(event) => {
              event.preventDefault()
              setIsDraggingFile(true)
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(event) => {
              event.preventDefault()
              setIsDraggingFile(false)
              const file = event.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex min-h-70 flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center transition-colors',
              isDraggingFile && 'border-primary bg-primary/5',
            )}
          >
            <ImagePlus className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag and drop an image here, or click to browse.</p>
            <p className="text-xs text-muted-foreground/80">PNG, JPG, WebP, GIF, BMP, and more</p>
          </div>
        ) : (
          <div
            ref={wrapperRef}
            className="relative mx-auto w-full max-w-2xl touch-none overflow-hidden rounded-lg bg-black/5 select-none"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={handleImageLoad}
              onError={handleImageError}
              alt=""
              draggable={false}
              className="block h-auto w-full"
            />
            {cropRect && naturalSize && (
              <div
                onPointerDown={(event) => startDrag(event, 'move')}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                className="absolute cursor-move touch-none border-2 border-white/90"
                style={{
                  left: `${(cropRect.x / naturalSize.width) * 100}%`,
                  top: `${(cropRect.y / naturalSize.height) * 100}%`,
                  width: `${(cropRect.width / naturalSize.width) * 100}%`,
                  height: `${(cropRect.height / naturalSize.height) * 100}%`,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
                }}
              >
                {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => (
                  <div
                    key={corner}
                    onPointerDown={(event) => startDrag(event, corner)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    className={cn(
                      'absolute size-4 touch-none rounded-full border-2 border-white bg-primary',
                      corner === 'nw' && '-top-2 -left-2 cursor-nwse-resize',
                      corner === 'se' && '-right-2 -bottom-2 cursor-nwse-resize',
                      corner === 'ne' && '-top-2 -right-2 cursor-nesw-resize',
                      corner === 'sw' && '-bottom-2 -left-2 cursor-nesw-resize',
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {resultUrl && (
          <div className="flex flex-col items-center gap-3 border-t border-border pt-4">
            <img
              src={resultUrl}
              alt="Cropped result"
              className="max-h-64 max-w-full rounded-lg border border-border object-contain"
            />
            <Button type="button" variant="outline" onClick={() => download(resultUrl, resultFileName)}>
              <Download />
              Download {resultFileName}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
