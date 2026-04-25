"use client";

import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ProcessingPreset } from "@/types/editor";

interface ToolsSidebarProps {
  disabled: boolean;
  presets: ProcessingPreset[];
  applyOperation: (
    operation: string,
    label?: string,
    category?: "pixel" | "filter" | "geometry" | "segmentasi" | "morfologi" | "histogram",
    params?: number[],
  ) => Promise<void>;
  runPreset: (presetId: string) => Promise<void>;
}

export function ToolsSidebar({ disabled, presets, applyOperation, runPreset }: ToolsSidebarProps) {
  const [threshold, setThreshold] = useState(128);
  const [brightness, setBrightness] = useState(20);
  const [contrast, setContrast] = useState(1.3);
  const [kernel, setKernel] = useState(3);
  const [rotation, setRotation] = useState(45);
  const [scale, setScale] = useState(1.2);

  return (
    <aside className="h-full min-h-0 w-[290px] overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-3">
      <div className="space-y-4">
        <Panel title="Preset Cepat">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              size="sm"
              variant="secondary"
              className="w-full justify-start"
              onClick={() => void runPreset(preset.id)}
              disabled={disabled}
            >
              {preset.name}
            </Button>
          ))}
        </Panel>

        <Panel title="Basic Pixel">
          <ButtonRow>
            <SmallButton onClick={() => void applyOperation("grayscale", "Grayscale", "pixel")} disabled={disabled}>
              Grayscale
            </SmallButton>
            <SmallButton onClick={() => void applyOperation("binary", "Binary", "pixel", [threshold])} disabled={disabled}>
              Binary
            </SmallButton>
          </ButtonRow>
          <LabelSlider label={`Threshold (${threshold})`} value={threshold} onChange={setThreshold} />
          <LabelSlider label={`Brightness (${brightness})`} min={-100} max={100} value={brightness} onChange={setBrightness} />
          <SmallButton onClick={() => void applyOperation("brightness", "Brightness", "pixel", [brightness])} disabled={disabled}>
            Terapkan Brightness
          </SmallButton>
          <LabelSlider label={`Contrast (${contrast.toFixed(1)})`} min={0.5} max={3} step={0.1} value={contrast} onChange={setContrast} />
          <SmallButton onClick={() => void applyOperation("contrast", "Contrast", "pixel", [contrast])} disabled={disabled}>
            Terapkan Contrast
          </SmallButton>
        </Panel>

        <Panel title="Filter">
          <LabelSlider label={`Kernel (${kernel})`} min={3} max={9} step={2} value={kernel} onChange={setKernel} />
          <ButtonRow>
            <SmallButton onClick={() => void applyOperation("mean", "Mean Filter", "filter", [kernel])} disabled={disabled}>
              Mean
            </SmallButton>
            <SmallButton onClick={() => void applyOperation("median", "Median Filter", "filter", [kernel])} disabled={disabled}>
              Median
            </SmallButton>
          </ButtonRow>
          <SmallButton onClick={() => void applyOperation("edge", "Edge Filter", "filter")} disabled={disabled}>
            Edge Filter
          </SmallButton>
        </Panel>

        <Panel title="Geometri">
          <LabelSlider label={`Rotasi (${rotation}°)`} min={-180} max={180} value={rotation} onChange={setRotation} />
          <SmallButton onClick={() => void applyOperation("rotate", "Rotation", "geometry", [rotation])} disabled={disabled}>
            Apply Rotation
          </SmallButton>
          <LabelSlider label={`Scaling (${scale.toFixed(1)}x)`} min={0.3} max={2.5} step={0.1} value={scale} onChange={setScale} />
          <SmallButton onClick={() => void applyOperation("scale", "Scaling", "geometry", [scale])} disabled={disabled}>
            Apply Scaling
          </SmallButton>
          <SmallButton onClick={() => void applyOperation("translate", "Translation", "geometry", [35, 20])} disabled={disabled}>
            Translation (+35,+20)
          </SmallButton>
        </Panel>

        <Panel title="Segmentasi">
          <ButtonRow>
            <SmallButton onClick={() => void applyOperation("sobel", "Sobel", "segmentasi")} disabled={disabled}>
              Sobel
            </SmallButton>
            <SmallButton onClick={() => void applyOperation("prewitt", "Prewitt", "segmentasi")} disabled={disabled}>
              Prewitt
            </SmallButton>
          </ButtonRow>
          <SmallButton onClick={() => void applyOperation("canny", "Canny", "segmentasi", [60, 170])} disabled={disabled}>
            Canny
          </SmallButton>
        </Panel>

        <Panel title="Morfologi">
          <ButtonRow>
            <SmallButton onClick={() => void applyOperation("erosion", "Erosion", "morfologi", [kernel])} disabled={disabled}>
              Erosion
            </SmallButton>
            <SmallButton onClick={() => void applyOperation("dilation", "Dilation", "morfologi", [kernel])} disabled={disabled}>
              Dilation
            </SmallButton>
          </ButtonRow>
          <ButtonRow>
            <SmallButton onClick={() => void applyOperation("opening", "Opening", "morfologi", [kernel])} disabled={disabled}>
              Opening
            </SmallButton>
            <SmallButton onClick={() => void applyOperation("closing", "Closing", "morfologi", [kernel])} disabled={disabled}>
              Closing
            </SmallButton>
          </ButtonRow>
        </Panel>

        <Panel title="Histogram">
          <SmallButton onClick={() => void applyOperation("hist-eq", "Histogram Equalization", "histogram")} disabled={disabled}>
            Histogram Equalization
          </SmallButton>
        </Panel>
      </div>
    </aside>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function ButtonRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

function SmallButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button size="sm" variant="outline" className="w-full" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

function LabelSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-zinc-400">{label}</p>
      <Slider value={value} onChange={onChange} min={min} max={max} step={step} />
    </div>
  );
}
