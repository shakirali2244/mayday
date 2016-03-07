var express = require('express');
var app = express();
var server = require('http').Server(app);
fs = require('fs');
os = require("os");

jsarr = [];

io = require('socket.io')(server);
app.use(express.static('msgs'));

var socket = require('./lib/socket');

server.listen(3001);

//everything socket related in the /lib/socket.js
io.on('connection', function(req){
  socket.start(req);
});


