export type CvMat = {
  rows: number;
  cols: number;
  convertTo: (...args: unknown[]) => void;
  copyTo: (...args: unknown[]) => void;
  delete: () => void;
};

export type OpenCV = {
  [key: string]: unknown;
  Mat: new (...args: unknown[]) => CvMat;
  imread: (canvas: HTMLCanvasElement) => CvMat;
  imshow: (canvas: HTMLCanvasElement, image: CvMat) => void;
};
