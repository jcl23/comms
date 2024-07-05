

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
export interface UtilThrow {
  map: string;
  team: Team;
  utility: Utility;
  throw: ThrowType;
  throwPosition: [number, number, number];
  throwAngle: [number, number, number];
  strafe: StrafeType;
  activePosition: [number, number, number];
  content: any; // Use 'any' for flexible schema
  updatedAt?: Date;
  _id: string;
}

