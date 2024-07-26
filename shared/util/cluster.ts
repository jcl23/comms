import { UtilThrow } from "../enums/utility";


// Instead of checking each throw against all others we can at least
// reduce to checking the ones in the same callout area

const equalPosition = (pos1: number[], pos2: number[], tol = 5) => {
    if (pos1.length !== pos2.length) {
        return false;
    }
    const dists = pos1.map((el, i) => Math.abs(el - pos2[i]));
    return Math.hypot(...dists) < tol;
}

type LocationList= {
    location: number[],
    throws: UtilThrow[],
}[];

export function throwsByActivePosition(throws: UtilThrow[]): LocationList {
    const dict: Record<string, UtilThrow[]> = {};
    throws.forEach(throwData => {
        let { activePositionCallout } = throwData;
        activePositionCallout ??= "Unknown";
        dict[activePositionCallout] ??= [];
        dict[activePositionCallout].push(throwData);
    });
    console.log({dict});
    const allLocations: LocationList = [];
    for (let [key, value] of Object.entries(dict)) {
        const locations: LocationList = [];
        // cluster throws by active position
        value.forEach(throwData => {
            const { activePosition } = throwData;
            const existing = locations.find(loc => equalPosition(loc.location, activePosition));
            if (existing) {
                existing.throws.push(throwData);
            } else {
                locations.push({
                    location: activePosition,
                    throws: [throwData],
                });
            }
        });
        allLocations.push(...locations);
    }
    return allLocations;
}

export function throwsByThrowPosition(throws: UtilThrow[]): LocationList {
    const dict: Record<string, UtilThrow[]> = {};
    throws.forEach(throwData => {
        let { throwPositionCallout } = throwData;
        throwPositionCallout ??= "Unknown";
        dict[throwPositionCallout] ??= [];
        dict[throwPositionCallout].push(throwData);
    });
    const allLocations: LocationList = [];
    for (let [key, value] of Object.entries(dict)) {
        const locations: LocationList = [];
        // cluster throws by active position
        value.forEach(throwData => {
            const { throwPosition } = throwData;
            const existing = locations.find(loc => equalPosition(loc.location, throwPosition));
            if (existing) {
                existing.throws.push(throwData);
            } else {
                locations.push({
                    location: throwPosition,
                    throws: [throwData],
                });
            }
        });
    }
    return allLocations;
}