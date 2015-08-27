exports.start = function start(socket){
	console.log('a user connected');
	//to/from drones
	console.log(jsarr);
  	socket.on('locationInfo',function (data){
        for (var i=0; i<jsarr.length; i++) {
          var found = false;
          if (jsarr[i].name == data.name) {
             found = true;
             console.log("Updating location info for "+jsarr[i].name);
             jsarr[i].lat = data.lat;
             jsarr[i].lng = data.lng;
              break;
          }
        }
        if(!found){
         console.log("Adding new device to arr named: " + data.name);
         jsarr.push(data)
        }
        console.log(jsarr);
   	 io.sockets.emit('location', jsarr)
  	});
    /*var lat = 49.28047
    setInterval(function(){ 
				lat+=0.001
				io.sockets.emit('location',{lat: lat, lng:-122.917120} );
				console.log('sending data');  
			}, 1000);
    */
}
