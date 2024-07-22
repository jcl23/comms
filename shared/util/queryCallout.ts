// queryCallout.ts
// Utility for finding the callout of a particular location on a map


import { MapName } from "../enums/maps";
import { Pair, Triple } from "../enums/position";
import calloutBoxes from "../data/calloutBoxes.json";

/**
 * Find the callout of a particular location on a map
 * @param map The map to search on
 * @param point The point to search for
 * @param tol The tolerance for the point to be within the box
 * @param searchPlane If true, only search on the x and z axis
 * @returns The callout name of the box that contains the point
 */
export const queryCallout = (map: MapName, point: Triple | Pair, tol = 0, searchPlane = false) : string => {
    // bc a lot of the positions have 0 for y we just search on x and z when searchPlane is true
    let [x, y, z] = point;
    z = z || 0;
    const calloutList = calloutBoxes[map];
    // if calloutList not array, throw the name of the map
    if (!Array.isArray(calloutList)) {
        throw new Error(`Map "${map}" does not have a callout list.`);
    }
    console.log(`Searching for box with point ${x}, ${y}, ${z}`);
    for (let [name, minX, minY, minZ, maxX, maxY, maxZ] of calloutList) {
        if (
            x >= (minY - tol) && x <= (maxX + tol) &&
            y >= (minY - tol) && y <= (maxY + tol) &&
            ((z >= (minZ - tol) && z <= (maxZ + tol)) || searchPlane)
        ) {
            return name;
        }
    }
    return "";
}