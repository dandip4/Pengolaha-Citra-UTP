"use client";

import { useCallback, useMemo, useState } from "react";
import { useRef } from "react";

import { processingPresets } from "@/features/editor/constants/presets";
import {
  computeHistogram,
  runOpenCvOperation,
} from "@/features/editor/lib/opencv-operations";
import { EditorSnapshot, HistogramData, PipelineStep, ToolCategory } from "@/types/editor";

const makeStep = (
  label: string,
  category: ToolCategory,
  thumbnail: string,
): PipelineStep => ({
  id: `${label}-${Date.now()}-${Math.random()}`,
  label,
  category,
  thumbnail,
});

export function useImageEditor(isCvReady: boolean) {
  const [original, setOriginal] = useState<string | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [history, setHistory] = useState<EditorSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [histogram, setHistogram] = useState<HistogramData | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const currentRef = useRef<string | null>(null);
  const stepsRef = useRef<PipelineStep[]>([]);
  const historyRef = useRef<EditorSnapshot[]>([]);
  const historyIndexRef = useRef(-1);

  const syncSnapshotState = useCallback((snapshot: EditorSnapshot, index: number) => {
    setCurrent(snapshot.dataUrl);
    setSteps(snapshot.steps);
    historyIndexRef.current = index;
    setHistoryIndex(index);
  }, []);

  const pushState = useCallback((dataUrl: string, pipelineSteps: PipelineStep[]) => {
    const nextHistory = [
      ...historyRef.current.slice(0, historyIndexRef.current + 1),
      { dataUrl, steps: pipelineSteps },
    ];
    historyRef.current = nextHistory;
    setHistory(nextHistory);
    historyIndexRef.current = nextHistory.length - 1;
    setHistoryIndex(nextHistory.length - 1);
  }, []);

  const refreshHistogram = useCallback(async (dataUrl: string) => {
    const data = await computeHistogram(dataUrl);
    setHistogram(data);
  }, []);

  const loadImage = useCallback(
    async (file: File) => {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const initialStep = makeStep("Original", "pixel", dataUrl);
      currentRef.current = dataUrl;
      stepsRef.current = [initialStep];
      setOriginal(dataUrl);
      setCurrent(dataUrl);
      setSteps([initialStep]);
      historyRef.current = [{ dataUrl, steps: [initialStep] }];
      setHistory(historyRef.current);
      historyIndexRef.current = 0;
      setHistoryIndex(0);
      await refreshHistogram(dataUrl);
    },
    [refreshHistogram],
  );

  const applyOperation = useCallback(
    async (
      operation: string,
      label = operation,
      category: ToolCategory = "pixel",
      params?: number[],
    ) => {
      if (!isCvReady || !currentRef.current) return;
      setIsBusy(true);
      try {
        const result = await runOpenCvOperation(currentRef.current, operation, params);
        const nextSteps = [...stepsRef.current, makeStep(label, category, result)];
        currentRef.current = result;
        stepsRef.current = nextSteps;
        setCurrent(result);
        setSteps(nextSteps);
        pushState(result, nextSteps);
        await refreshHistogram(result);
      } finally {
        setIsBusy(false);
      }
    },
    [isCvReady, pushState, refreshHistogram],
  );

  const reset = useCallback(async () => {
    if (!original) return;
    const initialStep = makeStep("Original", "pixel", original);
    currentRef.current = original;
    stepsRef.current = [initialStep];
    historyRef.current = [{ dataUrl: original, steps: [initialStep] }];
    syncSnapshotState(historyRef.current[0], 0);
    setHistory(historyRef.current);
    await refreshHistogram(original);
  }, [original, refreshHistogram, syncSnapshotState]);

  const undo = useCallback(async () => {
    const targetIndex = historyIndexRef.current - 1;
    if (targetIndex < 0) return;
    const prev = historyRef.current[targetIndex];
    if (!prev) return;
    currentRef.current = prev.dataUrl;
    stepsRef.current = prev.steps;
    syncSnapshotState(prev, targetIndex);
    await refreshHistogram(prev.dataUrl);
  }, [refreshHistogram, syncSnapshotState]);

  const redo = useCallback(async () => {
    const targetIndex = historyIndexRef.current + 1;
    if (targetIndex > historyRef.current.length - 1) return;
    const next = historyRef.current[targetIndex];
    if (!next) return;
    currentRef.current = next.dataUrl;
    stepsRef.current = next.steps;
    syncSnapshotState(next, targetIndex);
    await refreshHistogram(next.dataUrl);
  }, [refreshHistogram, syncSnapshotState]);

  const exportImage = useCallback(() => {
    if (!current) return;
    const link = document.createElement("a");
    link.href = current;
    link.download = "processed-image.png";
    link.click();
  }, [current]);

  const runPreset = useCallback(
    async (presetId: string) => {
      const preset = processingPresets.find((item) => item.id === presetId);
      if (!preset) return;
      await preset.run(async (operation, params) => {
        const readable = operation.replace("-", " ");
        await applyOperation(operation, `Preset: ${readable}`, "pixel", params);
      });
    },
    [applyOperation],
  );

  return useMemo(
    () => ({
      original,
      current,
      steps,
      histogram,
      isBusy,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1,
      presets: processingPresets,
      loadImage,
      applyOperation,
      undo,
      redo,
      reset,
      exportImage,
      runPreset,
    }),
    [
      applyOperation,
      current,
      exportImage,
      histogram,
      history.length,
      historyIndex,
      isBusy,
      loadImage,
      original,
      redo,
      reset,
      runPreset,
      steps,
      undo,
    ],
  );
}
