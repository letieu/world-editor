import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";

export class Graph {
  private nodes: GraphNode[];
  private edges: GraphEdge[];

  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  addNode(node: GraphNode) {
    this.nodes.push(node);
  }

  addEdge(edge: GraphEdge) {
    this.edges.push(edge);
  }

  updateNode(index: number, { x, y }: { x: number, y: number }) {
    this.nodes[index].x = x;
    this.nodes[index].y = y;
  }

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }
}
