var socket = io();

//DOM elements
const chatForm = document.getElementById('chat-form');
const chatMessage = document.getElementById('chat-message');
const chatOutput = document.getElementById('chat-messages')

//Listen for events from server and output to 
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
});


//adding event listener for when user sends chat message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevents page from reloading after form is submitted

    const message = chatMessage.value; //getting value from input

    //Send message to server
    socket.emit('send-chat-message', message);
    chatMessage.value = "";
})

//Function for message output
function outputMessage(message) {
    const div = document.createElement('div');
    console.log(message)
    div.innerHTML = "<p><span>sender</span>: " + message + "</p>";
    chatOutput.append(div);
}