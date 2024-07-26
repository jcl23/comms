import React from "react";
import { UtilThrow } from "../../../../../shared/enums/utility";
import styles from "./FocusedThrowData.module.css";
import describeThrow from "../../util/describeThrow";
type FocusedThrowDataProps = {
    throwData: UtilThrow | null;
    setSelectedThrow: (editing: UtilThrow) => void;
};

export const FocusedThrowData: React.FC<FocusedThrowDataProps> = ({
    throwData,
    setSelectedThrow,
}) => {
    if (throwData === null)
        return <div className={styles.focusedThrowData}>No throw selected</div>;
    return (
        <div  className={styles.focusedThrowData}>
            <div className={styles.row}>
                
                <span className={styles.label}>Utility:</span>
                <span>{throwData.utility}</span>
                <span className={styles.label}>Team:</span>
                <span>{throwData.team}</span>
                <span className={styles.label}>Type:</span>
                <span>{throwData.throwType}</span>
            </div>
          
            <div className={styles.row}>
                <div className={styles.row}>
                    <span className={styles.label}>Map:</span>
                    <span>{throwData.map}</span>
                    <span className={styles.label}>From:</span>
                    <span>{throwData.throwPositionCallout}</span>
                    <span className={styles.label}>To:</span>
                    <span>{throwData.activePositionCallout}</span>
                    
                </div>
                
            </div>
            
            <div className={styles.row}>
                <span>{describeThrow(throwData)}</span>
                <div className={styles.row}>
                    <span className={styles.label}><a href={throwData.lineup}>Lineup</a></span>
                    <span className={styles.label}><a href={throwData.video}>Video</a></span>
         
                </div>
            </div>
            
        </div>
    );
};
