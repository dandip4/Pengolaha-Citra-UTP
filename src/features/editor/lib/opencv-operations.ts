import { HistogramData } from "@/types/editor";

const ensureCv = () => {
  if (typeof window === "undefined" || !window.cv) {
    throw new Error("OpenCV.js belum siap.");
  }
  return window.cv;
};

async function loadImageToCanvas(dataUrl: string) {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context tidak tersedia.");
  ctx.drawImage(img, 0, 0);
  return canvas;
}

function canvasToDataUrl(canvas: HTMLCanvasElement) {
  return canvas.toDataURL("image/png");
}

export async function runOpenCvOperation(
  dataUrl: string,
  operation: string,
  params: number[] = [],
): Promise<string> {
  const cv = ensureCv();
  const canvas = await loadImageToCanvas(dataUrl);
  const src = cv.imread(canvas);
  const dst = new cv.Mat();

  try {
    switch (operation) {
      case "grayscale":
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
        break;
      case "binary":
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(dst, dst, params[0] ?? 128, 255, cv.THRESH_BINARY);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
        break;
      case "brightness":
        src.convertTo(dst, -1, 1, params[0] ?? 0);
        break;
      case "contrast":
        src.convertTo(dst, -1, params[0] ?? 1, 0);
        break;
      case "mean":
        cv.blur(src, dst, new cv.Size(params[0] ?? 3, params[0] ?? 3));
        break;
      case "median":
        cv.medianBlur(src, dst, params[0] ?? 3);
        break;
      case "edge":
        cv.Laplacian(src, dst, cv.CV_8U, 3, 1, 0, cv.BORDER_DEFAULT);
        break;
      case "rotate": {
        const center = new cv.Point(src.cols / 2, src.rows / 2);
        const rotation = cv.getRotationMatrix2D(center, params[0] ?? 45, 1);
        cv.warpAffine(
          src,
          dst,
          rotation,
          new cv.Size(src.cols, src.rows),
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar(0, 0, 0, 255),
        );
        rotation.delete();
        break;
      }
      case "scale": {
        const scale = params[0] ?? 1;
        const centerX = src.cols / 2;
        const centerY = src.rows / 2;
        const transform = cv.matFromArray(2, 3, cv.CV_64F, [
          scale,
          0,
          (1 - scale) * centerX,
          0,
          scale,
          (1 - scale) * centerY,
        ]);
        cv.warpAffine(
          src,
          dst,
          transform,
          new cv.Size(src.cols, src.rows),
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar(0, 0, 0, 255),
        );
        transform.delete();
        break;
      }
      case "translate": {
        const tx = params[0] ?? 20;
        const ty = params[1] ?? 20;
        const transform = cv.matFromArray(2, 3, cv.CV_64F, [1, 0, tx, 0, 1, ty]);
        cv.warpAffine(
          src,
          dst,
          transform,
          new cv.Size(src.cols, src.rows),
          cv.INTER_LINEAR,
          cv.BORDER_CONSTANT,
          new cv.Scalar(0, 0, 0, 255),
        );
        transform.delete();
        break;
      }
      case "sobel": {
        const gray = new cv.Mat();
        const gx = new cv.Mat();
        const gy = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.Sobel(gray, gx, cv.CV_16S, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.Sobel(gray, gy, cv.CV_16S, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
        cv.convertScaleAbs(gx, gx);
        cv.convertScaleAbs(gy, gy);
        cv.addWeighted(gx, 0.5, gy, 0.5, 0, dst);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
        gray.delete();
        gx.delete();
        gy.delete();
        break;
      }
      case "prewitt": {
        const gray = new cv.Mat();
        const gx = new cv.Mat();
        const gy = new cv.Mat();
        const kx = cv.matFromArray(3, 3, cv.CV_32F, [-1, 0, 1, -1, 0, 1, -1, 0, 1]);
        const ky = cv.matFromArray(3, 3, cv.CV_32F, [1, 1, 1, 0, 0, 0, -1, -1, -1]);
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.filter2D(gray, gx, cv.CV_16S, kx);
        cv.filter2D(gray, gy, cv.CV_16S, ky);
        cv.convertScaleAbs(gx, gx);
        cv.convertScaleAbs(gy, gy);
        cv.addWeighted(gx, 0.5, gy, 0.5, 0, dst);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
        gray.delete();
        gx.delete();
        gy.delete();
        kx.delete();
        ky.delete();
        break;
      }
      case "canny": {
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.Canny(gray, dst, params[0] ?? 50, params[1] ?? 150, 3, false);
        cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
        gray.delete();
        break;
      }
      case "erosion":
      case "dilation":
      case "opening":
      case "closing": {
        const kernelSize = params[0] ?? 3;
        const kernel = cv.getStructuringElement(
          cv.MORPH_RECT,
          new cv.Size(kernelSize, kernelSize),
        );
        if (operation === "erosion") cv.erode(src, dst, kernel);
        if (operation === "dilation") cv.dilate(src, dst, kernel);
        if (operation === "opening") cv.morphologyEx(src, dst, cv.MORPH_OPEN, kernel);
        if (operation === "closing") cv.morphologyEx(src, dst, cv.MORPH_CLOSE, kernel);
        kernel.delete();
        break;
      }
      case "hist-eq": {
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.equalizeHist(gray, gray);
        cv.cvtColor(gray, dst, cv.COLOR_GRAY2RGBA, 0);
        gray.delete();
        break;
      }
      default:
        src.copyTo(dst);
    }

    cv.imshow(canvas, dst);
    return canvasToDataUrl(canvas);
  } finally {
    src.delete();
    dst.delete();
  }
}

export async function computeHistogram(dataUrl: string): Promise<HistogramData> {
  const canvas = await loadImageToCanvas(dataUrl);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context tidak tersedia.");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const r = Array(256).fill(0);
  const g = Array(256).fill(0);
  const b = Array(256).fill(0);
  const gray = Array(256).fill(0);

  for (let i = 0; i < imageData.length; i += 4) {
    const rv = imageData[i];
    const gv = imageData[i + 1];
    const bv = imageData[i + 2];
    const avg = Math.round(0.299 * rv + 0.587 * gv + 0.114 * bv);
    r[rv] += 1;
    g[gv] += 1;
    b[bv] += 1;
    gray[avg] += 1;
  }

  return { r, g, b, gray };
}
