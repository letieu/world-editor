import './style.css'
import { GraphNode } from './lib/maths/graph-node.ts'
import { Graph } from './lib/maths/graph.ts'
import { Drawer } from './lib/drawer.ts'
import { Editor } from './lib/editor.ts'
import { GraphEdge } from './lib/maths/graph-edge.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <nav id="hint-bar">
      <button>Unselect (Esc)</button>
    </nav>
    <canvas id="canvas" width="400" height="400"></canvas>
  </div>
`

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

const nodes: GraphNode[] = [
  { x: 100, y: 100 },
]
const edges: GraphEdge[] = []

const graph = new Graph(nodes, edges)
const editor = new Editor(graph, canvas)

const drawer = new Drawer(canvas, graph, editor)
drawer.draw()
