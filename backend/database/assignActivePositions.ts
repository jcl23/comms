// Since we start just from the 2d map values (in the unit square), and we have
// the real values of the "throw positions", we can estimate the positions of 
// the active values (where the grenade pops) by calculating a transformation matrix.

import { MapName } from "../../shared/enums/maps";
import { computeTransformationMatrix, transformPoint } from "../../shared/util/regression";
import { UtilThrowModel } from "../models/throws";
import iconToPosition from "../../util/data/iconToPositions.json";
export const activePositionToMapPosition = async function() {
    // for every single throw, move the current thing in the active position to active icon position.
    const throws = await UtilThrowModel.find({});
    
    for (const throwData of throws) {
        if (!throwData.activeIconPosition) continue;
        const matrix = iconToPosition[throwData.map];
        const [x,  y] = throwData.activeIconPosition;
        throwData.activePosition = transformPoint(x, y, matrix);
        await throwData.save();
    }
}
export const assignActivePositions = async function() {
    // for each map, calculate the transformation matrix
    // for each throw, calculate the active position
    const throws = await UtilThrowModel.find({});
    
    for (const throwData of throws) {
        if (!throwData.activeIconPosition) continue;
        const matrix = iconToPosition[throwData.map];
        const [x,  y] = throwData.activeIconPosition;
        throwData.activePosition = transformPoint(x, y, matrix);
        await throwData.save();
    }
}