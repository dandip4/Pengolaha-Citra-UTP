import { ProcessingPreset } from "@/types/editor";

export const processingPresets: ProcessingPreset[] = [
  {
    id: "document-enhance",
    name: "Document Enhance",
    description: "Grayscale + peningkatan kontras + biner agar teks lebih jelas.",
    run: async (apply) => {
      await apply("grayscale");
      await apply("contrast", [1.6]);
      await apply("binary", [145]);
    },
  },
  {
    id: "edge-focus",
    name: "Edge Focus",
    description: "Perataan noise ringan lalu ekstraksi tepi Canny.",
    run: async (apply) => {
      await apply("mean", [3]);
      await apply("canny", [60, 170]);
    },
  },
  {
    id: "medical-structure",
    name: "Medical Structure",
    description: "Sobel + closing untuk menonjolkan struktur kontur.",
    run: async (apply) => {
      await apply("grayscale");
      await apply("sobel");
      await apply("closing", [5]);
    },
  },
];
