"use client";

import { HistogramData } from "@/types/editor";

interface RightPanelProps {
  histogram: HistogramData | null;
}

const docs = [
  {
    name: "Grayscale",
    concept: "Konversi warna ke intensitas tunggal untuk analisis lebih mudah.",
    principle: "I = 0.299R + 0.587G + 0.114B",
    kernel: "-",
    useCase: "Pra-pemrosesan OCR, deteksi tepi, segmentasi.",
  },
  {
    name: "Mean Filter",
    concept: "Meratakan noise dengan rata-rata tetangga piksel.",
    principle: "Konvolusi linear dengan kernel seragam.",
    kernel: "1/9 * [[1,1,1],[1,1,1],[1,1,1]]",
    useCase: "Mengurangi noise acak halus.",
  },
  {
    name: "Sobel",
    concept: "Deteksi tepi berbasis perubahan gradien.",
    principle: "Magnitude gradien: sqrt(Gx^2 + Gy^2)",
    kernel: "Gx=[[-1,0,1],[-2,0,2],[-1,0,1]], Gy=[[1,2,1],[0,0,0],[-1,-2,-1]]",
    useCase: "Ekstraksi struktur objek.",
  },
  {
    name: "Canny",
    concept: "Deteksi tepi multi-tahap dengan hysteresis threshold.",
    principle: "Gaussian blur -> gradient -> non-max suppression -> hysteresis.",
    kernel: "Menggunakan operator gradien + ambang ganda.",
    useCase: "Tepi lebih tipis dan robust.",
  },
  {
    name: "Morphology",
    concept: "Operasi bentuk objek pada citra biner/tepi.",
    principle: "Erosi, dilasi, opening, closing berbasis structuring element.",
    kernel: "Rect kernel 3x3 atau 5x5.",
    useCase: "Menghapus noise kecil dan menutup lubang.",
  },
];

export function RightPanel({ histogram }: RightPanelProps) {
  return (
    <aside className="h-full min-h-0 w-[360px] overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-3">
      <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
        <h3 className="mb-3 text-sm font-semibold">Histogram RGB + Gray</h3>
        <HistogramChart histogram={histogram} />
      </section>

      <section className="mt-4 space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
        <h3 className="text-sm font-semibold">Panel Dokumentasi Akademik</h3>
        {docs.map((item) => (
          <article key={item.name} className="rounded border border-zinc-800 bg-zinc-950 p-2 text-xs">
            <p className="font-semibold text-zinc-200">{item.name}</p>
            <p className="mt-1 text-zinc-400">Konsep: {item.concept}</p>
            <p className="text-zinc-400">Prinsip: {item.principle}</p>
            <p className="text-zinc-400">Kernel: {item.kernel}</p>
            <p className="text-zinc-400">Use case: {item.useCase}</p>
          </article>
        ))}
      </section>
    </aside>
  );
}

function HistogramChart({ histogram }: { histogram: HistogramData | null }) {
  if (!histogram) return <p className="text-xs text-zinc-500">Histogram muncul setelah gambar di-load.</p>;

  const max = Math.max(...histogram.r, ...histogram.g, ...histogram.b, ...histogram.gray);

  return (
    <div className="space-y-2">
      {[
        { key: "r", label: "R", color: "bg-red-500", data: histogram.r },
        { key: "g", label: "G", color: "bg-green-500", data: histogram.g },
        { key: "b", label: "B", color: "bg-blue-500", data: histogram.b },
        { key: "gray", label: "Gray", color: "bg-zinc-300", data: histogram.gray },
      ].map((channel) => (
        <div key={channel.key}>
          <p className="mb-1 text-[10px] text-zinc-400">{channel.label}</p>
          <div className="flex h-16 items-end gap-px overflow-hidden rounded border border-zinc-700 bg-zinc-950 px-1">
            {channel.data.map((v, idx) => (
              <span
                key={`${channel.key}-${idx}`}
                className={`w-[1px] ${channel.color}`}
                style={{ height: `${Math.max(1, (v / max) * 100)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
