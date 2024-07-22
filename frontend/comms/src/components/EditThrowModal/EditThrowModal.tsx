import { useState } from "react";
import { UtilThrow } from "../../../../../shared/enums/utility";
import styles from "./EditThrowModal.module.css";
import React from "react";


type EditThrowModalProps = {
    throwData: UtilThrow;
    setThrowData: (throwData: UtilThrow) => void;
    hide: () => void;
}

export const EditThrowModal = ({ throwData, setThrowData, hide }: EditThrowModalProps) => {
    
    // instead of directly saving whenver it's changed, include a save button, then confirm when done.
    const [throwDataState, setThrowDataState] = useState<UtilThrow>(throwData);
    const formButtons = Object.entries(throwData).map(([key, value]) => {
        return (
            <div className={styles.formEntry}>
                <label>{key}</label>
                <input type="text" value={value} onChange={(e) => {
                    setThrowDataState({...throwDataState, [key]: e.target.value});
                }} />
            </div>
        )
    });

    return (
        <div className={styles.background}>
            <h2>Edit Throw</h2>
            <button onClick={hide}>Close</button>
            <form>
                {formButtons}
                <button onClick={() => setThrowData(throwDataState)}>Save</button>
            </form>
        </div>
    )
}