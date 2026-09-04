# Modern centered tool workspace

## Summary

ปรับทุก Tool page ให้เป็น product-style layout ที่โฟกัสเนื้อหา: sidebar desktop ถูกซ่อนเป็นค่าเริ่มต้น, header ยังเต็มความกว้าง, และ workspace จัดกึ่งกลางที่กว้างสุด 1120px พร้อมระยะหายใจรอบด้าน

## Key changes

- ปรับ `AppShell` ให้ main content มี centered inner container เฉพาะเส้นทาง Tool:
  - desktop: `w-full max-w-[1120px] mx-auto`
  - mobile/tablet: เต็มความกว้างตาม padding ปัจจุบัน
  - หน้า Home และหน้า static คง layout ที่กว้างกว่าเพื่อให้ tool grid ไม่อึดอัด
- ให้ sidebar desktop เริ่มต้นเป็น hidden แต่คงปุ่ม toggle ใน header ไว้สำหรับผู้ใช้ที่ต้องการ navigation แบบเดิม
- ทำ header และ footer เป็น full-width shell แต่เพิ่ม inner container ที่จัดตำแหน่ง content ให้สอดคล้องกับ main workspace
- ปรับ `ToolPageHeader` เป็น Page Intro ที่ไม่กว้างเกินไป (`max-w-[760px]`) และเพิ่ม top spacing บน desktop เพื่อไม่ให้ title/workspace ชน header
- กำหนด standard workspace สำหรับ Tool page แบบสองคอลัมน์:
  - desktop: `grid-cols-[1.15fr_0.85fr]`
  - ต่ำกว่า desktop: เรียงคอลัมน์แนวตั้ง
  - action bars และปุ่มอยู่ภายในขอบ workspace เดียวกัน
- กำหนดความสูงเริ่มต้นของ editor/workspace บน desktop ที่ 560px; เนื้อหายาวเลื่อนภายใน editor แทนการยืดทั้งหน้า
- ปรับ JWT Encoder / Decoder ให้ใช้ layout standard ใหม่ พร้อมรักษา switch และ workflow เดิม

## Validation

- รัน `pnpm build` และ `pnpm lint`

## Assumptions

- การซ่อน sidebar เป็นค่าเริ่มต้นใช้ state ใน session ปัจจุบัน ไม่เพิ่ม persistence ใหม่
- หน้า Home, Privacy และ License ไม่ถูกบังคับให้ใช้ max-width 1120px
- ไม่มีการเปลี่ยนฟังก์ชันของเครื่องมือหรือ public API; เป็นการปรับ layout และ responsive behavior เท่านั้น
