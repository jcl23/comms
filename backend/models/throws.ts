import mongoose, { Schema, Document } from 'mongoose';

export type Team = "T" | "CT";
export type Utility = "smoke" | "flash" | "molotov" | "he" | "incendiary" | "decoy";
export type ThrowType = "jump" | "run" | "walk" | "crouch" | "stand";
export type StrafeType = "left" | "right" | "none";

/* Should represent all the data for a particular use of utility, including
    * the team(s) that can throw it, some are for both
    * the utility type (smoke, flash, etc)
    * the throw type (jump, run, etc)
    * throw type modifier (strafing)
    * throw position (x, y, z)
    * where the utility activates = active position (x, y, z)
*/
interface UtilThrow extends Document {
    map: string;
    team: Team;
    utility: Utility;
    throw: ThrowType;
    throwPosition: [number, number, number];
    throwAngle: [number, number, number];
    activePosition: [number, number, number];
    strafe: StrafeType;
    content: any; // Use 'any' for flexible schema
    updatedAt: Date;
}

const UtilThrowSchema: Schema = new Schema({
    map: { type: String, required: true },
    team: { type: String, required: true },
    utility: { type: String, required: true },
    throw: { type: String, required: true },
    strafe: { type: String, required: true },
    throwPosition: {
        type: [Number],
        required: true,
        validate: {
            validator: (v: any) => v.length === 3, // Validate that array length is exactly 3
            message: 'Throw position must be a 3 tuple of numbers.',
        },
    },
    throwAngle: {
        type: [Number],
        required: true,
        validate: {
            validator: (v: any) => v.length === 3,
            message: 'Throw angle must be a 3 tuple of numbers.',
        },
    },
    activePosition: {
        type: [Number],
        required: true,
        validate: {
            validator: (v: any) => v.length === 3,
            message: 'Active position must be a 3 tuple of numbers.',
        },
    },
    updatedAt: { type: Date, default: Date.now }
});

export const UtilThrow = mongoose.model<UtilThrow>('UtilThrow', UtilThrowSchema);
