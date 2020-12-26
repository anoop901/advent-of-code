class Chain<T> {
  constructor(private readonly value: T) {}
  then<U>(transformFn: (arg: T) => U): Chain<U> {
    return new Chain(transformFn(this.value));
  }
  end(): T {
    return this.value;
  }
}

export default function chain<T>(initialValue: T): Chain<T> {
  return new Chain(initialValue);
}
