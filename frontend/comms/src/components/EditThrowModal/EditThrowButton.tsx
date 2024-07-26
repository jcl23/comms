import React, { useState } from "react";
import { UtilThrow } from "../../../../../shared/enums/utility";
import { EditThrowModal } from "./EditThrowModal";

type EditThrowButtonProps = {
    throwData: UtilThrow | null;
    setThrowData: (throwData: UtilThrow | null) => void;
}
export const EditThrowButton = function EditThrowButton({ throwData, setThrowData }: EditThrowButtonProps) {
    
    const disabled = !throwData;

    const [isEditing, setIsEditing] = useState(false);

    return (
    <>
        <button
        disabled={disabled}
            onClick={() => {
                setIsEditing(true);
            }}  
            >
            Edit!!
        </button>
        {
            isEditing && <EditThrowModal throwData={throwData} hide={() => setIsEditing(false)} />
        }
    </>
    );

}