"use client";

import Script from "next/script";

import { CanvasWorkspace } from "@/features/editor/components/canvas-workspace";
import { RightPanel } from "@/features/editor/components/right-panel";
import { ToolsSidebar } from "@/features/editor/components/tools-sidebar";
import { TopToolbar } from "@/features/editor/components/top-toolbar";
import { useImageEditor } from "@/features/editor/hooks/use-image-editor";
import { useOpenCvReady } from "@/features/editor/hooks/use-open-cv";

export function EditorShell() {
  const isCvReady = useOpenCvReady();
  const editor = useImageEditor(isCvReady);

  return (
    <>
      <Script
        src="https://docs.opencv.org/4.10.0/opencv.js"
        strategy="afterInteractive"
      />

      <div className="flex h-screen flex-col overflow-hidden">
        <TopToolbar
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          disabled={editor.isBusy || !editor.current}
          onUpload={(file) => void editor.loadImage(file)}
          onUndo={() => void editor.undo()}
          onRedo={() => void editor.redo()}
          onReset={() => void editor.reset()}
          onExport={editor.exportImage}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <ToolsSidebar
            disabled={!isCvReady || editor.isBusy || !editor.current}
            presets={editor.presets}
            applyOperation={editor.applyOperation}
            runPreset={editor.runPreset}
          />
          <CanvasWorkspace
            original={editor.original}
            current={editor.current}
            steps={editor.steps}
          />
          <RightPanel histogram={editor.histogram} />
        </div>
      </div>
    </>
  );
}
