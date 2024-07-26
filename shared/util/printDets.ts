// print the determinants of the matrices in iconToPositions.json and positionToIcon.json.

import { MapName } from "../enums/maps";

// matrices have six values, for a 2d transformations.
console.log("Determinants of iconToPosition.json");
import iconToPosition from "../data/iconToPositions.json";

for (const [map, matrix] of Object.entries(iconToPosition as Record<MapName, number[]>) ) {
    const det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
    console.log(`${map}: ${det}`);
}

console.log("Determinants of positionToIcon.json");
import positionToIcon from "../data/positionToIcon.json";

for (const [map, matrix] of Object.entries(positionToIcon as Record<MapName, number[]>) ) {
    const det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
    console.log(`${map}: ${det}`);
}
