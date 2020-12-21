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

//For users on server
const users = [];




//Runs when user connects
io.on('connection', (socket) => {

    var data = fs.readFileSync("chathistory.json");
    var dataoutput = JSON.parse(data);
    console.log(dataoutput);

    //TBD -- Chat history with JSON
    var filetext = fs.readFileSync('messages.txt', 'utf-8');
    var lines = [];
    lines = filetext.split("§");
    socket.emit('chat-history', lines);


    console.log('a user connected with id: ' + socket.id);
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
        console.log(message);
        io.emit('chat-message', {
            message: message,
            username: users[socket.id]
        });

        fs.appendFile('messages.txt', users[socket.id] + ": " + message + "§", function(err, data) {
            if (err) throw err;
        });
    })

});