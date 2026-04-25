"use client";

import { useState } from "react";
import NextImage from "next/image";

import { PipelineStep } from "@/types/editor";

interface CanvasWorkspaceProps {
  original: string | null;
  current: string | null;
  steps: PipelineStep[];
}

export function CanvasWorkspace({ original, current, steps }: CanvasWorkspaceProps) {
  const [compare, setCompare] = useState(50);

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-zinc-950/40 p-4">
      <div className="min-h-0 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        {!current ? (
          <div className="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-zinc-700">
            <p className="text-zinc-400">Upload gambar untuk mulai proses.</p>
          </div>
        ) : (
          <>
            <div className="relative mx-auto h-[clamp(280px,55vh,620px)] w-full overflow-hidden rounded-lg border border-zinc-700 bg-black">
              {original && (
                <NextImage
                  src={original}
                  alt="Before"
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 70vw"
                />
              )}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}
              >
                <NextImage
                  src={current}
                  alt="After"
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 70vw"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-blue-400"
                style={{ left: `${compare}%` }}
              />
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-zinc-400">Before/After Compare: {compare}%</p>
              <input
                type="range"
                min={0}
                max={100}
                value={compare}
                onChange={(e) => setCompare(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </>
        )}
      </div>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-3 text-sm font-semibold">Pipeline History</h3>
        <div className="grid max-h-[160px] grid-cols-5 gap-3 overflow-hidden">
          {steps.map((step) => (
            <article key={step.id} className="rounded border border-zinc-700 bg-zinc-950 p-2">
              <NextImage
                src={step.thumbnail}
                alt={step.label}
                width={200}
                height={80}
                unoptimized
                className="h-20 w-full rounded object-cover"
              />
              <p className="mt-2 text-xs font-medium">{step.label}</p>
              <p className="text-[10px] uppercase text-zinc-500">{step.category}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
