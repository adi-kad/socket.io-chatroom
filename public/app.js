var socket = io();

//DOM elements
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatMessageInput = document.getElementById('chat-message-input');
const chatOutput = document.getElementById('chat-messages');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');


//Listen for events from server
socket.on('chat-history', data => {
    console.log(data);
    data.forEach(chatMsg => {
        appendChatMessage(chatMsg);
    });

    //setting scroll to latest messages
    chatOutput.scrollTop = chatOutput.scrollHeight;
});

socket.on('message', message => {
    appendMessage(message);
    chatOutput.scrollTop = chatOutput.scrollHeight;
});

socket.on('chat-message', message => {
    appendChatMessage(message);
    //setting scroll to latest message
    chatOutput.scrollTop = chatOutput.scrollHeight;
})

/*Functions and event listeners
 */
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevents page from reloading after form is submitted

    if (usernameInput.value == "") {
        alert("You need to enter a username to join chat");
    } else {
        chatContainer.style.display = "block";
        usernameForm.style.display = "none";
        const username = usernameInput.value;
        socket.emit('new-user', username);
    }

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
    div.classList.add("message-class");
    div.innerHTML = "<p>" + message + "</p>";
    chatOutput.append(div);
};

function appendChatMessage(message) {
    var div = document.createElement('div');
    div.innerHTML = "<p id=\"chat-message-username\">" + message.username + "</p>" +
        "<p id=\"chat-message\">" + message.message + "</p>";
    chatOutput.append(div);
}