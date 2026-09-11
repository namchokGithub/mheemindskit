# Image Crop tool

## Summary

เพิ่มเครื่องมือ crop รูปภาพ (PNG, JPG และ format อื่นที่ browser decode ได้ เช่น WebP, GIF, BMP, AVIF) ทำงาน 100% ฝั่ง client ไม่มีการอัปโหลดไฟล์ขึ้น server ตรงตามหลักการของ MindsKit ที่ข้อมูลผู้ใช้ต้องอยู่ในเบราว์เซอร์เท่านั้น ใช้ custom canvas + pointer events ในการวาด crop UI ไม่เพิ่ม npm dependency ใหม่

## Category ใหม่

- เพิ่ม category `images` (`name: 'Images'`) ใน `src/config/tools.ts` แยกจาก JSON/XML/Text Tools เดิม เผื่อรองรับเครื่องมือรูปภาพอื่นในอนาคต (เช่น remove background)
- เพิ่ม tool entry `image-crop` → path `/images/crop`, icon `Crop` (lucide-react)

## ไฟล์ที่เพิ่ม/แก้

- `src/config/tools.ts` — เพิ่ม category `images` และ tool entry `image-crop`
- `src/features/images/crop.ts` — pure logic แยกจาก UI:
  - `clampCropRect()` บังคับ crop rectangle ให้อยู่ในขอบเขตรูปเสมอ
  - `applyAspectRatio()` คำนวณ rect ใหม่เมื่อ lock aspect ratio
  - `cropToBlob(image, rect, mimeType, quality): Promise<Blob>` วาดส่วนที่ crop ลง canvas แล้ว export ผ่าน `canvas.toBlob`
- `src/pages/image-crop-page.tsx` — หน้าเครื่องมือใหม่ ใช้ `ToolPageHeader`, `ToolStatus`, `Button` เดิมตาม pattern ที่มีอยู่
- `src/App.tsx` — เพิ่ม route `/images/crop` → `ImageCropPage`

## Flow การทำงาน

1. ผู้ใช้เลือกไฟล์ผ่าน file input หรือ drag-drop (`accept="image/*"`)
2. โหลดรูปเข้า canvas, แสดง crop rectangle overlay ที่ลาก/ปรับขนาดได้ (รองรับทั้ง mouse และ touch สำหรับมือถือ)
3. Toolbar มี dropdown เลือก aspect ratio (Freeform, 1:1, 4:3, 3:2, 16:9, 9:16) พร้อม toggle lock ratio
4. กด Crop → เรียก `cropToBlob` แล้วแสดงผลลัพธ์ preview
5. ปุ่ม Download ใช้ helper `download()` แบบเดียวกับที่ `code-generators-pages.tsx` ใช้อยู่ — output mime type คงตามไฟล์ต้นฉบับ (PNG เข้า → PNG ออก, JPG เข้า → JPG ออก)
6. ปุ่ม Clear/Reset เพื่อเริ่มใหม่

## Error handling

- ไฟล์เสียหาย/อ่านไม่ได้ → แสดง `ToolStatus` state `invalid` ข้อความ "ไม่สามารถอ่านไฟล์รูปภาพนี้ได้"
- ยังไม่มี crop rectangle → ปุ่ม Crop เป็น disabled

## Scope (v1)

- รองรับรูปทีละ 1 รูปต่อครั้ง (ไม่ทำ batch/zip export)
- ไม่มีตัวเลือก output format แยก — คง format เดิมของไฟล์ที่ upload
- ไม่รวม remove background (เป็นงานแยกที่ effort สูงกว่ามาก ต้องใช้ ML model)

## Validation

- รัน `pnpm build` และ `pnpm lint`
- ทดสอบ manual บน desktop + mobile viewport (ลาก crop rectangle ด้วย touch), ไฟล์ PNG/JPG/WebP อย่างน้อยอย่างละ 1 ไฟล์

## Assumptions

- ไม่เพิ่ม test framework ใหม่ (repo ยังไม่มี vitest/jest) — เก็บ crop-math logic แยกไว้ใน `crop.ts` เพื่อให้ทดสอบเองหรือเพิ่ม automated test ทีหลังได้ง่าย
- ไม่จำกัดขนาดไฟล์/ขนาดรูปสูงสุดใน v1 (ปล่อยตาม memory limit ของ browser)
