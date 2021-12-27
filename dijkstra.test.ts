import { DijkstraShortestPathSolver } from "./dijkstra.ts";
import { assertEquals, assertThrows } from "./deps.ts";

Deno.test("graph contains at least 2 nodes", () => {
  assertThrows(() => DijkstraShortestPathSolver.init(1), RangeError);
});

Deno.test("throws if no path found", () => {
  const solver = DijkstraShortestPathSolver.init(2);
  const shortestPath = solver.calculateFor(0);
  assertThrows(() => shortestPath.shortestPathTo(1), Error);
});

Deno.test("some paths are valid, others are not", () => {
  const solver = DijkstraShortestPathSolver.init(3);
  solver.addEdge(0, 2, 42);

  const shortestPath = solver.calculateFor(0);
  assertThrows(() => shortestPath.shortestPathTo(1), Error);
  assertEquals(shortestPath.shortestPathTo(2), [0, 2]);
  assertEquals(shortestPath.totalWeight(2), 42);
});

Deno.test("finds shortest path between two nodes", () => {
  const solver = DijkstraShortestPathSolver.init(2);
  solver.addEdge(0, 1, 1);

  const shortestPath = solver.calculateFor(0);
  assertEquals(shortestPath.shortestPathTo(1), [0, 1]);
  assertEquals(shortestPath.totalWeight(1), 1);
});
