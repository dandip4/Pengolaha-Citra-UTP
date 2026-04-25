"use client";

import { useRef } from "react";
import { Download, Redo2, RotateCcw, Undo2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TopToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  disabled: boolean;
  onUpload: (file: File) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onExport: () => void;
}

export function TopToolbar({
  canUndo,
  canRedo,
  disabled,
  onUpload,
  onUndo,
  onRedo,
  onReset,
  onExport,
}: TopToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 backdrop-blur">
      <div>
        <p className="text-base font-semibold">Digital Image Processing Studio</p>
        <p className="text-xs text-zinc-400">Nama: Danadipa Nugraha | NPM: 065123199</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            // Reset value agar file yang sama bisa dipilih ulang.
            e.currentTarget.value = "";
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="inline-flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload
          </span>
        </Button>
        <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo || disabled}>
          <Undo2 className="h-4 w-4" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo || disabled}>
          <Redo2 className="h-4 w-4" /> Redo
        </Button>
        <Button variant="outline" size="sm" onClick={onReset} disabled={disabled}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button size="sm" onClick={onExport} disabled={disabled}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>
    </header>
  );
}
