import parseCookie from '../cookieParse';
import { AppState } from '../App';
import React, { useState } from 'react';

type CreateLobbyFormProps = {
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    state: AppState;
}

const CreateLobbyForm = ({ setState, state }: CreateLobbyFormProps) => {
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the lobby
    fetch('/api/create-lobby', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, key })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Lobby Created:', data);
        const { id, key } = data;
        setState({
            ...state,
            currentView: 'in-own-lobby',
            inLobby: true,
            lobbyId: id,
            username: username,
        })
    })
    .catch((error) => {
        console.error('Error:', error);
    });


  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name (Host Name)</label>
        <input
          id="name"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="key">Key (Lobby Key)</label>
        <input
          id="key"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Lobby</button>
    </form>
  );
};

export default CreateLobbyForm;
