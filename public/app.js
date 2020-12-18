var socket = io();

//DOM elements
const chatForm = document.getElementById('chat-form');
const chatMessage = document.getElementById('chat-message');
const chatOutput = document.getElementById('chat-messages');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');

//Listen for events from server
socket.on('message', message => {
    console.log(message);
});

socket.on('chat-message', message => {
    var div = document.createElement('div');
    div.innerHTML = "<p>" + message + "</p>";
    chatOutput.append(div);
})

usernameForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevents page from reloading after form is submitted

    const username = usernameInput.value;
    socket.emit('new-user', username);
})

//adding event listener for when user sends chat message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevents page from reloading after form is submitted

    const message = chatMessage.value; //getting value from input
    //Send message to server
    socket.emit('send-chat-message', message);
    chatMessage.value = "";
})