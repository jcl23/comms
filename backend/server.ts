const express = require("express");
const cookie_parser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const expressWs = require("express-ws")(app);
import Lobby from "./lobby";

// const wss = new WebSocket.Server({ noServer: true });/////////////////////////////////
const port = 3000;

const lobbies: Record<string, Lobby> = {};

const createLobby = function (username, key) {
    debugger;
    const lobby = new Lobby(key, username);
    const lobbyId = lobby.getId();
    lobbies[lobbyId] = lobby;
    lobbies[lobbyId].setHost(username);
    console.log(`Lobby created with ID: ${lobbyId} by ${username}`);
    return lobbies[lobbyId];
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookie_parser());
app.use(express.static(path.join(__dirname, "public", "scripts")));
// Serve the HTML file at the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
    console.log("served");
});

// Endpoint to create a lobby
app.post("/api/create-lobby", (req, res) => {
    // Create a lobby based on the key and username
    const { username, key } = req.body;
    const lobby = createLobby(username, key);
    res.cookie("username", username, { expire: 500000 + Date.now() });
    res.json({
        id: lobby.getId(),
        key: lobby.getKey(),
        owner: lobby.getOwner(),
        users: lobby.getUsers(),
    });
});

app.get("/api/lobbies/:id", (req, res) => {
    const { id: lobbyId } = req.params;
    console.log("Route /lobbies/:id\n Req: ", req.params);
    if (lobbies[lobbyId]) {
        res.sendFile(path.join(__dirname, "public", "lobby.html"));
    } else {
        res.status(404).send("Lobby not found");
    }
});

app.post("/api/lobbies/:id/join", (req, res) => {
    const lobbyId = req.params.id;
    console.log("Route /lobbies/:id/join");

    const { username } = req.body;
    const lobby = lobbies[lobbyId];

    if (lobby) {
        // lobby.addUser(username, null);
        const isCreator = lobby.getOwner() === username;
        res.cookie("username", username, { expire: 500000 + Date.now() });
        res.json({ isCreator: isCreator });

        broadcastUserList(lobbyId);

    } else {
        res.status(404).send("Lobby not found");
    }
});

app.ws("/ws/lobbies/:id", (ws, req) => {
    const lobbyId = req.params.id;
    const username = req.query.username;

    console.log("Connection from user: ", username, " to lobby: ", lobbyId);
    // confirm existance of lobby, close if none
    if (!lobbies[lobbyId]) {
        ws.close();
        return;
    }
    // add user to lobby
    lobbies[lobbyId].addUser(username, ws);

    broadcastUserList(lobbyId);

    ws.on("message", (msg) => {
        console.log(`Received message: ${msg}`);
        const data = JSON.parse(msg);
        switch (msg.type) {
        }
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed");
        // get the connections. Find the user by iterating over all ws.
        const connections = lobbies[lobbyId].getConnections();
        const userData = connections.find(([_, socket]) => socket === ws);
        if (userData) {
            const user = userData[0];
            console.log("Removing player: ", user[0])
            lobbies[lobbyId].removeUser(user);
            if (lobbies[lobbyId].getUsers().length > 0) {
                broadcastUserList(lobbyId);
            }
        }
    });
});

// Serve lobby details
app.get("/api/lobbies/:id/details", (req, res) => {
    const lobbyId = req.params.id;
    const lobby = lobbies[lobbyId];
    if (lobby) {
        res.json(lobby);
    } else {
        res.status(404).send("Lobby not found");
    }
});

// Function to generate a unique lobby ID

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

const broadcastUserList = (lobbyId) => {
    const lobby = lobbies[lobbyId];
    const usernames = lobby.getUsers();
    const connections = lobby.getConnections();
    if (connections === null) {
        throw new Error("No connections found");
    }
    const userListString = JSON.stringify({ type: "userList", users: usernames });
    connections.forEach(([username, ws]) => {
        ws.send(userListString);
    });
};
