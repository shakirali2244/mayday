exports.start = function start(socket){
	console.log('a user connected');
	//to/from drones
	//console.log(jsarr);
  	socket.on('locationInfo',function (data){
        if (jsarr.length == 0){
           console.log('adding first device');
           data.id = socket.id;
           jsarr.push(data);
        }
        var found = false;
        for (var i=0; i<jsarr.length; i++) {
          if (jsarr[i].id == socket.id) {
            found = true;
            console.log('updating location info for  '+ jsarr[i].name);
            jsarr[i].lat = data.lat;
            jsarr[i].lng = data.lng;
            jsarr[i].name = data.name;
            jsarr[i].driver_id = data.driver_id;
            break;
          }
        }
        if(found == false){
         console.log("Adding new device to arr named: " + data.name);
         data.id = socket.id;
         jsarr.push(data)
        }
        //console.log(jsarr);
        console.log('jsarr length = '+jsarr.length);
        io.sockets.emit('location', jsarr)
  	});

        socket.on('sendJob', function(data) {
          console.log("sending Job");
          socket.broadcast.emit('sendJob',data);
        });

        socket.on('getLocation', function(data){
          var timestamp = '[' + Date.now() + '] ';
          console.log(timestamp + ' getLocation'); 
          socket.emit('location', jsarr);
        });
        socket.on('chatMessage',function (data){
          if(data.message == ''){
            return console.log('empty string not allowed');
          }
           var msg = data.message;
           if (msg.indexOf('/join')> -1){
             var room = msg.split(" ");
             if(socket.rooms.length > 1){
              console.log("cannot join more than 1 room");
              socket.emit("roomJoin",0);
              /*
              socket.leave(room[1]);
              */
             }else{
              socket.join(room[1]);
             console.log("joining "+room[1]);
             socket.emit("roomJoin",room[1]);
             }
           }else{
            console.log(data.name+ ' ' + ' : ' + data.message + ' in ' + socket.rooms);
          fs.appendFile('./client/msgs/'+socket.rooms[1], JSON.stringify(data) + os.EOL, function(err) {
            if(err) {
              return console.log(err);
            }
           console.log(socket.rooms[1] + ' updated');
         }); 
           socket.broadcast.to(socket.rooms[1]).emit('chatMessage', data);
         }
           //socket.to(room).emit('chatMessage', data);
           //socket.broadcast.emit('chatMessage', data);
        });

        socket.on('disconnect', function () {
          for (var i=0; i<jsarr.length; i++) {
            if (jsarr[i].id == socket.id){
              console.log('removing deivce ' + jsarr[i].name);
              jsarr.splice(i);
              console.log('jsarr length = '+jsarr.length);
              io.sockets.emit('location', jsarr);
              break;
            }
          }
        });
}
