import { MapName } from "./maps";
import { Team } from "./teams";

export enum Utility {
    Smoke = "Smoke",
    Flash = "Flash",
    Molotov = "Molotov",
    HE = "HE",
    Decoy = "Decoy",
};

export enum Speed {
    Run = "Run",
    Walk = "Walk",
    Stand = "Stand",
};

export enum ThrowType {
    Left = "Left",
    Middle = "Middle",
    Right = "Right",
}


export enum StrafeType {
    Left = "Left",
    Right = "Right",
    None = "None",
}


export const isUtility = (arg: any): arg is Utility => (
    Object.values(Utility).includes(arg)
);

export const isSpeed = (arg: any): arg is Speed => (
    Object.values(Speed).includes(arg)
);

export const isThrowType = (arg: any): arg is ThrowType => (
    Object.values(ThrowType).includes(arg)
);


export const isStrafeType = (arg: any): arg is StrafeType => (
    Object.values(StrafeType).includes(arg)
);




export type UtilThrow = {
    map: MapName;
    team: Team;
    utility: Utility; // which thing is being thrown?
    activeIconPosition?: [number, number];
    activePosition: [number,  number]; // where does it pop/land?
    activePositionCallout?: string; 
    throwPosition: [number, number, number]; // where is it thrown from?
    throwPositionCallout?: string;
    throwAngle: [number, number, number]; // what angle is it thrown at?
    speed: Speed; // Run, Walk, Stand
    strafe: StrafeType; // Left, Right, None
    doJump: boolean;
    doCrouch: boolean;
    throwType: ThrowType; // Left, Middle, Right

    video: string; 
    lineup: string;
    
    content?: any; // Use 'any' for flexible schema
    updatedAt?: Date;
    _id?: string;
}

export const REQUIRED_THROW_PROPS = ["map", "team", "utility", "throwPosition", "throwAngle", "strafe", "speed", "doJump", "doCrouch", "throwType", "activePosition"];