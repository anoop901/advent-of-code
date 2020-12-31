export default interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export function coordinatesToString(coordinates: Coordinates): string {
  const { x, y, z } = coordinates;
  return [x, y, z].join(",");
}

export function coordinatesFromString(coordinatesString: string): Coordinates {
  const componentStrings = coordinatesString.split(",");
  if (componentStrings.length !== 3) {
    throw new Error("invalid coordinates string");
  }
  const [xString, yString, zString] = componentStrings;
  const x = Number(xString);
  const y = Number(yString);
  const z = Number(zString);
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    throw new Error("invalid coordinates string");
  }
  return { x, y, z };
}
