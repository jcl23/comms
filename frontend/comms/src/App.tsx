import React, { useEffect, useState } from 'react';
import CreateLobbyForm from './components/CreateLobbyForm';
import JoinLobbyForm from './components/JoinLobbyForm';
import parseCookie from './cookieParse';
import UtilityAdmin from './components/UtilityAdmin/UtilityAdmin';
import Header from './components/Header/Header';
import { CalloutEditor } from './components/MapSelector/CalloutEditor';
import { PlanEditor } from './components/Plan/PlanEditor';

export type AppState = {
  currentView: 'create' | 'join' | 'in-lobby' | 'in-own-lobby' | "editutil" | "callouts" | "editplans";
  users: string[];
  inLobby: boolean;
  lobbyId?: string,
  username?: string,
};
const initialState: AppState = {
  currentView: "editplans",
  users: [],
  inLobby: false,
};
const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { currentView } = state;
  const renderForm = () => {
    if (currentView === 'create') {
      return <CreateLobbyForm setState={setState} state={state} />;
    } else if (currentView === 'join') {
      return <JoinLobbyForm setState={setState} state={state}/>;
    }
    return null;
  };


  useEffect(() => {
    if (!state.inLobby) {
      setSocket(null);
      return;
    }
    const ws = new WebSocket('ws://localhost:3000/ws/lobbies/' + state.lobbyId + `?username=${state.username}`);
    setSocket(ws);
    ws.onopen = function() {
      console.log("Socked opened");
        // ws.send(JSON.stringify({ type: 'test', message: 'Hello World!' }));
    };
    ws.onmessage = function(event) {
        const { data: dataString } = event;
        const data = JSON.parse(dataString);
        console.log('Message from server ', data);
        switch (data.type) {
            case 'userList':
                // update user list
                console.log("new user list: ", data);
                setState({ ...state, users: data.users });
                break;
            }
        };
      
  }, [state.inLobby])
  return (
    <div className="App">
      
      <Header state={state} setState={setState} />
      
      {currentView === 'in-own-lobby' && (
        <div>
          <p>Created lobby with ID: {state.lobbyId}</p>
          <p>Name: {state.username}</p>
        </div>
      )}
      {currentView === "editutil" && <UtilityAdmin />}
      {currentView === "editplans" && <PlanEditor />}
      {currentView === "callouts" && <CalloutEditor />}
      {socket && (
       <div>
        <h2>Users</h2>
        <ul>
          {state.users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
          </ul>
        </div> 
      )}
      {renderForm()}
    </div>
  );
};
export default App;