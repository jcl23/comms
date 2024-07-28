import { Pair, Triple } from "./position";
import { UtilThrow } from "./utility";


export type BombPlant = {
    site: "A" | "B";
}

export type Move = {
    from?: Pair | Triple;
    fromCallout: string;
    to?: Pair | Triple;
    toCallout: string;
    quiet: boolean;
}

export type Action = UtilThrow | BombPlant | Move;

export type AssignedAction = {
    action: Action;
    player: number[];
};

export type PlanStep = {
    action: AssignedAction;
    time: number;
}

export type Plan = {
    name: string;
    team: "T" | "CT";
    steps: PlanStep[];
}