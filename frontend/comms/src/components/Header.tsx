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
        setState({ ...state, currentView: "editutil" });
    };

    const handleCallouts = () => {
        setState({ ...state, currentView: "callouts" });
    }
    return (
        <header>
            <h2>Utility Comms</h2>
            
            <nav>
                <button onClick={handleCreate}>Create Lobby</button>
                <button onClick={handleJoin}>Join Lobby</button>
                <button onClick={handleEdit}>Edit Utility</button>
                <button onClick={handleCallouts}>Calls</button>
            </nav>
        </header>
    );
};

export default Header;