import React from "react"
import Dropdown from "../Dropdown/Dropdown"
import { MapName } from "../../../../../shared/enums/maps"
import { Team } from "../../../../../shared/enums/teams"


export type PlanPickerProps = {
    
}
export const PlanPicker = () => {
    const [map, setMap] = React.useState<MapName>(MapName.Mirage);
    const [team, setTeam] = React.useState<Team>(Team.T);
    
    return (
        <div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                <Dropdown choices={Object.keys(MapName)} selected={map} onSelect={setMap} />
                <Dropdown choices={Object.keys(Team)} selected={team} onSelect={setTeam} />
            </div>
        </div>
    )
}