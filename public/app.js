var socket = io();

//DOM elements
const chatForm = document.getElementById('chat-form');
const chatMessageInput = document.getElementById('chat-message-input');
const chatOutput = document.getElementById('chat-messages');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');

//Listen for events from server
socket.on('chat-history', data => {
    data.forEach(chatMsg => {
        appendMessage(chatMsg)
    });
});

socket.on('message', message => {
    console.log(message);
});

socket.on('chat-message', message => {
    appendChatMessage(message);
})

/*Functions and event listeners
 */
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevents page from reloading after form is submitted

    const username = usernameInput.value;
    socket.emit('new-user', username);
})

//When user sends chat message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevents page from reloading after form is submitted
    const message = chatMessageInput.value; //getting value from input

    //Send message to server
    socket.emit('send-chat-message', message);
    chatMessageInput.value = "";
})

function appendMessage(message) {
    var div = document.createElement('div');
    div.classList.add("testclass");
    div.innerHTML = "<p>" + message + "</p>";
    chatOutput.append(div);
};

function appendChatMessage(message) {
    var div = document.createElement('div');
    div.innerHTML = "<p>" + message.username + ": " + message.message + "</p>";
    chatOutput.append(div);
}