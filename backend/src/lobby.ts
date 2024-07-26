const MAX_USERS = 5;

class Lobby {
    #owner: string;
    #id: string;
    #key: string;
    #users: Record<string, WebSocket>;

    constructor(key, owner) {
        this.#id = generateLobbyId();
        this.#key = key;
        this.#owner = owner;
        this.#users = {};
    }
    setHost(username) {
        this.#owner = username;
    }
    addUser(username, ws) {
        console.log("adding user", username)
        if (Object.keys(this.#users).length >= MAX_USERS) {
            throw new Error('Lobby is full');
        }
        this.#users[username] = ws;
    }
    removeUser(username) {
        console.log(`Removing user ${username} from  ${this.#users}`);
        delete this.#users[username];
        console.log(`Removed user ${username} from  ${this.#users}`);

    }
    getOwner() {
        return this.#owner;
    }
    getId() {
        return this.#id;
    }
    getKey() {
        return this.#key;
    }
    getUsers() {
        return Object.keys(this.#users);
    }

    getConnections() {
        return Object.entries(this.#users);
    }
}

const LOBBY_ID_CHARS = "CDEFHJKMNPRTVWXY2345689";
function generateLobbyId() {
    // sample 4 characters from the LOBBY_ID_CHARS
    let id = '';
    for (let i = 0; i < 4; i++) {
        id += LOBBY_ID_CHARS.charAt(Math.floor(Math.random() * LOBBY_ID_CHARS.length));
    }
    return id;
}

const createLobby = function (lobbies, username, key) {
    debugger;
    const lobby = new Lobby(key, username);
    const lobbyId = lobby.getId();
    lobbies[lobbyId] = lobby;
    lobbies[lobbyId].setHost(username);
    console.log(`Lobby created with ID: ${lobbyId} by ${username}`);
    return lobbies[lobbyId];
};
export {
    Lobby,
    createLobby
}