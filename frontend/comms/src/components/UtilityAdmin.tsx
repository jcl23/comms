// a panel for modifying utility throws

import React, { useState, useEffect } from "react";

import { UtilThrow } from "../models/throws";
import utilityData from "../data/utility.json";
import Dropdown from "./Dropdown";


const { 
    teams: ALL_TEAMS, 
    maps: ALL_MAPS, 
    utility: ALL_UTILITY,
    throw_type: ALL_THROW_TYPES,
    strafe: ALL_STRAFE_OPTIONS,
} = utilityData;

const UtilityAdmin: React.FC = () => {
    const [activeMap, setMap] = useState<string>("Mirage");
    const [throws, setThrows] = useState<UtilThrow[]>([]);
    const [newThrow, setNewThrow] = useState<UtilThrow | null>(null);
    const [editing, setEditing] = useState<boolean>(false);

    useEffect(() => {
        const fetchThrows = async () => {
            try {
                const response = await fetch("/throws");
                const data = await response.json();
                console.log("Fetched from the throws endpoint: ", data);
                setThrows(data);
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
                setThrows([...throws.filter(({_id}) => _id != data._id), data]);
                setEditing(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCancel = () => {
        setEditing(false);
    };

    useEffect(() => {
        console.log(throws)
        console.log("active map:", activeMap)
    }, [throws, activeMap])

    return (
        <div>
            <div>
                <button onClick={handleAddThrow}>Add Throw</button>
                {/* Dropdown to pick from maps */}
                <Dropdown choices={utilityData.maps} onSelect={setMap} />
            </div>
            {editing && (
                <div>
                    <h2>Add New Throw</h2>
                    <label>
                        Map:
                        <select
                            value={newThrow?.map}
                            onChange={(e) =>
                                setNewThrow({
                                    ...newThrow,
                                    team: e.target.value,
                                } as UtilThrow)
                            }
                        >
                            {ALL_MAPS.map((mapname) => (
                                <option key={mapname} value={mapname}>
                                    {mapname}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Team:
                        <select
                            value={newThrow?.team}
                            onChange={(e) =>
                                setNewThrow({
                                    ...newThrow,
                                    team: e.target.value as "T" | "CT",
                                } as UtilThrow)
                            }
                        >
                             {ALL_TEAMS.map((mapname) => (
                                <option key={mapname} value={mapname}>
                                    {mapname}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Utility:
                        <select
                            value={newThrow?.utility}
                            onChange={(e) =>
                                setNewThrow({
                                    ...newThrow,
                                    utility: e.target.value as
                                        | "smoke"
                                        | "flash"
                                        | "molotov"
                                        | "he"
                                        | "incendiary"
                                        | "decoy",
                                } as UtilThrow)
                            }
                        >
                            {ALL_UTILITY.map((mapname) => (
                                <option key={mapname} value={mapname}>
                                    {mapname}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Throw:
                        <select
                            value={newThrow?.throw}
                            onChange={(e) =>
                                setNewThrow({
                                    ...newThrow,
                                    throw: e.target.value as
                                        | "jump"
                                        | "run"
                                        | "walk"
                                        | "crouch"
                                        | "stand",
                                } as UtilThrow)
                            }
                        >
                            {ALL_THROW_TYPES.map((mapname) => (
                                <option key={mapname} value={mapname}>
                                    {mapname}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Strafe Options:
                        <select
                            value={newThrow?.strafe}
                            onChange={(e) =>
                                setNewThrow({
                                    ...newThrow,
                                    strafe: e.target.value as "left" | "right" | "none",
                                } as UtilThrow)
                            }
                        >
                            {ALL_STRAFE_OPTIONS.map((mapname) => (
                                <option key={mapname} value={mapname}>
                                    {mapname}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Throw Position:
                        <input
                            type="text"
                            value={newThrow?.throwPosition.join(",")}
                            onChange={(e) =>
                                setNewThrow({
                                    ...newThrow,
                                    throwPosition: e.target.value
                                        .split(",")
                                        .map((v) => parseInt(v)),
                                } as UtilThrow)
                            }
                        />
                    </label>
                    <label>
                        Active Position:
                        <input
                            type="text"
                            value={newThrow?.activePosition.join(",")}
                            onChange={(e) =>
                                setNewThrow({
                                    ...newThrow,
                                    activePosition: e.target.value
                                        .split(",")
                                        .map((v) => parseInt(v)),
                                } as UtilThrow)
                            }
                        />
                    </label>
                    <button onClick={handleSaveThrow}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
            <h2>Throws</h2>
            <table>
                {throws.filter(({map}) => map == activeMap).map((t) => (
                    <tr key={t._id}>
                        <td>
                            {t.team}
                        </td> 
                        
                        
                        
                        
                        
                        
                        <td>{t.utility.ca}</td>
                        <td>{t.throw}</td>
                        <td>{t.throwPosition.join(",")}</td>
                        <td>{t.activePosition.join(",")}</td>        
                         
                
                        <button onClick={() => {
                            setNewThrow(t);
                            setEditing(true);    
                        }}>Edit</button>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default UtilityAdmin;
