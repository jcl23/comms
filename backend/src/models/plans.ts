import mongoose, { Schema, Document } from 'mongoose';
import {Utility, UtilThrow, StrafeType, isUtility, isSpeed, isStrafeType, isThrowType } from "@shared/enums/utility";
import { Action, BombPlant, Move, Plan, PlanStep } from "@shared/enums/plan";
import { isTeam, Team } from '@shared/enums/teams';
import { isValidPair, isValidTriple } from '@shared/enums/position';
import { MongoSchemaFor, MongoSchemaType } from '../util/types/mongoSchema';
import { isMap } from 'util/types';
import { isMapName } from '@shared/enums/maps';
import { UtilThrowSchema } from './throws';

/* Should represent all the data for a particular use of utility, including
    * the team(s) that can throw it, some are for both
    * the utility type (smoke, flash, etc)
    * the throw type (jump, run, etc)
    * throw type modifier (strafing)
    * throw position (x, y, z)
    * where the utility activates = active position (x, y, z)
*/

const plantSchemaObject: MongoSchemaFor<BombPlant> = {
    site: { type: mongoose.Schema.Types.String, required: true, validate: {
        validator: s => s === "A" || s === "B",
        message: ({value}) => `Site must be a valid site name. (${value})`,
    } },
};




const BombPlantSchema = new Schema({
    site: { type: String, enum: ['A', 'B'], required: true }
});

const MoveSchema = new Schema({
    from: { type: [Schema.Types.Number], required: false },
    fromCallout: { type: Schema.Types.String, required: true },
    to: { type: [Schema.Types.Number], required: false },
    toCallout: { type: Schema.Types.String, required: true },
    quiet: { type: Schema.Types.Boolean, required: true }
} as MongoSchemaFor<Move>);

const ActionSchema = new Schema({
    bombPlant: { type: BombPlantSchema, required: false, default: null },
    move: { type: MoveSchema, required: false, default: null },
    utilThrow: { type: Schema.Types.ObjectId, ref: 'UtilThrow', required: false, default: null }
});

const AssignedActionSchema = new Schema({
    action: { type: ActionSchema, required: true, validate: {
        validator: (a: Action) => {
            return (Number(a.plant) + Number(a.move) + Number(a.throw)) === 1;
        },
        message: ({value}) => `Action must be a valid action: keys (${Object.keys(value).join(', ')})`,
    } },
    player: { type: [Number], required: true }
});// My schema type is fucked for union types so I gave up using it here.

const PlanStepSchema = new Schema({
    time: { type: Number, required: true },
    action: { type: [AssignedActionSchema], required: true }
});

export const PlanSchema = new Schema({
    name: { type: String, required: true },
    steps: { type: [PlanStepSchema], required: true }
});

export const PlanModel = mongoose.model('Plan', PlanSchema);
