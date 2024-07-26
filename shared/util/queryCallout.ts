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
type CalloutData = [MapName, number, number, number, number, number, number];
export const testMembership = (point: Triple | Pair, callout: CalloutData, tol=0) : boolean => {
    let [name, minX, minY, minZ, maxX, maxY, maxZ] = callout;
    const [x, y, z] = point;
    const searchPlane = (z === undefined);
    return (
        x >= (minX - tol) && x <= (maxX + tol) &&
        y >= (minY - tol) && y <= (maxY + tol) &&
        (searchPlane || (z >= (minZ - tol) && z <= (maxZ + tol)))
    ) 
    
}
export const queryCallout = (map: MapName, point: Triple | Pair, tol = 0) : string => {
    // bc a lot of the positions have 0 for y we just search on x and z when searchPlane is true
    let [x, y, z] = point;
    

    const calloutList = calloutBoxes[map] as CalloutData[];
    // if calloutList not array, throw the name of the map
    if (!Array.isArray(calloutList)) {
        throw new Error(`Map "${map}" does not have a callout list.`);
    }
    
    for (let callout of calloutList) {
        if (testMembership(point, callout, tol)) {
            console.log(`Found callout ${callout[0]} for point ${point}`);
            return callout[0];
        }
    }
    return "";
}

export const testCallout = (point: Triple | Pair, map: MapName, calloutName: string, tol=0) : boolean => {
    const calloutList = (calloutBoxes as any) as Record<MapName, CalloutData[]>;

    const calloutPieces = calloutList[map].filter((callout) => callout[0] === calloutName);
    if (calloutPieces.length === 0) {
        return false;
    }
    return calloutPieces.some((callout) => testMembership(point, callout, tol));
}