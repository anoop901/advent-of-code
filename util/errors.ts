export function assertNotNullish<T>(t: T | null | undefined): T {
  return t ?? throwError("unexpected nullish value");
}

export function throwError(message?: string): never {
  throw new Error(message);
}
