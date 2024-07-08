import react from "react";

import { AppState } from "../App";

/* Should be responsible for switching the view between the create and join lobby forms, and edit utility. */

type HeaderProps = {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
};

const Header = ({ state, setState }: HeaderProps) => {
    const { currentView } = state;

    const handleCreate = () => {
        setState({ ...state, currentView: "create" });
    };

    const handleJoin = () => {
        setState({ ...state, currentView: "join" });
    };

    const handleEdit = () => {
        setState({ ...state, currentView: "editing" });
    };

    return (
        <header style={{
            position: "absolute",
            top: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            borderBottom: "1px solid #ccc",
        }}>
            <h2>Utility Comms</h2>
            <nav>
                <button onClick={handleCreate}>Create Lobby</button>
                <button onClick={handleJoin}>Join Lobby</button>
                <button onClick={handleEdit}>Edit Utility</button>
            </nav>
        </header>
    );
};

export default Header;