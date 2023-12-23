import { Graph } from "./maths/graph";
import { ViewPort } from "./viewport";

export class Editor {
  public viewPort: ViewPort;

  private graph: Graph;
  private canvas: HTMLCanvasElement;

  hoverNode: number | null = null;
  selectedNode: number | null = null;
  dragNode: number | null = null;
  cursor: { x: number; y: number } = { x: 0, y: 0 };

  constructor(graph: Graph, viewPort: ViewPort) {
    this.graph = graph;
    this.canvas = viewPort.canvas;
    this.viewPort = viewPort;

    this.setupEventListeners();

    const firstNode = this.graph.getNode(0);
    if (firstNode) {
      this.selectedNode = 0;
    }
  }

  private setupEventListeners() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleMouseDown(event: MouseEvent) {
    if (event.button === 0) { // left click
      this.handleLeftClick(event);
    } else if (event.button === 2) { // right click
      this.handleRightClick();
    }
  }

  private handleLeftClick(event: MouseEvent) {
    if (this.hoverNode !== null) {
      this.handleNodeSelection();
    } else {
      this.handleNodeCreation(event);
    }
  }

  private handleNodeSelection() {
    if (this.selectedNode !== null) {
      this.addEdgeAndResetSelection();
    } else {
      this.selectNodeAndBeginDrag();
    }
  }

  private addEdgeAndResetSelection() {
    const nodeA = this.graph.getNode(this.selectedNode);
    const nodeB = this.graph.getNode(this.hoverNode!);
    if (nodeA && nodeB) {
      this.graph.addEdge([nodeA, nodeB]);
    }
    this.selectedNode = null;
  }

  private selectNodeAndBeginDrag() {
    this.selectedNode = this.hoverNode;
    this.dragNode = this.hoverNode;
  }

  private handleNodeCreation(event: MouseEvent) {
    const { x, y } = this.cursor;
    this.graph.addNode({ x, y });
    const lastIndex = this.graph.nodeCount - 1;

    if (this.selectedNode !== null) { // connect to previous node
      const nodeA = this.graph.getNode(this.selectedNode);
      const nodeB = this.graph.getNode(lastIndex);
      if (nodeA && nodeB) {
        this.graph.addEdge([nodeA, nodeB]);
      }
    }
    this.selectedNode = lastIndex;
  }

  private handleRightClick() {
    if (this.hoverNode !== null) {
      this.graph.removeNode(this.hoverNode);
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.selectedNode = null;
    }
  }

  private handleMouseMove(event: MouseEvent) {
    this.updateCursor(event);

    const nearbyNode = this.getNearCursorNode();
    this.hoverNode = nearbyNode ? this.graph.getNodes().indexOf(nearbyNode) : null;

    if (this.dragNode !== null) {
      this.selectedNode = null;
      this.graph.updateNode(this.dragNode, this.cursor);
    }
  }

  private handleMouseUp() {
    if (this.dragNode !== null) {
      this.dragNode = null;
    }
  }

  private handleContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  private getNearCursorNode() {
    const x = this.cursor.x;
    const y = this.cursor.y;
    const distance = this.viewPort.zoom * 10;

    return this.graph.getNodes().find(node => (
      Math.abs(node.x - x) < distance && Math.abs(node.y - y) < distance
    ));
  }

  private updateCursor(event: MouseEvent) {
    const { x, y } = this.viewPort.getCursor(event);
    this.cursor.x = x;
    this.cursor.y = y;
  }
}
