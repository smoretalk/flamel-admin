class ColorThief {
  constructor();
  getPalette(image: HTMLImageElement): [number, number, number][];
  getColor(image: HTMLImageElement): [number, number, number];
}
interface Window {
  ColorThief: typeof ColorThief;
}
