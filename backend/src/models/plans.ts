import mongoose, { Schema, Document } from 'mongoose';
import {Utility, UtilThrow, StrafeType, isUtility, isSpeed, isStrafeType, isThrowType } from "@shared/enums/utility";
import { Plan } from "@shared/enums/plan";
import { isTeam, Team } from '@shared/enums/teams';
import { isValidPair, isValidTriple } from '@shared/enums/position';
import { MongoSchemaFor, MongoSchemaType } from '../util/types/mongoSchema';
import { isMap } from 'util/types';
import { isMapName } from '@shared/enums/maps';

/* Should represent all the data for a particular use of utility, including
    * the team(s) that can throw it, some are for both
    * the utility type (smoke, flash, etc)
    * the throw type (jump, run, etc)
    * throw type modifier (strafing)
    * throw position (x, y, z)
    * where the utility activates = active position (x, y, z)
*/

type PlanDocument = Plan & Document 
type UtilThrowDocument = UtilThrow & Document;

const schemaObject: MongoSchemaFor<UtilThrow> = {
    map: { type: mongoose.Schema.Types.String, required: true, validate: {
        validator: isMapName,
        message: ({value}) => `Map must be a valid map name. (${value})`,
    }},
    team: { type: mongoose.Schema.Types.String, required: true, validate: {
        validator: isTeam,
        message: ({value}) =>  `Team must be a valid team name (${value})`,
    } },
    utility: { type: mongoose.Schema.Types.String, required: true, validate: {
        validator: isUtility,
        message: ({value}) => `Utility must be a valid utility name. (${value})`,
    } },
    // speed, strafe, doJump, doCrouch. Things with "do" are booleans, otherwise, use our own validators
    speed: { type: mongoose.Schema.Types.String, required: true, validate: {
        validator: isSpeed,
        message: ({value}) => `Speed must be a valid speed name. (${value})`,
    } },
    strafe: { type: mongoose.Schema.Types.String, required: true, validate: {
        validator: isStrafeType,
        message: ({value}) => `Strafe type must be a valid strafe type name. (${value})`,
    } },
    doJump: { type: mongoose.Schema.Types.Boolean, required: true },
    doCrouch: { type: mongoose.Schema.Types.Boolean, required: true },
    throwType: { type: mongoose.Schema.Types.String, required: true, validate: {
        validator: isThrowType,
        message: ({value}) => `Throw type must be a valid throw type name. (${value})`,
    } },
    throwPosition: {
        type: [mongoose.Schema.Types.Number],
        required: true,
        validate: {
            validator: isValidTriple,
            message: ({value}) => `Throw position must be a 3 tuple of numbers. (${value})`,
        },
    },
    throwPositionCallout: { type: mongoose.Schema.Types.String, required: false },
    throwAngle: {
        type: [mongoose.Schema.Types.Number],
        required: true,
        validate: {
            validator: isValidTriple,
            message: ({value}) => `Throw angle must be a 3 tuple of numbers. (${value})`,
        },
    },
    activeIconPosition: {
        type: [mongoose.Schema.Types.Number],
        required: false,
        validate: {
            validator: isValidPair,
            message: ({value}) => `Active icon position must be a 3 tuple of numbers. (${value})`,
        },
    },
    activePosition: {
        type: [mongoose.Schema.Types.Number],
        required: true,
        validate: {
            validator: isValidPair,
            message: ({value}) => `Active position must be a pair of numbers. (${value})`,
        },
    },
    activePositionCallout: { type: mongoose.Schema.Types.String, required: false },
    video: { type: mongoose.Schema.Types.String, required: false },
    lineup: { type: mongoose.Schema.Types.String, required: false },

    updatedAt: { type: mongoose.Schema.Types.String, required: false },
};

export const UtilThrowSchema: Schema = new Schema<UtilThrowDocument>(schemaObject as any);
export const UtilThrowModel = mongoose.model<UtilThrow>('UtilThrow', UtilThrowSchema);
