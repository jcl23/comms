import react, { useEffect, useRef, useState } from "react";

import { AppState } from "../App";
import React from "react";
import styles from "./Header.module.css";
/* Should be responsible for switching the view between the create and join lobby forms, and edit utility. */

type HeaderProps = {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const handlers = {
    "create": "Create Lobby",
    "join": "Join Lobby",
    "editutil": "Utility",
    "editplans": "Plans",
    "callouts": "Calls"
};

const Header = ({ state, setState }: HeaderProps) => {
    const { currentView } = state;
    const [outlineStyle, setOutlineStyle] = useState({} as React.CSSProperties);
    const refs = useRef<HTMLButtonElement[]>([]);
    useEffect(() => {
        // Position the outline around the first button when the component loads
        if (refs.current.length > 0) {
          positionOutline(0);
        }
    }, []);

    const positionOutline = function(i: number) {
        const button = refs.current[i];
        const rect = button.getBoundingClientRect();
        setOutlineStyle({

            width: `${rect.width}px`,
            height: `${rect.height}px`,
            top: `${rect.top + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
        });
    }
    
    return (
        <div>

        <div className={styles.outline} style={outlineStyle}></div>
        <header className={styles.header}>
            <nav className={styles.nav}>
                {
                    Object.entries(handlers).map(([tab, tabName], i) => (
                        <button ref={e => (refs.current[i] = e)} onClick={() => { 
                            setState({ ...state, currentView: tab})
                            positionOutline(i);
                        }}>{tabName}</button>
                    ))
                }
            </nav>
            <h2>Utility Comms</h2>
        </header>
        </div>
    );
};

export default Header;