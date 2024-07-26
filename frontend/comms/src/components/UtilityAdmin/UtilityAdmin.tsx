// a panel for modifying utility throws

import React, { useState, useEffect, useMemo } from "react";


import utilityData from "../../data/utility.json";
import Dropdown from "../Dropdown/Dropdown.tsx";
import { EditThrowEntry } from "../EditThrowEntry/EditThrowEntry";
import { Utility, UtilThrow } from "../../../../../shared/enums/utility.ts";
import { MapName } from "../../../../../shared/enums/maps.ts";
import { Team } from "../../../../../shared/enums/teams.ts";
import MapSelector from "../MapSelector/MapSelector";
import { fetchThrows } from "../../util/fetch.ts";
import { FocusedThrowData } from "./FocusedThrowData.tsx";
import { EditThrowModal } from "../EditThrowModal/EditThrowModal.tsx";
import { EditThrowButton } from "../EditThrowModal/EditThrowButton.tsx";
import { splitByProp, splitByProps  } from "../../util/split.ts";

type PropFilterState = {
    map: MapName | "All", 
    utility: Utility | "All", 
    team: Team | "All"
};
type ThrowsDictionary = Record<MapName, Record<Utility, Record<Team, UtilThrow[]>>>;

const { 
    teams: ALL_TEAMS, 
    maps: ALL_MAPS, 
    utility: ALL_UTILITY,
    throw_type: ALL_THROW_TYPES,
    strafe: ALL_STRAFE_OPTIONS,
} = utilityData;

const UtilityAdmin: React.FC = () => {

    const FILTER_PROPS = ["map", "utility", "team"];
    const availableValues = {
        map: [...Object.values(MapName), "All"],
        utility: [...Object.values(Utility), "All"],
        team: [...Object.values(Team), "All"],
    }
    const [propFilterState, setPropFilterState] = useState<PropFilterState>({
        map: MapName.Mirage,
        utility: Utility.Smoke,
        team: "All",
    });

    const [selectedThrow, setSelectedThrow] = useState<UtilThrow | null>(null);
    


    const [throws, setThrows] = useState<ThrowsDictionary>({});
    const [newThrow, setNewThrow] = useState<UtilThrow | null>(null);
    

    const setThrowsByList = (list: UtilThrow[]) => {
        const data = splitByProps(FILTER_PROPS, list);
        setThrows(data as ThrowsDictionary);
    }
    useEffect(() => {
        const fetchAndSet = async () => {
            const dataList = await fetchThrows();
            setThrowsByList(dataList);
        }
        fetchAndSet();
    }, []);

    const handleAddThrow = () => {
        setNewThrow({
            map: "Mirage",
            team: "T",
            utility: "smoke",
            throw: "jump",
            throwPosition: [0, 0, 0],
            throwAngle: [0, 0, 0],
            strafe: "none",
            activePosition: [0, 0, 0],
            content: {},
            updatedAt: new Date(),
            _id: "",
        });

    };

    


    const throwsList =((FILTER_PROPS.reduce((acc, prop) => acc?.[propFilterState[prop]] ?? [], throws)) as any) as UtilThrow[];
    return (
        <div style={{
            
        }}>
            
            <div style={{
                display: "flex", flexDirection: "row", justifyContent: "space-between"
            }}>

                <div style={{marginTop: "160px", width: "200px"}}>
                    {/* Dropdown to pick from maps */}
                    {
                        Object.entries(propFilterState).map(([prop, value]) => (
                            <Dropdown choices={availableValues[prop]} onSelect={(v) => setPropFilterState({...propFilterState, [prop]: v})} selected={value as string} />
                        ))
                    }
                </div>
                <div>
                <div style={{display: "flex", flexDirection: "row"}}>
                <FocusedThrowData throwData={selectedThrow} setSelectedThrow={setSelectedThrow}/>
                <EditThrowButton throwData={selectedThrow} setThrowData={setNewThrow} />
                </div>
                    <MapSelector mapName={propFilterState.map as MapName} throwList={throwsList} setSelectedThrow={setSelectedThrow}/>
                </div>
            </div>
            <div>
               
                <h2>Throws</h2>
                <button onClick={handleAddThrow}>Add Throw</button>
                <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Map</th>
                        <th>Team</th>
                        <th>Utility</th>
                        <th>Throw</th>
                        <th>Throw Position</th>
                        <th>Active Position</th>
                    </tr>
                </thead>
                {/* This is very contrived and im going to forget how this works very soon. Basically just sequentially navigate props and return an array if the particlar prop value isn't found*/}
                {((FILTER_PROPS.reduce((acc, prop) => acc?.[propFilterState[prop]] ?? [], throws))).map(throwData => (
                    <EditThrowEntry 
                    key={throwData._id}
                    throwData={throwData}
                    setThrowData={setNewThrow}
                    />
                ))}
                </table>
                
            </div>
            
        </div>
    );
};

export default UtilityAdmin;
