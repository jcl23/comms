import { useState } from "react";
import { ThrowType, UtilThrow } from "../../../../../shared/enums/utility";
import { EditThrowModal } from "../EditThrowModal/EditThrowModal";
import React from "react";

// UtilThrow represents the type of dat that EditThrowEntry expects. 
// This is a component in a list for editing.
// it will use a popup window that covers the whole screen to edit.
// The user will be able to edit all fields of the UtilThrow object.

export type EditThrowEntryProps = {
    throwData: UtilThrow;
    setThrowData: (throwData: UtilThrow) => void;
}

export const EditThrowEntry = ({ throwData, setThrowData, ...props }: EditThrowEntryProps) => {
    
    const [showEditWindow, setShowEditWindow] = useState(false);
    
    const { 
        map, team, utility, throwType, 
        speed, strafe, doJump, doCrouch,
        throwPositionCallout, activePositionCallout,
    } = throwData;
    
    const throwDescription: string[] = [];
    
    let movement: string[] = [];
    if (doCrouch) movement.push("Crouch");
    if (speed == "Run") movement.push("Running");
    if (speed == "Walk") movement.push("Walking");

    throwDescription.push(movement.join("-"));

    if (throwType == "Left") throwDescription.push("Left-Click");
    if (throwType == "Middle") throwDescription.push("Left & Right-Click");
    if (throwType == "Right") throwDescription.push("Right-Click");

    if (doJump) throwDescription.push("Jump");
    throwDescription.push("Throw");

    const throwDescriptionString = throwDescription.join(" ");

    // const dataList = Object.entries(throwData).filter(([propName]) => (
    //     !["map", "throwId", "userId"].includes(propName)
    // )).map(([_, value]) => {
    //     return (
    //         <td>
    //             {value}
    //         </td>
    //     )  
    // });
    return (
       <tr {...props}>
            <td className="editThrowEntry">
                <button onClick={() => setShowEditWindow(true)}>Edit</button>
            </td>
            <td>{map}</td>
            <td>{team}</td>
            <td>{utility}</td>
            <td>{throwDescriptionString}</td>
            <td>{throwPositionCallout}</td>
            <td>{activePositionCallout}</td>
            {showEditWindow && (
                <EditThrowModal throwData={throwData} setThrowData={setThrowData} hide={() => setShowEditWindow(false)} />
            )}
       </tr> 
    )
}