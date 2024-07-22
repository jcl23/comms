import { UtilThrow } from "../../shared/enums/utility"
import { queryCallout } from "../../shared/util/queryCallout";
import { UtilThrowModel } from "../models/throws";

const getLocationNames = function(throwData: UtilThrow): Record<string, string> {
    // ignore the current callout name and overwrite
    // find the location name
    let throwPositionCallout, activePositionCallout;
    for (let i = 0; i < 5; i++) {
        const tol = i * 10;
        throwPositionCallout = queryCallout(throwData.map, throwData.throwPosition, tol, true);
        if (throwPositionCallout != "") break;
    }
    for (let i = 0; i < 5; i++) {
        const tol = i * 10;
        activePositionCallout = queryCallout(throwData.map, throwData.activePosition, tol, true);
        if (throwPositionCallout != "") break;
    }
   
    return { throwPositionCallout, activePositionCallout };
}

export const updateLocationNames = async function(success = console.log, error = console.error) {

    const announceSave = async (doc) => {
        try {
            await doc.save();
        } catch (e) {
            console.log(`Error saving ${doc._id}: ${e}`);
        }
    }
    // get those docs that are missing either of the names,
    // add them, and save
    try {
        const utilThrowDocs = await UtilThrowModel.find({
            // $or: [
            //     { throwPositionCallout: { $exists: false } },
            //     { activePositionCallout: { $exists: false } },
            //     { throwPositionCallout: null },
            //     { activePositionCallout: null },
            //     { throwPositionCallout: "" },
            //     { activePositionCallout: "" }
            // ]
        });
        console.log(`Found ${utilThrowDocs.length} to update names for.`); 
        
        utilThrowDocs.forEach(doc => {
            // temporary while we don't have calls for dust2:
            if (doc.map == "Dust 2") return;
            const { throwPositionCallout, activePositionCallout} = getLocationNames(doc);
            if (throwPositionCallout != "") {
                console.log(`Updating ${doc.lineup} with ${throwPositionCallout}`)
                doc.throwPositionCallout = throwPositionCallout;
            }
            if (activePositionCallout != "") {
                console.log(`Updating ${doc.lineup} lands at ${throwPositionCallout}`)
                doc.activePositionCallout = activePositionCallout;
            }
        });
        await Promise.allSettled(utilThrowDocs.map(announceSave));
        console.log("Success: Updated location names for all utility throws.")
        success(`Updated ${utilThrowDocs.length} locations`);
    } catch (e) {
        error(e);
    }
}