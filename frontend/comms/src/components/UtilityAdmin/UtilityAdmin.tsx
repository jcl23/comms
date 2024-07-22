// a panel for modifying utility throws

import React, { useState, useEffect, useMemo } from "react";


import utilityData from "../../data/utility.json";
import Dropdown from "../Dropdown";
import { EditThrowEntry } from "../EditThrowEntry/EditThrowEntry";
import { Utility, UtilThrow } from "../../../../../shared/enums/utility";
import { MapName } from "../../../../../shared/enums/maps";
import { Team } from "../../../../../shared/enums/teams";


const { 
    teams: ALL_TEAMS, 
    maps: ALL_MAPS, 
    utility: ALL_UTILITY,
    throw_type: ALL_THROW_TYPES,
    strafe: ALL_STRAFE_OPTIONS,
} = utilityData;

const splitByProp = (prop: string, data: UtilThrow[]) => data.reduce((acc, throwData) => {
    if (acc[throwData[prop]]) {
        acc[throwData[prop]].push(throwData);
    } else {
        acc[throwData[prop]] = [throwData];
    }
    return acc;
}, {} as {[key: string]: UtilThrow[]});

const splitByProps = (props: string[], data: UtilThrow[]) : Object => {
    // form a tree, so that we can access items by (props.length) array accesses,
    // like tree[prop1][prop2][prop3]...[propN]
    const [prop, ...rest] = props;
    // use splitByProp
    const split = splitByProp(prop, data);
    split["All"] = data;
    // if there are more props, recurse
    if (rest.length > 0) {
        for (const key in split) {
            split[key] = splitByProps(rest, split[key]);
        }
    }
    return split;
}
const UtilityAdmin: React.FC = () => {

    const FILTER_PROPS = ["map", "utility", "team"];
    
    type PropFilterState = {
        map: MapName | "All", 
        utility: Utility | "All", 
        team: Team | "All"
    };

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
    
    //const [activeMap, setMap] = useState<MapName | "Any">(MapName.Mirage);
    //const [activeItem, setActiveItem] = useState<Utility | "Any">(Utility.Smoke);
    //const [activeTeam, setActiveTeam] = useState<Team>(Team.T);
 

    const [throws, setThrows] = useState<Record<any, any>>({});
    const [newThrow, setNewThrow] = useState<UtilThrow | null>(null);
    const [editing, setEditing] = useState<boolean>(false);

    const setThrowsByList = (list: UtilThrow[]) => {
        const data = splitByProps(FILTER_PROPS, list);
        console.log("New data throws object: ", data)
        setThrows(data);
    }
    useEffect(() => {
        const fetchThrows = async () => {
            try {
                const response = await fetch("/throws");
                const dataList = await response.json();
                console.log("Fetched from the throws endpoint: ", dataList);
                setThrowsByList(dataList);
            } catch (error) {
                console.error(error);
            }
        };
        fetchThrows();
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
        setEditing(true);
    };

    const handleSaveThrow = async () => {
        if (newThrow) {
            try {
                let method;
                if (newThrow._id == "") {
                    method = "POST";
                } else {
                    method = "PUT";
                }

                const response = await fetch("/throws", {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newThrow),
                });
                const data = await response.json();
                setThrowsByList(data);
                setEditing(false);
            } catch (error) {
                console.error(error);
            }
        }
    };
    return (
        <div>
            <div>
                <button onClick={handleAddThrow}>Add Throw</button>
                {/* Dropdown to pick from maps */}
                {
                    Object.entries(propFilterState).map(([prop, value]) => (
                        <Dropdown choices={availableValues[prop]} onSelect={(v) => setPropFilterState({...propFilterState, [prop]: v})} selected={value as string} />
                    ))
                }
            </div>
                <h2>Throws</h2>
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
                )
            )}
            </table>
            
        </div>
    );
};

export default UtilityAdmin;
