// For converting the map rotation (in radians) to degrees.
export function radToDeg(rad) {
  return (rad * 360) / (Math.PI * 2);
}

// For converting the heading (in degrees) to radians.
export function degToRad(deg) {
  return (deg * Math.PI * 2) / 360;
}

// Modulo for negative values
export function negMod(n) {
  return ((n % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

// Takes an ol LinestString as the trail, plus a heading in degrees, to calculate
// the rotation value in the format ol prefers.
export function calcRotation(previous, heading) {
  const rotation = degToRad(heading);
  const prevRotation = previous && previous[2];

  if (typeof prevRotation !== 'number') return rotation;

  // Force the rotation change to be less than 180°.
  let rotationDelta = rotation - negMod(prevRotation);
  if (Math.abs(rotationDelta) > Math.PI) {
    const sign = rotationDelta >= 0 ? 1 : -1;
    rotationDelta = -sign * (2 * Math.PI - Math.abs(rotationDelta));
  }
  return prevRotation + rotationDelta;
}
