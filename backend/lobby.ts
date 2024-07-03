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
function generateLobbyId() {
    return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default Lobby;