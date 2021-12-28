// @deno-types="https://raw.githubusercontent.com/mourner/tinyqueue/v2.0.3/index.d.ts"
import TinyQueue from "https://raw.githubusercontent.com/mourner/tinyqueue/v2.0.3/index.js";

/**
 * An edge.
 */
export interface IEdge {
  /** Destination node. */
  readonly toNode: number;
  /** Weight of the path to the destination node. */
  readonly weight: number;
}

interface IPath {
  readonly toNode: number;
  readonly weight: number;
}

/**
 * Implementation of Dijkstra's Shortest Path algorithm. This quickly finds the shortest path between a single point
 * and every other point it it connected to.
 *
 * Nodes are numbered from 0 to n-1.
 *
 * This supports having a template graph and adding variable nodes for processing with {@link DijkstraShortestPathSolver.clone}
 * and {@link DijkstraShortestPathSolver.addNode}. This operations are additive. There is not a good general way to remove nodes
 * and edges (subtractive) once they have been added.
 *
 * Adapted from https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026
 * This has been made much faster by treating nodes as an index rather than a string (name). We use `tinyqueue`
 * as our priority queue. All map-likes have been eliminated, but there are still object references. So this is
 * not as fast as possible, but it should be plenty fast and not too heavy on memory.
 */
export class DijkstraShortestPathSolver {
  private constructor(
    protected readonly adjacencyList: IEdge[][],
  ) {
  }

  /**
   * Initialize a new empty solver with the number of nodes needed.
   * @param nodes The number of nodes in the graph.
   * @returns A new solver.
   */
  static init(nodes: number): DijkstraShortestPathSolver {
    if (nodes < 2) {
      throw new RangeError(`solver requires at least 2 nodes: ${nodes}`);
    }

    return new DijkstraShortestPathSolver(
      new Array(nodes).fill(null).map((_v) => new Array(0)),
    );
  }

  /**
   * A clone of this solver.
   *
   * This clone operation is generally very fast, as it is based on array shallow copies.
   *
   * @returns A cloned solver.
   *
   * @see {@link DijkstraShortestPathSolver.addNode}
   */
  clone(): DijkstraShortestPathSolver {
    return new DijkstraShortestPathSolver(
      this.adjacencyList.map((a) => a.slice(0)),
    );
  }

  /**
   * The number of nodes in the graph. Nodes are numbered from `0` to `n-1`.
   */
  protected get nodes(): number {
    return this.adjacencyList.length;
  }

  /**
   * Add a new node to the graph.
   *
   * The typical use case for this is when you have a static graph and you need to add a small number
   * of additional nodes and edges prior to each compute. You would clone the solver, add your variable
   * nodes and edges, and then solve, saving you the time of having to recreate the whole graph from
   * scratch each time.
   *
   * @returns The index of the new node.
   *
   * @see {@link DijkstraShortestPathSolver.clone}
   */
  addNode(): number {
    this.adjacencyList.push(new Array(0));
    return this.nodes - 1;
  }

  /**
   * Add an edge (in one direction).
   * @param fromNode Starting node.
   * @param toNode Ending node.
   * @param weight Weight of the edge. Must be greater than 0.
   */
  addEdge(fromNode: number, toNode: number, weight: number): void {
    if (weight < 0) {
      throw new RangeError("weight must be >= 0");
    }

    if (fromNode < 0 || fromNode >= this.nodes) {
      throw new RangeError(
        `fromNode must be in range 0..${this.nodes - 1}: ${fromNode}`,
      );
    }

    if (toNode < 0 || toNode >= this.nodes) {
      throw new RangeError(
        `toNode must be in range 0..${this.nodes - 1}: ${toNode}`,
      );
    }

    this.adjacencyList[fromNode].push({ toNode, weight });
  }

  /**
   * Add an edge in both directions.
   * @param fromNode Starting node.
   * @param toNode Ending node.
   * @param weight Weight of the edge. Must be greater than 0.
   */
  addBidirEdge(fromNode: number, toNode: number, weight: number): void {
    if (weight < 0) {
      throw new RangeError("weight must be >= 0");
    }

    if (fromNode < 0 || fromNode >= this.nodes) {
      throw new RangeError(
        `fromNode must be in range 0..${this.nodes - 1}: ${fromNode}`,
      );
    }

    if (toNode < 0 || toNode >= this.nodes) {
      throw new RangeError(
        `toNode must be in range 0..${this.nodes - 1}: ${toNode}`,
      );
    }

    this.adjacencyList[fromNode].push({ toNode, weight });
    this.adjacencyList[toNode].push({ toNode: fromNode, weight });
  }

  // TODO: Not ready for general consumption.
  // setEdges(node: number, edges: IEdge[]): void {
  //   this.adjacencyList[node] = edges;
  // }

  /**
   * Calculate shortest paths for all nodes for the given start node.
   * @param startNode The start node.
   */
  calculateFor(startNode: number): ShortestPaths {
    if (startNode < 0 || startNode >= this.nodes) {
      throw new RangeError(
        `startNode must be in range 0..${this.nodes - 1}: ${startNode}`,
      );
    }

    const weights: number[] = new Array(this.nodes).fill(Infinity);
    weights[startNode] = 0;

    const pq = new TinyQueue<IPath>(
      [{ toNode: startNode, weight: 0 }],
      (a, b) => a.weight - b.weight,
    );

    const backtrace: number[] = new Array(this.nodes).fill(-1);

    while (pq.length !== 0) {
      const shortestStep = pq.pop();

      const currentNode: number = shortestStep!.toNode;

      for (const neighbor of this.adjacencyList[currentNode]) {
        const weight = weights[currentNode] + neighbor.weight;
        const toNode = neighbor.toNode;
        if (weight < weights[toNode]) {
          weights[toNode] = weight;
          backtrace[toNode] = currentNode;
          pq.push({ toNode, weight });
        }
      }
    }

    return new ShortestPaths(this.nodes, startNode, backtrace, weights);
  }
}

/**
 * Shortest paths result.
 */
export class ShortestPaths {
  constructor(
    public readonly nodes: number,
    public readonly startNode: number,
    private readonly backtrace: number[],
    private readonly weights: number[],
  ) {}

  /**
   * Find the shortest path to the given end node.
   * @param endNode The end node.
   * @throws {@link Error} No path found.
   */
  shortestPathTo(endNode: number): number[] {
    if (endNode < 0 || endNode >= this.nodes) {
      throw new RangeError(
        `end-node must be in range 0 to ${this.nodes - 1}: ${endNode}`,
      );
    }

    const path = [endNode];
    let lastStep = endNode;

    while (lastStep != this.startNode) {
      path.unshift(this.backtrace[lastStep]);
      lastStep = this.backtrace[lastStep];
      if (lastStep === undefined) {
        throw new Error(`no path from ${this.startNode} to ${endNode}`);
      }
    }

    return path;
  }

  /**
   * Total weight of the path from the start node to the given end node.
   * @param endNode The end node.
   */
  weightOfPathTo(endNode: number): number {
    if (endNode < 0 || endNode >= this.nodes) {
      throw new RangeError(
        `end-node must be in range 0 to ${this.nodes - 1}: ${endNode}`,
      );
    }

    return this.weights[endNode];
  }
}
