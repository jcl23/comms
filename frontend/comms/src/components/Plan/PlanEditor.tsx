import React from "react";

import { time } from "console";
import styles from "./PlanEditor.module.css";

import { UtilThrow } from "@shared/enums/utility.js";
import { PlanStep } from "@shared/enums/plan.js";

import MapSelector from "../MapSelector/MapSelector";
import Dropdown from "../Dropdown/Dropdown";
import { MapName } from "../../../../../shared/enums/maps";
import { Team } from "../../../../../shared/enums/teams";


export type PlanEditorProps = {
    plan: PlanStep[];
    setPlan: (plan: PlanStep[]) => void;
    player: number;
}

const PlanStepPanel = ({ action, time }: PlanStep) => {
    const actionText = (typeof action === "string") ? action : action.lineup;
    return <>
        <td>{time}</td>
        <td>{actionText}</td>
    </>
};

const DEFAULT_PLAN: PlanStep[] = [
    { action: "Test action", time: 0 },
]
export const PlanEditor = () => {


    const [plan, setPlan] = React.useState<PlanStep[]>(DEFAULT_PLAN);
    return (
        <div className={styles.planEditorOuter}>
            
            <div className={styles.planEditorContainer}>
                
                <table className={styles.planTable}>
                    {plan.map((step, i) => (
                        <tr key={i}  className={styles.planStepPanel}>
                            <PlanStepPanel {...step}/>
                        </tr>
                    ))}
                </table>
                <MapSelector mapName={"Mirage"} throwList={[]} setSelectedThrow={function (throwData: UtilThrow | null): void {
                    throw new Error("Function not implemented.");
                } } />
            </div>
        </div>
    );
}