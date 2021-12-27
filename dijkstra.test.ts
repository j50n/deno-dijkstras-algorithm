import { DijkstraShortestPathSolver } from "./dijkstra.ts";
import { assertEquals } from "./deps.ts";

const FULLSTACK = 0;
const DIGINN = 1;
const DUBLINER = 2;
const STARBUCKS = 3;
const CAFEGRUMPY = 4;
const INSOMNIACOOKIES = 5;

const cafes = DijkstraShortestPathSolver.init(6);

cafes.addBidirEdge(DIGINN, FULLSTACK, 7);
cafes.addBidirEdge(FULLSTACK, STARBUCKS, 6);
cafes.addBidirEdge(DIGINN, DUBLINER, 4);
cafes.addBidirEdge(FULLSTACK, DUBLINER, 2);
cafes.addBidirEdge(DUBLINER, STARBUCKS, 3);
cafes.addBidirEdge(DIGINN, CAFEGRUMPY, 9);
cafes.addBidirEdge(CAFEGRUMPY, INSOMNIACOOKIES, 5);
cafes.addBidirEdge(DUBLINER, INSOMNIACOOKIES, 7);
cafes.addBidirEdge(STARBUCKS, INSOMNIACOOKIES, 6);

Deno.test("demonstrate finding shortest path", () => {
  const path = cafes.calculateFor(FULLSTACK).shortestPathTo(CAFEGRUMPY);
  assertEquals(
    path,
    [FULLSTACK, DUBLINER, INSOMNIACOOKIES, CAFEGRUMPY],
    "shortest path from FULLSTACK to CAFEGRUMPY",
  );
});

Deno.test("demonstrate finding the weight of the shortest path", () => {
  assertEquals(
    cafes.calculateFor(FULLSTACK).weights[CAFEGRUMPY],
    14,
    "weight of the shortest path",
  );
});
