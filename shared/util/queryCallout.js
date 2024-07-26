"use strict";
// queryCallout.ts
// Utility for finding the callout of a particular location on a map
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCallout = void 0;
const calloutBoxes_json_1 = __importDefault(require("../data/calloutBoxes.json"));
/**
 * Find the callout of a particular location on a map
 * @param map The map to search on
 * @param point The point to search for
 * @param tol The tolerance for the point to be within the box
 * @param searchPlane If true, only search on the x and z axis
 * @returns The callout name of the box that contains the point
 */
const queryCallout = (map, point, tol = 0) => {
    // bc a lot of the positions have 0 for y we just search on x and z when searchPlane is true
    let [x, y, z] = point;
    const searchPlane = (z === undefined)
    z = z || 0;
    const calloutList = calloutBoxes_json_1.default[map];
    // if calloutList not array, throw the name of the map
    if (!Array.isArray(calloutList)) {
        throw new Error(`Map "${map}" does not have a callout list.`);
    }
    console.log(`Searching for box with point ${x}, ${y}, ${z}`);
    for (let [name, minX, minY, minZ, maxX, maxY, maxZ] of calloutList) {
        if (x >= (minY - tol) && x <= (maxX + tol) &&
            y >= (minY - tol) && y <= (maxY + tol) &&
            ((z >= (minZ - tol) && z <= (maxZ + tol)) || searchPlane)) {
            return name;
        }
    }
    return "";
};
exports.queryCallout = queryCallout;
