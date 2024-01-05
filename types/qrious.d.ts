declare module "qrious" {
  interface Option {
    element?: HTMLElement | null;
    value?: string;
    size?: number;
    padding?: number;
    level?: "L" | "M" | "Q" | "H";
    foreground?: string;
    background?: string;
  }
  class QRious {
    constructor(option: Option);
    set(option: Option): void;
  }
  export default QRious;
}
