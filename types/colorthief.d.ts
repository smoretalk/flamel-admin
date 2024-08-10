class ColorThief {
  constructor();
  getColors(image: HTMLImageElement): [number, number, number][];
  getColor(image: HTMLImageElement): [number, number, number];
}
interface Window {
  ColorThief: typeof ColorThief;
}
