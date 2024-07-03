import React, { useState } from 'react';
import { AppState } from '../App';

type JoinLobbyFormProps = {
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    state: AppState;
}
const JoinLobbyForm = ({ setState, state }: JoinLobbyFormProps) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Join the lobby
    const response = await fetch(`/api/lobbies/${code}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, code }),
    });

    if (response.ok) {
      // Handle successful join (e.g., navigate to lobby or show success message)
      console.log('Joined lobby');
      setState({    
        ...state, 
        currentView: 'in-lobby',
        lobbyId: code,
        username: name,
        inLobby: true,
     })
    } else {
      // Handle error
      console.error('Failed to join lobby');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="code">Code (Lobby Code)</label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <button type="submit">Join Lobby</button>
    </form>
  );
};

export default JoinLobbyForm;
