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
    var userName = "";

    //parsing previous chat messages and sending to client
    var chatHistory = [];
    chatData = fs.readFileSync("chathistory.json");
    chatHistory = JSON.parse(chatData);
    socket.emit('chat-history', chatHistory);

    //Welcome user with message
    //socket.emit('message', "Welcome to ChatRoom");

    //Broadcast to other users when new user connects
    socket.on('new-user', username => {
        users.push(socket.id);
        users[socket.id] = username;
        userName = username;
        socket.broadcast.emit('message', ("" + username + " has joined the chat"));
    })

    //Listen for when user sends a chat message
    socket.on('send-chat-message', message => {

        chatMessage = {
            message: message,
            username: users[socket.id]
        }

        io.emit('chat-message', chatMessage);

        //Storing chat message in JSON-file
        chatHistory.push(chatMessage);
        fs.writeFile("chathistory.json", JSON.stringify(chatHistory), (err) => {
            if (err) throw err;
            console.log("Saved to JSON-file");
        })

    })

    //Send message when user leaves chat
    socket.on('disconnect', socket => {
        io.emit('message', userName + " has left the chat");
    });

});