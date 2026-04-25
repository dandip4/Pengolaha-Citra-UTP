# Dokumentasi Aplikasi

## Digital Image Processing Studio

**Nama:** Danadipa Nugraha  
**NPM:** 065123199

---

## 1. Gambaran Umum

`Digital Image Processing Studio` adalah aplikasi web editor citra digital berbasis browser yang berfokus pada implementasi konsep pengolahan citra secara akademik.  
Berbeda dari demo sederhana, aplikasi ini dirancang seperti mini image editor profesional dengan alur kerja terstruktur dan panel dokumentasi teori.

Tujuan utama aplikasi:
- menyediakan fitur pengolahan citra inti dalam satu workspace,
- memperlihatkan proses bertahap (pipeline),
- membantu pengguna memahami konsep matematis tiap algoritma.

---

## 2. Tech Stack dan Peran

- **Next.js (App Router)**: framework utama aplikasi web modern.
- **TypeScript**: typing kuat untuk menjaga kualitas kode dan mengurangi bug.
- **Tailwind CSS**: styling utility-first untuk membangun layout editor secara cepat dan konsisten.
- **shadcn/ui style components**: pola komponen reusable (button, slider, panel).
- **OpenCV.js**: engine pemrosesan citra di browser.
- **HTML Canvas**: media render citra input-output.
- **Lucide React**: icon pada toolbar dan panel.
- **ESLint**: validasi kualitas kode.

---

## 3. Fitur Aplikasi

### 3.1 Layout Editor
- **Top Toolbar**: Upload, Undo, Redo, Reset, Export.
- **Left Sidebar**: semua tools pemrosesan + preset.
- **Center Workspace**: preview citra, before/after compare, pipeline history.
- **Right Panel**: histogram dan dokumentasi akademik.

### 3.2 Modul Pengolahan Citra

#### A. Basic Pixel Operations
- Grayscale conversion
- Binary thresholding
- Brightness adjustment
- Contrast adjustment

#### B. Filters
- Mean filter
- Median filter
- Edge filter (Laplacian)

#### C. Geometric Operations
- Rotation
- Scaling
- Translation

#### D. Segmentation
- Sobel edge detection
- Prewitt edge detection
- Canny edge detection

#### E. Morphology
- Erosion
- Dilation
- Opening
- Closing

#### F. Histogram
- Histogram RGB dan grayscale
- Histogram Equalization

### 3.3 Fitur Tambahan
- Before/After compare slider
- Undo/Redo history
- Export image
- Real-time parameter sliders
- Preset processing recipes

---

## 4. Alur Kerja (Workflow Pipeline)

Pipeline utama pada aplikasi:

`Original -> Grayscale -> Contrast -> Filter -> Segmentation`

Setiap operasi yang dijalankan akan:
1. memproses citra dengan OpenCV.js,
2. memperbarui hasil di workspace,
3. menambahkan snapshot ke pipeline history,
4. memperbarui histogram.

Dengan pendekatan ini, proses menjadi terstruktur dan mudah dijelaskan saat presentasi.

---

## 5. Konsep dan Prinsip Algoritma

### 5.1 Grayscale
- **Konsep:** konversi RGB menjadi intensitas tunggal.
- **Rumus umum:** `I = 0.299R + 0.587G + 0.114B`
- **Use case:** preprocessing OCR, deteksi tepi.

### 5.2 Binary Threshold
- **Konsep:** klasifikasi piksel menjadi hitam/putih berdasarkan ambang.
- **Rumus:**  
  `f(x,y)=255 jika I(x,y)>=T, dan 0 jika I(x,y)<T`
- **Use case:** segmentasi objek dari background.

### 5.3 Brightness dan Contrast
- **Prinsip linear:** `I' = alpha * I + beta`
- `alpha`: contrast, `beta`: brightness.
- **Use case:** normalisasi pencahayaan dan penajaman kontras global.

### 5.4 Mean Filter
- **Konsep:** rata-rata nilai piksel pada area tetangga.
- **Kernel 3x3:**  
  `1/9 * [[1,1,1],[1,1,1],[1,1,1]]`
- **Use case:** smoothing noise ringan.

### 5.5 Median Filter
- **Konsep:** piksel diganti median dari tetangga.
- **Use case:** efektif untuk salt-and-pepper noise.

### 5.6 Edge Filter (Laplacian)
- **Konsep:** menonjolkan perubahan intensitas tinggi.
- **Use case:** mempertegas kontur/tepi.

### 5.7 Sobel
- **Konsep:** gradien horizontal dan vertikal.
- **Kernel:**  
  `Gx=[[-1,0,1],[-2,0,2],[-1,0,1]]`  
  `Gy=[[1,2,1],[0,0,0],[-1,-2,-1]]`
- **Use case:** deteksi tepi berbasis gradien.

### 5.8 Prewitt
- **Konsep:** deteksi gradien dengan bobot lebih sederhana dari Sobel.
- **Kernel:**  
  `Gx=[[-1,0,1],[-1,0,1],[-1,0,1]]`  
  `Gy=[[1,1,1],[0,0,0],[-1,-1,-1]]`
- **Use case:** analisis tepi dasar.

### 5.9 Canny
- **Tahapan:** smoothing, gradient, non-maximum suppression, double threshold, hysteresis.
- **Use case:** hasil tepi tipis dan robust terhadap noise.

### 5.10 Morfologi
- **Erosion:** mengikis objek foreground.
- **Dilation:** memperbesar objek foreground.
- **Opening:** erosion lalu dilation (hapus noise kecil).
- **Closing:** dilation lalu erosion (tutup celah kecil).

### 5.11 Histogram Equalization
- **Konsep:** redistribusi intensitas untuk meningkatkan kontras global.
- **Use case:** citra low-contrast.

---

## 6. Struktur Proyek (Feature-Based)

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

---

## 7. Cara Menjalankan

### 7.1 Development
```bash
npm install
npm run dev
```
Lalu buka `http://localhost:3000`.

### 7.2 Quality Check
```bash
npm run lint
npm run build
```

### 7.3 Production
```bash
npm run start
```

---

## 8. Panduan Demo Singkat

Urutan demo yang direkomendasikan:
1. Upload gambar
2. Grayscale
3. Contrast
4. Mean/Median filter
5. Canny/Sobel
6. Histogram Equalization
7. Tunjukkan compare slider
8. Tunjukkan undo/redo
9. Export hasil

---

## 9. Kelebihan Implementasi

- Alur proses terstruktur, bukan fitur terpisah.
- Semua modul utama pengolahan citra tersedia dalam satu aplikasi.
- Mendukung analisis visual (histogram + before/after).
- Arsitektur modular dan scalable untuk pengembangan lanjut.

---

## 10. Pengembangan Lanjutan (Opsional)

- Drag handle pada compare line (bukan slider biasa).
- ROI selection (region of interest).
- Batch processing banyak gambar.
- Penyimpanan project pipeline ke JSON.

---

## 11. Kesimpulan

Aplikasi `Digital Image Processing Studio` berhasil mengimplementasikan fitur inti pengolahan citra digital secara komprehensif dengan pendekatan yang rapi, modular, dan siap dipresentasikan sebagai proyek akademik maupun portfolio awal di bidang computer vision web.
