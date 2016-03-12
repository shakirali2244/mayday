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
              console.log("JOIN ::cannot join more than 1 room");
              socket.emit("roomJoin",{'stat':0,'msg':'cannot join more then one room'});
              /*
              socket.leave(room[1]);
              */
             }else{
             
              room[1] = room[1].toLowerCase();
              data.name = data.name.toLowerCase();  
                      
             var currentRoom = roomInfo[room[1]];
             if(currentRoom != undefined){
             	 var found = false;
             	 for (var i=0; i<currentRoom.length; i++) {
             	 	
		          if (currentRoom[i].name == data.name) {
		            found = true;
		            console.log('JOIN:: name conflict in room  '+ room[1]);
		            socket.emit("roomJoin",{'stat':0,'msg':'name conflict in room'});
		          }
		        }
		        if(!found){
		        	socket.join(room[1]);
	             	console.log("JOIN ::joining "+room[1]);
	             	currentRoom.push({'name':data.name, 'id':socket.id});
	             	socket.emit("roomJoin",{stat:1,'room':room[1]});
	             	var roomStat = JSON.parse(JSON.stringify(currentRoom));
	             	roomStat.forEach(function(v){ delete v.id });
          			io.to(room[1]).emit('roomStat', roomStat);
		        }
             }else{
             	 socket.join(room[1]);
             	console.log("JOIN ::creating "+room[1]);
             	roomInfo[room[1]] = [{'name':data.name, 'id':socket.id}];
             	var roomStat = JSON.parse(JSON.stringify(roomInfo[room[1]]));
	            roomStat.forEach(function(v){ delete v.id });
          		socket.emit('roomStat', roomStat);
             	socket.emit("roomJoin",{stat:1,'room':room[1]});
             }
             //console.log(roomInfo);
             }
           }else{
            console.log(data.name+' : ' + data.message + ' in ' + socket.rooms);
	          fs.appendFile('./client/msgs/'+socket.rooms[1], JSON.stringify(data) + os.EOL, function(err) {
	            if(err) {
	              return console.log(err);
	            }
	           console.log(socket.rooms[1] + ' updated');
	         }); 
           socket.broadcast.to(socket.rooms[1]).emit('chatMessage', data);
           console.log(roomInfo[socket.rooms[1]]);
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

          dance:
          
	for (var key in roomInfo) {
		var currentRoom = roomInfo[key];
		for(var i = 0; i <currentRoom.length; i++){
			//console.log('finding '+socket.id+' in '+JSON.stringify(currentRoom))
			if(currentRoom[i].id == socket.id){
				console.log('DISCONNECT :: splicing user '+currentRoom[i].name+' from room '+key);
          		currentRoom.splice(i,1);
          		console.log(currentRoom);
          		var roomStat = JSON.parse(JSON.stringify(currentRoom));
	            roomStat.forEach(function(v){ delete v.id });
          		socket.broadcast.to(key).emit('roomStat', roomStat);
          		
          		break dance;
          	}
		}
		        	
    }      	
          //var roomStat = currentRoom.forEach(function(v){ v.name });
          //socket.broadcast.to(socket.rooms[1]).emit('roomStat', currentRoom);
          
        });
}
