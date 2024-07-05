import React, { useEffect, useState } from 'react';
import CreateLobbyForm from './components/CreateLobbyForm';
import JoinLobbyForm from './components/JoinLobbyForm';
import parseCookie from './cookieParse';
import UtilityAdmin from './components/UtilityAdmin';


export type AppState = {
  currentView: 'create' | 'join' | 'in-lobby' | 'in-own-lobby' | "editing" | null;
  users: string[];
  inLobby: boolean;
  lobbyId?: string,
  username?: string,
};
const initialState: AppState = {
  currentView: null,
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
    <div>
      <h1>Lobby System</h1>
      <button onClick={() => setState({ ...state, currentView: "editing"})}>Edit</button>
      {currentView === null && (
        <div>
          <button onClick={() => setState({ ...state, currentView: "create"}) }>Create Lobby</button>
          <button onClick={() => setState({  ...state, currentView: "join" })}>Join Lobby</button>
        </div>
      )}
      {currentView === 'in-own-lobby' && (
        <div>
          <p>Created lobby with ID: {state.lobbyId}</p>
          <p>Name: {state.username}</p>
        </div>
      )}
      {currentView === "editing" && <UtilityAdmin />}
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