import wu from "wu";

export function* splitIterable<T>(
  iterable: Iterable<T>,
  separator: T
): Iterable<T[]> {
  let currentChunk: T[] | null = null;
  for (const value of iterable) {
    if (value === separator) {
      if (currentChunk !== null) {
        yield currentChunk;
        currentChunk = null;
      }
    } else {
      if (currentChunk === null) {
        currentChunk = [];
      }
      currentChunk.push(value);
    }
  }
  if (currentChunk !== null) {
    yield currentChunk;
  }
}

export function countMatching<T>(
  iterable: Iterable<T>,
  predicate: (value: T) => boolean
) {
  return wu(iterable)
    .map(predicate)
    .reduce((count, value) => (value ? count + 1 : count), 0);
}
