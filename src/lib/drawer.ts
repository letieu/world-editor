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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawNodes();
    this.drawEdges();
    this.drawEditor();

    requestAnimationFrame(() => this.draw());
  }

  private drawGrid() {
    this.context.strokeStyle = 'lightgray';
    this.context.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 10) {
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvas.height);
      this.context.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 10) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvas.width, y);
      this.context.stroke();
    }
  }

  private drawNodes() {
    this.context.fillStyle = 'black';
    this.graph.getNodes().forEach(node => {
      this.context.beginPath();
      this.context.arc(node.x, node.y, 5, 0, 2 * Math.PI);
      this.context.fill();
    });
  }

  private drawEdges() {
    this.context.strokeStyle = 'red';
    this.graph.getEdges().forEach(edge => {
      this.context.beginPath();
      this.context.moveTo(edge[0].x, edge[0].y);
      this.context.lineTo(edge[1].x, edge[1].y);
      this.context.stroke();
    });
  }

  private drawEditor() {
    const cursor = this.editor.cursor;
    this.context.fillStyle = 'gray';
    this.context.beginPath();
    this.context.arc(cursor.x, cursor.y, 5, 0, 2 * Math.PI);
    this.context.fill();

    // draw hover node
    const hoverIndex = this.editor.hoverNode;
    const hoverNode = this.graph.getNode(hoverIndex);
    if (hoverNode) {
      this.context.fillStyle = 'rgba(0, 0, 255, 0.5)';
      this.context.beginPath();
      this.context.arc(
        hoverNode.x,
        hoverNode.y,
        10,
        0,
        2 * Math.PI
      );
      this.context.fill();

      // change cursor
      this.canvas.style.cursor = 'pointer';
    }

    // draw selected node
    const selectedNode = this.editor.selectedNode;
    if (selectedNode !== null) {
      this.context.fillStyle = 'green';
      this.context.beginPath();
      this.context.arc(
        this.graph.getNodes()[selectedNode].x,
        this.graph.getNodes()[selectedNode].y,
        5,
        0,
        2 * Math.PI
      );
      this.context.fill();

      this.context.strokeStyle = 'green';
      this.context.beginPath();
      this.context.moveTo(this.graph.getNodes()[selectedNode].x, this.graph.getNodes()[selectedNode].y);
      this.context.lineTo(cursor.x, cursor.y);
      this.context.stroke();
    }
  }
}
