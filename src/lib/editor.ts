import { Graph } from "./maths/graph";

export class Editor {
  private graph: Graph;
  private canvas: HTMLCanvasElement;

  hoverNode: number | null = null;
  selectedNode: number | null = null;
  dragNode: number | null = null;
  cursor: { x: number, y: number } = { x: 0, y: 0 };

  constructor(graph: Graph, canvas: HTMLCanvasElement) {
    this.graph = graph;
    this.canvas = canvas;

    this.listenMouseDown();
    this.listenMouseUp();
    this.listenMouseMove();
    this.listenKeyDown();
  }
  listenMouseUp() {
    this.canvas.addEventListener('mouseup', (event) => {
      if (this.dragNode !== null) {
        this.dragNode = null;
      }
    });
  }

  private listenMouseDown() {
    this.canvas.addEventListener('mousedown', (event) => {
      const nearbyNode = this.getNearCursorNode();

      // add edge
      if (nearbyNode && this.selectedNode !== null) {
        this.graph.addEdge([
          this.graph.getNodes()[this.selectedNode],
          nearbyNode
        ]);
        this.selectedNode = null;
        return;
      }

      // select node
      if (nearbyNode) {
        const nodeIndex = this.graph.getNodes().indexOf(nearbyNode);
        this.selectedNode = nodeIndex;
        this.dragNode = nodeIndex;
        return;
      }

      const { x, y } = this.getXYFromEvent(event);

      // add node
      this.graph.addNode({ x, y });

      if (this.selectedNode) {
        this.graph.addEdge([
          this.graph.getNodes()[this.selectedNode],
          this.graph.getNodes()[this.graph.getNodes().length - 1]
        ]);
      }

      this.selectedNode = this.graph.getNodes().length - 1;
    })
  }

  private listenKeyDown() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.selectedNode = null;
      }
    })
  }

  private listenMouseMove() {
    this.canvas.addEventListener('mousemove', (event) => {
      const nearbyNode = this.getNearCursorNode();
      this.hoverNode = nearbyNode ? this.graph.getNodes().indexOf(nearbyNode) : null;

      if (this.dragNode !== null) {
        this.selectedNode = null;
        this.graph.updateNode(this.dragNode, this.cursor);
      }

      this.updateCursor(event);
    })
  }

  private getNearCursorNode() {
    const x = this.cursor.x;
    const y = this.cursor.y;

    const node = this.graph.getNodes().find(node => {
      return Math.abs(node.x - x) < 10 && Math.abs(node.y - y) < 10;
    });

    return node;
  }

  private updateCursor(event: MouseEvent) {
    const { x, y } = this.getXYFromEvent(event);
    this.cursor.x = x;
    this.cursor.y = y;
  }

  private getXYFromEvent(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }
}
