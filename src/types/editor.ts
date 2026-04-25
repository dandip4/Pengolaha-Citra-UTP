export type ToolCategory =
  | "pixel"
  | "filter"
  | "geometry"
  | "segmentasi"
  | "morfologi"
  | "histogram";

export interface PipelineStep {
  id: string;
  label: string;
  category: ToolCategory;
  thumbnail: string;
}

export interface EditorSnapshot {
  dataUrl: string;
  steps: PipelineStep[];
}

export interface HistogramData {
  r: number[];
  g: number[];
  b: number[];
  gray: number[];
}

export interface ProcessingPreset {
  id: string;
  name: string;
  description: string;
  run: (apply: (operation: string, params?: number[]) => Promise<void>) => Promise<void>;
}
