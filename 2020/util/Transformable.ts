class Transformable<T> {
  constructor(public readonly value: T) {}
  thenApply<U>(transformFn: (arg: T) => U): Transformable<U> {
    return new Transformable(transformFn(this.value));
  }
}

export function startWith<T>(initialValue: T): Transformable<T> {
  return new Transformable(initialValue);
}
