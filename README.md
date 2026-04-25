# Digital Image Processing Studio

Aplikasi web pengolahan citra digital berbasis **Next.js App Router**, **TypeScript**, **Tailwind**, gaya komponen **shadcn/ui**, dan **OpenCV.js**.

Identitas:
- Nama: **Danadipa Nugraha**
- NPM: **065123199**

## Fitur Utama

### 1) Layout Editor Profesional
- Top toolbar: upload, undo/redo, reset, export
- Left sidebar: tools dan preset
- Center workspace: canvas utama + compare slider + pipeline history
- Right panel: histogram + dokumentasi algoritma

### 2) Modul Pengolahan Citra
- **Basic Pixel**: grayscale, binary threshold, brightness, contrast
- **Filter**: mean, median, edge (Laplacian)
- **Geometri**: rotation, scaling, translation
- **Segmentasi**: Sobel, Prewitt, Canny
- **Morfologi**: erosion, dilation, opening, closing
- **Histogram**: RGB/gray histogram + histogram equalization

### 3) Workflow Pipeline
Alur terstruktur:
`Original -> grayscale -> contrast -> filter -> segmentation`

Setiap operasi menambah snapshot visual pada panel pipeline.

## Struktur Project (Feature-Based)

```txt
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    ui/
      button.tsx
      slider.tsx
  features/
    editor/
      components/
        editor-shell.tsx
        top-toolbar.tsx
        tools-sidebar.tsx
        canvas-workspace.tsx
        right-panel.tsx
      constants/
        presets.ts
      hooks/
        use-open-cv.ts
        use-image-editor.ts
      lib/
        opencv-operations.ts
  lib/
    utils.ts
  types/
    editor.ts
    opencv-shim.ts
    opencv.d.ts
```

## Step-by-Step Implementasi

1. **Setup Project**
   - Inisialisasi Next.js App Router + TypeScript + Tailwind.
2. **UI Foundation**
   - Buat komponen UI reusable (`button`, `slider`) dan utility class merge.
3. **OpenCV Integration**
   - Load `opencv.js` via CDN dengan `next/script`.
   - Hook `useOpenCvReady` memonitor status siap.
4. **Image Editor State**
   - Hook `useImageEditor` kelola state gambar original/current, pipeline, undo/redo, histogram.
5. **Processing Engine**
   - `opencv-operations.ts` berisi implementasi semua algoritma.
6. **Editor Shell**
   - Integrasi toolbar, sidebar, canvas workspace, right panel.
7. **Academic Documentation**
   - Panel teori algoritma, prinsip matematis, kernel, dan use case.
8. **Export & Presets**
   - Export PNG + preset pipeline cepat untuk demonstrasi akademik.

## Ringkasan Konsep Algoritma

### Grayscale
- Konsep: ubah RGB ke 1 channel intensitas.
- Rumus: `I = 0.299R + 0.587G + 0.114B`.
- Use case: preprocessing OCR dan deteksi tepi.

### Threshold Biner
- Konsep: klasifikasi piksel jadi 0/255 berdasar nilai ambang.
- Rumus: `f(x,y)=255 jika I>=T, selainnya 0`.
- Use case: segmentasi objek depan-latar.

### Brightness & Contrast
- Konsep: manipulasi linear intensitas.
- Rumus: `I' = alpha * I + beta` (`alpha`: contrast, `beta`: brightness).
- Use case: normalisasi pencahayaan.

### Mean & Median Filter
- Mean: smoothing linear, baik untuk noise halus.
- Median: non-linear, efektif untuk salt-and-pepper noise.
- Kernel mean 3x3: `1/9` pada semua elemen.

### Sobel, Prewitt, Canny
- Sobel/Prewitt: gradien horizontal/vertikal.
- Canny: pipeline deteksi tepi multi-tahap dengan dual threshold.

### Morfologi
- Erosion: mengecilkan foreground.
- Dilation: membesarkan foreground.
- Opening: erosion lalu dilation (hapus noise kecil).
- Closing: dilation lalu erosion (tutup lubang kecil).

### Histogram Equalization
- Konsep: redistribusi intensitas agar kontras global meningkat.
- Use case: citra low-contrast.

## Menjalankan Project

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

## Deployment Guide

### Opsi A - Vercel (paling cepat)
1. Push project ke GitHub.
2. Login ke Vercel.
3. Import repository.
4. Framework auto-detect: Next.js.
5. Klik Deploy.

### Opsi B - Build Manual
```bash
npm run build
npm run start
```

## Catatan Presentasi Video (5-7 menit)
- Jelaskan layout editor dan alur kerja pipeline.
- Demo minimal 1 contoh dari tiap kategori fitur utama.
- Tunjukkan histogram sebelum/sesudah equalization.
- Jelaskan perbedaan Sobel vs Canny dan opening vs closing.
- Tampilkan identitas pada header aplikasi.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
