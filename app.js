var express = require('express');
var app = express();
var server = require('http').Server(app);
http = require('http');
fs = require('fs');
os = require("os");

serverinfo = {};
jsarr = [];
roomInfo=[];

io = require('socket.io')(server);
app.use('/msgs/',express.static('./client/msgs'));

var socket = require('./lib/socket');

server.listen(3001);

writeTofile = function(data,room){
	fs.appendFile('./client/msgs/'+room, JSON.stringify(data) + os.EOL, function(err) {
	            if(err) {
	              return console.log(err);
	            }
	           console.log(room + ' updated');
	         }); 
}
//everything socket related in the /lib/socket.js
io.on('connection', function(req){
  socket.start(req);
});


