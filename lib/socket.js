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
          
          console.log(data);
          var msg = data.message;
          if (msg.indexOf('/join')> -1){
            var room = msg.split(" ");
            socket.join(room[1]);
            console.log("joining "+room[1]);
          }else{
          console.log("id, room = "+ socket.id + " " + socket.rooms[1]);
          io.to(socket.rooms[1]).broadcast('chatMessage', data);
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
