import chain from "./chain";

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

export function countMatching<T>(pred: (value: T) => boolean) {
  return function (iterable: Iterable<T>): number {
    return chain(iterable).then(filter(pred)).then(length).end();
  };
}

export function* allIntegersStartingAt(start = 0): Generator<number> {
  for (let n = start; true; n++) {
    yield n;
  }
}

export function findFirstMatching<T>(pred: (arg: T) => boolean) {
  return (iterable: Iterable<T>): T | null => {
    for (const value of iterable) {
      if (pred(value)) {
        return value;
      }
    }
    return null;
  };
}

export function map<T, U>(fn: (arg: T) => U) {
  return function* (iterable: Iterable<T>): Generator<U> {
    for (const t of iterable) {
      yield fn(t);
    }
  };
}

export function takeWhile<T>(pred: (arg: T) => boolean) {
  return function* (iterable: Iterable<T>): Generator<T> {
    for (const t of iterable) {
      if (!pred(t)) {
        break;
      }
      yield t;
    }
  };
}

export function filter<T>(pred: (arg: T) => boolean) {
  return function* (iterable: Iterable<T>): Generator<T> {
    for (const t of iterable) {
      if (pred(t)) {
        yield t;
      }
    }
  };
}

export function* filterNonNullish<T>(
  iterable: Iterable<T | null | undefined>
): Generator<T> {
  for (const t of iterable) {
    if (t != null) {
      yield t;
    }
  }
}

export function length<T>(iterable: Iterable<T>): number {
  let result = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of iterable) {
    result++;
  }
  return result;
}

export function fold<A, T>(initial: A, fn: (acc: A, x: T) => A) {
  return (iterable: Iterable<T>): A => {
    let result = initial;
    for (const t of iterable) {
      result = fn(result, t);
    }
    return result;
  };
}

export const sum = fold(0, (acc, x: number) => acc + x);

export function* zip<T, U>(
  firstIterable: Iterable<T>,
  secondIterable: Iterable<U>
): Generator<{ first: T; second: U }> {
  const firstIterator = firstIterable[Symbol.iterator]();
  const secondIterator = secondIterable[Symbol.iterator]();
  while (true) {
    const { done: firstDone, value: first } = firstIterator.next();
    const { done: secondDone, value: second } = secondIterator.next();
    if (!firstDone && !secondDone) {
      yield { first, second };
    } else {
      break;
    }
  }
}

export function enumerate<T>(
  iterable: Iterable<T>
): Iterable<{ index: number; value: T }> {
  return chain(zip(iterable, allIntegersStartingAt()))
    .then(map(({ first, second }) => ({ index: second, value: first })))
    .end();
}

export function slice<T>(start: number, end: number | null = null) {
  return (iterable: Iterable<T>): Iterable<T> =>
    chain(iterable)
      .then(enumerate)
      .then(filter(({ index }) => index >= start))
      .then(takeWhile(({ index }) => end == null || index < end))
      .then(map(({ value }) => value))
      .end();
}

export function pairs<T>(offset = 1) {
  return (iterable: Iterable<T>): Iterable<{ first: T; second: T }> =>
    chain(zip(iterable, slice<T>(offset)(iterable))).end();
}

export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable);
}

export function reduce<T>(fn: (a: T, b: T) => T) {
  return (iterable: Iterable<T>): T => {
    const iterator = iterable[Symbol.iterator]();
    const firstIteratorResult = iterator.next();
    if (firstIteratorResult.done) {
      throw new Error("cannot reduce empty iterable");
    }

    let result = firstIteratorResult.value;
    let { value, done } = iterator.next();
    while (!done) {
      result = fn(result, value);
      ({ value, done } = iterator.next());
    }
    return result;
  };
}

export function minBy<T, U>(fn: (arg: T) => U): (iterable: Iterable<T>) => T {
  return reduce<T>((a, b) => (fn(b) < fn(a) ? b : a));
}

export function maxBy<T, U>(fn: (arg: T) => U): (iterable: Iterable<T>) => T {
  return reduce<T>((a, b) => (fn(b) > fn(a) ? b : a));
}

export const min = minBy((x) => x);
export const max = maxBy((x) => x);

export function map_filter<T, U>(fn: (arg: T) => U | null | undefined) {
  return function* (iterable: Iterable<T>): Iterable<U> {
    for (const t of iterable) {
      const u = fn(t);
      if (u) {
        yield u;
      }
    }
  };
}
