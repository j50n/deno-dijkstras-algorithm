# Dijkstra's Shortest Path Algorithm

A pretty good implementation of Dijkstra's shortest-path algorithm.

This code was adapted to Typescript/Deno from
[A Walkthrough of Dijkstra's Algorithm (In JavaScript!)](https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026)
on Medium. This code was originally part of
[BlackholeSuns](https://github.com/j50n/blackholesuns), an open source project
that allowed thousands of No Man's Sky players to navigate the galaxy using
mapped black holes. See also
[Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) on
Wikipedia.

# Example

This example recreates the example from the article referenced earlier. The
nodes are mapped to integers from `0` to `n-1`. The names and weights are taken
from the article.

```ts
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

assertEquals(
  cafes.calculateFor(FULLSTACK).shortestPathTo(CAFEGRUMPY),
  [FULLSTACK, DUBLINER, INSOMNIACOOKIES, CAFEGRUMPY],
);

assertEquals(
  cafes.calculateFor(FULLSTACK).weights[CAFEGRUMPY],
  14,
);
```
