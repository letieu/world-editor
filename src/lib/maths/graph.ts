import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";

export class Graph {
  private nodes: GraphNode[];
  private edges: GraphEdge[];

  constructor(nodes: GraphNode[], edges: GraphEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  get nodeCount() {
    return this.nodes.length;
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

  removeNode(index: number) {
    const [removedNode] = this.nodes.splice(index, 1);
    // remove edges
    this.edges = this.edges.filter(edge => {
      return edge[0] !== removedNode && edge[1] !== removedNode;
    });
  }

  getNodes() {
    return this.nodes;
  }

  getNode(index: number | null): GraphNode | null {
    if (index === null) {
      return null;
    }
    return this.nodes[index] || null;
  }

  getEdges() {
    return this.edges;
  }
}
