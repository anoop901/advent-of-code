class Pipeline<T, R> {
  constructor(private readonly fn: (arg: T) => R) {}
  then<S>(nextFn: (arg: R) => S): Pipeline<T, S> {
    return new Pipeline((arg) => nextFn(this.fn(arg)));
  }
  run(value: T): R {
    return this.fn(value);
  }
}

export function buildPipeline<T, R>(fn: (arg: T) => R): Pipeline<T, R> {
  return new Pipeline(fn);
}

export function runPipeline<T, R>(value: T, pipeline: Pipeline<T, R>): R {
  return pipeline.run(value);
}
