import chain from "@anoop901/js-util/chain";
import allMatch from "@anoop901/js-util/iterables/allMatch";
import reduce from "@anoop901/js-util/iterables/reduce";
import drop from "@anoop901/js-util/iterables/drop";
import map from "@anoop901/js-util/iterables/map";
import filter from "@anoop901/js-util/iterables/filter";
import split from "@anoop901/js-util/iterables/split";
import toArray from "@anoop901/js-util/iterables/toArray";
import zip from "@anoop901/js-util/iterables/zip";
import loadInputLines from "../../util/loadInputLines";
import mapFilter from "@anoop901/js-util/iterables/mapFilter";

interface Tile {
  id: number;
  pixels: boolean[][];
}

async function loadInput(): Promise<Tile[]> {
  const lines = await loadInputLines();
  return chain(lines)
    .then(split(""))
    .then(
      map((tileLines) => {
        const headerLine = tileLines[0];
        const id = Number(headerLine.substring(5, headerLine.length - 1));
        const pixels = chain(tileLines)
          .then(drop(1))
          .then(map(map((c) => c === "#")))
          .then(map(toArray))
          .then(toArray)
          .end();
        return { id, pixels };
      })
    )
    .then(toArray)
    .end();
}

function edgesMatch(edge1: boolean[], edge2: boolean[]): boolean {
  return chain(zip(edge1, edge2))
    .then(allMatch(({ first, second }) => first === second))
    .end();
}

type EdgeSide = "top" | "bottom" | "left" | "right";

function getEdges(tile: Tile): Map<EdgeSide, boolean[]> {
  const topEdge = tile.pixels[0];
  const bottomEdgeReversed = tile.pixels[tile.pixels.length - 1];
  const leftEdgeReversed = chain(tile.pixels)
    .then(map((pixels) => pixels[0]))
    .then(toArray)
    .end();
  const rightEdge = chain(tile.pixels)
    .then(map((pixels) => pixels[pixels.length - 1]))
    .then(toArray)
    .end();
  return new Map<EdgeSide, boolean[]>([
    ["top", topEdge],
    ["right", rightEdge],
    ["bottom", bottomEdgeReversed.slice().reverse()],
    ["left", leftEdgeReversed.slice().reverse()],
  ]);
}

function* iterateTilePairs(
  tiles: Tile[]
): Generator<{ tile1: Tile; tile2: Tile }> {
  for (let i1 = 0; i1 < tiles.length; i1++) {
    for (let i2 = i1 + 1; i2 < tiles.length; i2++) {
      const tile1 = tiles[i1];
      const tile2 = tiles[i2];
      yield { tile1, tile2 };
    }
  }
}

function* iterateEdgePairsBetweenTiles(
  tile1: Tile,
  tile2: Tile
): Generator<{
  side1: EdgeSide;
  edge1: boolean[];
  side2: EdgeSide;
  edge2: boolean[];
}> {
  for (const [side1, edge1] of getEdges(tile1).entries()) {
    for (const [side2, edge2] of getEdges(tile2).entries()) {
      yield { side1, edge1, side2, edge2 };
    }
  }
}

(async () => {
  const tiles = await loadInput();

  const fitsByTileId = new Map<
    number,
    Map<EdgeSide, { tileId: number; side: EdgeSide }>
  >();

  for (const { tile1, tile2 } of iterateTilePairs(tiles)) {
    for (const { side1, edge1, side2, edge2 } of iterateEdgePairsBetweenTiles(
      tile1,
      tile2
    )) {
      if (
        edgesMatch(edge1, edge2) ||
        edgesMatch(edge1, edge2.slice().reverse())
      ) {
        fitsByTileId.set(
          tile1.id,
          (fitsByTileId.get(tile1.id) ?? new Map()).set(side1, {
            tileId: tile2,
            side: side2,
          })
        );
        fitsByTileId.set(
          tile2.id,
          (fitsByTileId.get(tile2.id) ?? new Map()).set(side2, {
            tileId: tile1,
            side: side1,
          })
        );
      }
    }
  }
  console.log(
    chain(fitsByTileId.entries())
      .then(filter(([tileId, fits]) => fits.size === 2))
      .then((entries) => new Map(entries))
      .end()
  );
  const potentialCornerTiles = chain(fitsByTileId.entries())
    .then(mapFilter(([tileId, fits]) => (fits.size === 2 ? tileId : null)))
    .then(toArray)
    .end();
  const part1Answer = chain(potentialCornerTiles)
    .then(reduce((a, b) => a * b))
    .end();
  console.log(part1Answer);
})();
