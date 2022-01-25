# Dijkstra's Shortest Path Algorithm

A fast and memory-efficient implementation of Dijkstra's shortest-path algorithm
for Deno.

If you ever run into a problem that can be represented as a graph where the
solution has something to do with finding the shortest path between nodes, this
algorithm is nothing short of magical. It is well worth the time to learn how to
use it, even if you don't really understand how the algorithm works.

This implementation of Dijkstra'a algorithm is able to process large in-memory
graphs. It will perform reasonably well even when the number of edges is in the
millions. The performance is `O(n*log(n))`, where `n` is proportional to the
number of nodes plus the number of edges in the graph.

This code was adapted to Typescript from
[A Walkthrough of Dijkstra's Algorithm (In JavaScript!)](https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026)
on Medium. This implemetation was originally part of
[BlackholeSuns](https://github.com/j50n/blackholesuns), an open source project
that allowed thousands of No Man's Sky players to navigate the galaxy using
mapped black holes. This version is cleaned up a bit and includes a few bug
fixes and more tests than the original. See also
[Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) on
Wikipedia.

# Documentation

```sh
deno doc --reload https://deno.land/x/dijkstras_algorithm/dijkstra.ts
```

# Run Tests

```sh
deno test --reload
```

# Usage Hints

Dijkstra's algorithm actually calculates the shortest paths from the start node
to every other node in the graph. In other words, it isn't just calculating one
path at a time. This can let you cheaply do things like find the 20 closest
nodes from a particular node in the graph, for example.

You can reverse the direction of the calculation. Calling it "start node" is
just a convention. It can also be an end node if you set up the graph correctly.

This implementation supports cloning the solver and extending its graph
dynamically. Graph generation can be expensive. For many cases, most of the
graph can be reused, with a only a small portion needing to be dynamic.

# Example

This example recreates the example from the article referenced earlier. The
nodes are mapped to integers from `0` to `n-1`. The names and weights are taken
from
[A Walkthrough of Dijkstra's Algorithm (In JavaScript!)](https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026).

![Example Graph](https://miro.medium.com/max/2400/1*lTVbpbmx3OWbKSWLp7M3ug.jpeg)

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
  cafes.calculateFor(FULLSTACK).weightOfPathTo(CAFEGRUMPY),
  14,
);
```
