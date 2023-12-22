import { Editor } from "./editor";
import { Graph } from "./maths/graph";

export class Drawer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private graph: Graph;
  private editor: Editor;

  constructor(canvas: HTMLCanvasElement, graph: Graph, editor: Editor) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.graph = graph;
    this.editor = editor;
  }

  draw() {
    this.clearCanvas();
    this.drawGrid();
    this.drawNodes();
    this.drawEdges();
    this.drawEditor();
    requestAnimationFrame(() => this.draw());
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid() {
    const step = 10;
    this.context.strokeStyle = 'lightgray';
    this.context.lineWidth = 1;

    for (let x = 0; x < this.canvas.width; x += step) {
      this.drawLine(x, 0, x, this.canvas.height);
    }

    for (let y = 0; y < this.canvas.height; y += step) {
      this.drawLine(0, y, this.canvas.width, y);
    }
  }

  private drawLine(startX: number, startY: number, endX: number, endY: number) {
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.stroke();
  }

  private drawNodes() {
    this.context.fillStyle = 'black';
    this.graph.getNodes().forEach(node => {
      this.drawPoint(node.x, node.y, 5);
    });
  }

  private drawPoint(x: number, y: number, radius: number) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  private drawEdges() {
    this.context.strokeStyle = 'red';
    this.graph.getEdges().forEach(edge => {
      this.drawLine(edge[0].x, edge[0].y, edge[1].x, edge[1].y);
    });
  }

  private drawEditor() {
    const cursor = this.editor.cursor;
    this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.drawPoint(cursor.x, cursor.y, 5);

    const hoverIndex = this.editor.hoverNode;
    const hoverNode = this.graph.getNode(hoverIndex);
    if (hoverNode) {
      this.drawHoverNode(hoverNode.x, hoverNode.y);
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }

    const selectedIndex = this.editor.selectedNode;
    const selected = this.graph.getNode(selectedIndex);
    if (selected) {
      this.context.fillStyle = 'rgba(0, 125, 255, 0.5)';
      // draw a border around the selected node
      this.drawPoint(selected.x, selected.y, 10);

      this.context.setLineDash([5, 5]);
      this.context.strokeStyle = 'grey';
      this.drawLine(selected.x, selected.y, cursor.x, cursor.y);
      this.context.setLineDash([]);
    }
  }

  private drawHoverNode(x: number, y: number) {
    this.context.fillStyle = 'rgba(0, 0, 255, 0.5)';
    this.drawPoint(x, y, 10);
  }
}
