const MAX_USERS = 5;

class Lobby {
    #owner: string;
    #id: string;
    #key: string;
    #users: Record<string, string>;

    constructor(key, owner) {
        this.#id = generateLobbyId();
        this.#key = key;
        this.#owner = owner;
        this.#users = {};
    }
    setHost(username) {
        this.#owner = username;
    }
    addUser(userId, userName) {
        if (Object.keys(this.#users).length >= MAX_USERS) {
            throw new Error('Lobby is full');
        }
        this.#users[userId] = userName;
    }
    getOwner() {
        return this.#owner;
    }
    getId() {
        return this.#id;
    }
    getUsers() {
        return Object.values(this.#users);
    }
}
function generateLobbyId() {
    return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export default Lobby;