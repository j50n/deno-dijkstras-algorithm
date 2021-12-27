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
 * Adapted from https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026
 * This has been made much faster by treating nodes as an index rather than a string (name). We use `tinyqueue`
 * as our priority queue. All map-likes have been eliminated, but there are still object references. So this is
 * not as fast as possible, but it should be plenty fast and not too heavy on memory.
 */
export class DijkstraShortestPathSolver {
  private constructor(
    public readonly nodes: number,
    public readonly adjacencyList: IEdge[][],
  ) {
  }

  /**
   * Initialize a new empty solver with the number of nodes needed.
   * @param nodes The number of nodes in the graph.
   * @returns A new solver.
   */
  static init(nodes: number): DijkstraShortestPathSolver {
    return new DijkstraShortestPathSolver(
      nodes,
      new Array(nodes).fill(null).map((_v) => new Array(0)),
    );
  }

  /**
   * A clone of this solver.
   * @returns A cloned solver.
   */
  clone(): DijkstraShortestPathSolver {
    return new DijkstraShortestPathSolver(
      this.nodes,
      this.adjacencyList.map((a) => a.slice(0)),
    );
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

  setEdges(node: number, edges: IEdge[]): void {
    this.adjacencyList[node] = edges;
  }

  /**
   * Calculate shortest paths for all nodes for the given start node.
   * @param startNode The start node.
   */
  calculateFor(startNode: number): ShortestPaths {
    const weights: number[] = new Array(this.nodes).fill(Infinity);
    weights[startNode] = 0;

    const pq = new TinyQueue<IPath>(
      [{ toNode: startNode, weight: 0 }],
      (a, b) => a.weight - b.weight,
    );

    const backtrace: number[] = new Array(this.nodes).fill(-1);

    while (pq.length !== 0) {
      const shortestStep = pq.pop();
      if (shortestStep === undefined) {
        throw new Error("shortest-step undefined");
      }
      const currentNode = shortestStep.toNode;

      this.adjacencyList[currentNode].forEach((neighbor) => {
        const weight = weights[currentNode] + neighbor.weight;

        if (weight < weights[neighbor.toNode]) {
          weights[neighbor.toNode] = weight;
          backtrace[neighbor.toNode] = currentNode;
          pq.push({ toNode: neighbor.toNode, weight: weight });
        }
      });
    }

    return new ShortestPaths(startNode, backtrace, weights);
  }
}

/**
 * Shortest paths result.
 */
export class ShortestPaths {
  constructor(
    public readonly startNode: number,
    public readonly backtrace: number[],
    public readonly weights: number[],
  ) {}

  /**
   * Find the shortest path to the given end node.
   * @param endNode The end node.
   */
  shortestPathTo(endNode: number): number[] {
    const path = [endNode];
    let lastStep = endNode;

    while (lastStep != this.startNode) {
      path.unshift(this.backtrace[lastStep]);
      lastStep = this.backtrace[lastStep];
    }

    return path;
  }

  /**
   * Total weight of the path from the start node to the given end node.
   * @param endNode The end node.
   */
  totalWeight(endNode: number): number {
    return this.weights[endNode];
  }
}
