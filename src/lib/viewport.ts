export class ViewPort {
  public canvas: HTMLCanvasElement;
  public zoom = 1;

  private context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;

    this.setupEventListeners();
  }
  setupEventListeners() {
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
  }

  private handleWheel(event: WheelEvent) {
    const dir = Math.sign(event.deltaY)
    const step = 0.1

    this.zoom += dir * step
    this.zoom = Math.max(1, Math.min(5, this.zoom))
  }

  getCursor(event: MouseEvent) {
    return {
      x: event.offsetX * this.zoom,
      y: event.offsetY * this.zoom
    }
  }
}
