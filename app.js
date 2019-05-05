var express = require('express');
var socket = require('socket.io');

var usernames = [];

// App setup
var app = express();
var server = app.listen(4000, function(){
  console.log('listening on port 4000');
});

// Static files
app.use(express.static('views'));

// Socket setup
var io = socket(server);

io.on('connection', function(socket){
  console.log('made socket connection',socket.id);

  socket.on('new_username', function(data, callback){
    if (usernames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      console.log(usernames);
      updateUsernames();
    }
  });

  socket.on('chat', function(data){
    io.sockets.json.emit('chat', {message: data, user: socket.username})
    console.log('"' + data + '" by ' + socket.username);
  });
  
  socket.on('typing', function(data){
    socket.broadcast.emit('typing', socket.username);
    console.log(socket.username);
  });

  function updateUsernames() {
    io.sockets.emit('usernames', usernames);
  };

  socket.on('disconnect', function(){
    if(!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
    console.log('left connection', socket.id);
  });

  setInterval(function(){ 
    console.log(usernames);
    updateUsernames();
   }, 10000);

});

