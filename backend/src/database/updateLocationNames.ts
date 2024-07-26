// updateLocationNames.ts
// Updates the location names for each callout, by searching shared/data/calloutBoxes 
// for the closest callout name to the throw position and active position.

import { UtilThrow } from "@shared/enums/utility"
import { queryCallout } from "@shared/util/queryCallout";
import { UtilThrowModel } from "../models/throws";

const getLocationNames = function(throwData: UtilThrow): Record<string, string> {
    // ignore the current callout name and overwrite
    // find the location name
    const { map, throwPosition, activePosition } = throwData;

    const throwPositionCallout = queryCallout(map, [...throwPosition]);
    const activePositionCallout = queryCallout(map, [...activePosition]);
   
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
            if (doc.lineup.includes("9QreZ6rRWh")) {
                let k = 1;
            }
            const { throwPositionCallout, activePositionCallout} = getLocationNames(doc);
            if (throwPositionCallout != "") {
                console.log(`Updating ${doc.lineup} with ${throwPositionCallout}`)
                doc.throwPositionCallout = throwPositionCallout;
            }
            if (activePositionCallout != "") {
                console.log(`Updating ${doc.lineup} lands at ${activePositionCallout}`)
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