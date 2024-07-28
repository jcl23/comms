import React from "react"
import Dropdown from "../Dropdown/Dropdown"
import { MapName } from "../../../../../shared/enums/maps"
import { Team } from "../../../../../shared/enums/teams"
import styles from "./PlanPicker.module.css"

export type PlanPickerProps = {
    
}
export const PlanPicker = () => {
    const [map, setMap] = React.useState<MapName>(MapName.Mirage);
    const [team, setTeam] = React.useState<Team>(Team.T);
    
    return (
        <div className={styles.pickerHeader}>
            <div>
                <Dropdown choices={Object.keys(MapName)} selected={map} onSelect={setMap} />
                <Dropdown choices={Object.keys(Team)} selected={team} onSelect={setTeam} />
            </div>
            <button>New</button>
        </div>
    )
}