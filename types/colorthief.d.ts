declare module "colorthief" {
  class ColorThief {
    constructor();
    getColors(image: HTMLImageElement): [number, number, number][];
    getColor(image: HTMLImageElement): [number, number, number];
  }
  export default ColorThief;
}
