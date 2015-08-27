exports.start = function start(socket){
	console.log('a user connected');
	//to/from drones
  	socket.on('test',function (data){
    console.log(data);
    io.sockets.emit('location', [JSON.parse(data)])
  	});
    var lat = 49.28047
    setInterval(function(){ 
				lat+=0.001
				io.sockets.emit('location',{lat: lat, lng:-122.917120} );
				console.log('sending data');  
			}, 1000);
}
