import mongoose, { Schema, Document } from 'mongoose';

import { Team } from '@shared/enums/teams';

interface Instruction extends Document {
  team: Team;
  round: number;
  content: any; // Use 'any' for flexible schema
  updatedAt: Date;
}

const InstructionSchema: Schema = new Schema({
  team: { type: String, required: true },
  round: { type: Number, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export const Instruction = mongoose.model<Instruction>('Instruction', InstructionSchema);
