const updateUserList = (userList) => {
    const userListElement = document.getElementById('players');
    userListElement.innerHTML = '';
    userList.forEach(user => {
        const userElement = document.createElement('li');
        userElement.innerText = user;
        userListElement.appendChild(userElement);
    });
}
window.onload = function() {

    const urlParams = new URLSearchParams(window.location.search);
    const lobbyId = window.location.pathname.split('/').pop();
    const username = parseCookie(document.cookie).username;
    
    
    fetch(`/lobbies/${lobbyId}/details`)
    .then(response => response.json())
    .then(data => {
        if (data.owner === "TEST_USER") {
            document.getElementById('creatorActions').style.display = 'block';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    const ws = new WebSocket('ws://localhost:3000/lobbies/' + lobbyId + `?username=${username}`);
        ws.onopen = function() {
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
                    updateUserList(data.users);
                    break;
                }
            };
        document.getElementById('testMessage').addEventListener('click', function() {

        });
    // test message onclick, send some text to the "echo" websocket endpoint and keep it alive
        
}