const express = require('express');
const cookie_parser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const expressWs = require('express-ws')(app);
import Lobby from "./lobby";

// const wss = new WebSocket.Server({ noServer: true });
const port = 3000;

const lobbies = {};

const createLobby = function(username, key) {
    const lobby = new Lobby(key, username);
    const lobbyId = lobby.id;
    lobbies[lobbyId] = lobby;
    lobbies[lobbyId].setHost(username);
    console.log(`Lobby created with ID: ${lobbyId} by ${username}`);
    return lobbies[lobbyId];
}
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookie_parser());
// Serve the HTML file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    console.log("served");
});

app.ws('/echo', (ws, req) => {
    ws.on('message', (msg) => {
      console.log(`Received message: ${msg}`);
      ws.send(`Echo: ${msg}`);
    });
  
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
// Endpoint to create a lobby
app.post('/create-lobby', (req, res) => {
    // Logic to create a lobby
    const { username, key} = req.body;
    console.log("Request received: ", username, key)
    const lobby = createLobby(key, username);
    console.log("Lobby returned: ", lobby);
    res.json( lobby );
});

app.get('/lobbies/:id', (req, res) => {
    const { id: lobbyId } = req.params;
    if (lobbies[lobbyId]) {
        res.sendFile(path.join(__dirname, 'public', 'lobby.html'));
    } else {
        res.status(404).send('Lobby not found');
    }
})

app.post('/lobbies/:id/join', (req, res) => {
    const lobbyId = req.params.id;
    const { userId, userName } = req.body;
    const lobby = lobbies[lobbyId];

    if (lobby) {
        lobby.addUser(userId, userName);
        const isCreator = (lobby.creator === userId);
        res.cookie("username", userName, {expire: 500000 + Date.now()});
        res.json({ isCreator: isCreator });
    } else {
        res.status(404).send('Lobby not found');
    }
});

// Serve lobby details
app.get('/lobbies/:id/details', (req, res) => {
    const lobbyId = req.params.id;
    const lobby = lobbies[lobbyId];
    if (lobby) {
        res.json({ ...lobby, hostname: lobby.getHostname() });
    } else {
        res.status(404).send('Lobby not found');
    }
});


// Function to generate a unique lobby ID

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

