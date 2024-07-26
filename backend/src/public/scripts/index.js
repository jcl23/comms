window.onload = function() {
    console.log('loaded');

    document.querySelector('#makeLobby').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.querySelector('input[name="ownername"]').value;
        const key = document.querySelector('input[name="key"]').value;
        fetch('/create-lobby', {
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
            window.location.href = `/lobbies/${id}?key=${key}`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
    // form submit for joinoign a lobby.
    document.querySelector('#joinLobby').addEventListener('submit', function(event) {
        event.preventDefault();
        const lobbyId = document.querySelector('input[name="lobbyId"]').value;
        
        event.preventDefault();
        const username = document.querySelector('input[name="name"]').value;

        fetch(`/lobbies/${lobbyId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Lobby Created:', data);
            const { id, key } = data;
            window.location.href = `/lobbies/${lobbyId}`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    });/////////////////////////////////////////
}