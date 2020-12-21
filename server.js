//Require modules
const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var fs = require('fs');

//Listen on port 8080
http.listen(8080, () => {
    console.log('listening on 8080');
});

//Set folder for static files to be served by express
app.use(express.static("public"));

//store users on server
const users = [];


//Runs when user connects
io.on('connection', (socket) => {
    console.log('a user connected with id: ' + socket.id);

    //parsing previous chat messages and sending to client
    var chatHistory = [];
    chatData = fs.readFileSync("new.json");
    chatHistory = JSON.parse(chatData);
    socket.emit('chat-history', chatHistory);

    //Broadcast to other users when new user connects
    socket.on('new-user', username => {
        users.push(socket.id);
        users[socket.id] = username;
        socket.broadcast.emit('message', ("" + username + " has joined the chat"));
    })

    //Welcome user with message
    socket.emit('message', "Welcome to ChatRoom");

    //Send message when user leaves chat
    socket.on('disconnect', socket => {
        io.emit('message', "a user left the chat");
    });

    //Listen for when user sends a chat message
    socket.on('send-chat-message', message => {

        chatMessage = {
            message: message,
            username: users[socket.id]
        }

        io.emit('chat-message', chatMessage);

        chatHistory.push(chatMessage);
        fs.writeFile("new.json", JSON.stringify(chatHistory), (err) => {
            if (err) throw err;
            console.log("Saved to JSON-file");
        })

        console.log(chatHistory);
    })

});