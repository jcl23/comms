import React, { useEffect, useState } from "react";
import { UtilThrow } from "../../../../../shared/enums/utility";
import styles from "./EditThrowModal.module.css";
import { fetchCallouts, saveThrow } from "../../util/fetch";

import propsToNiceName from "../../../../../shared/data/propToNiceName.json";

type EditThrowModalProps = {
    throwData: UtilThrow;
    hide: () => void;
}

export const EditThrowModal = ({ throwData,  hide }: EditThrowModalProps) => {
    

    const EDIT_FIELDS = ["map", "utility", "team", "throwPositionCallout", "activePositionCallout", "lineup", "video"];
    // instead of directly saving whenver it's changed, include a save button, then confirm when done.
    const [throwDataState, setThrowDataState] = useState<UtilThrow | null>(null);
    useEffect(() => {
        setThrowDataState(throwData);
    }, [throwData]);
    const formButtons = (throwDataState) && Object.entries(throwDataState).filter(([key]) => EDIT_FIELDS.indexOf(key) >= 0).map(([key, value]) => {
        return (
            <div className={styles.formEntry}>
                <label>{propsToNiceName[key] ?? key}</label>
                <input type="text" value={value} onChange={(e) => {
                    console.log("edit field, ", key, e.target.value);
                    setThrowDataState({...throwDataState, [key]: e.target.value});
                }} />
            </div>
        )
    });
    const handleOnSave = (throwDataState) => async () => {
        const response = await saveThrow(throwDataState);
        console.log("Response from save:", response);
    }
    const setCallouts = function() {
        if (!throwDataState) return;
        fetchCallouts(throwDataState).then((callouts) => {
            console.log("Callouts: ", callouts);
            setThrowDataState({...throwDataState, ...callouts});
        });
    }
    return (
        <div className={styles.background}>
            <div className={styles.modal}>
                <h2>Edit Throw</h2>
                <button onClick={hide}>Close</button>
                <button onClick={setCallouts}>Set Callouts</button>
                <form onSubmit={(e) => {e.preventDefault()}}>
                    {formButtons ?? <div>No throw selected</div>}
                    <button onClick={handleOnSave(throwDataState)}>Save</button>
                </form>
            </div>
        </div>
    )
}