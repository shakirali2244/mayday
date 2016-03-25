var stylesArray = [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]

function initMap() {
  markers = [];
  // Create a map object and specify the DOM element for display.
  $('#map').height($(window).height() - $('#top-height').height()*1.4);
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:49.289922, lng: -123.130646 },
    zoom: 8
  });
  map.set('styles',stylesArray);

    socket = io.connect('http://redditchat.us.to:3002');
    navigator.geolocation.getCurrentPosition(GetLocation);
    var name = prompt("Please enter your name", "Harry Potter");
    function GetLocation(location) {
    socket.emit('locationInfo',{lat: location.coords.latitude, lng: location.coords.longitude, name: name});
    }
	 socket.on('location', function(data){
		 if (!map){
			 map = new google.maps.Map(document.getElementById('map'), {
				 center: {lat:49.289922,lng: -123.130646},
				 zoom: 8,
			 });
		 }
		console.log(data[i]);
                 deleteMarkers();
		 for (var i = 0; i < data.length; i++) {
			console.log(data[i]);
			addMarker({lat: data[i].lat, lng: data[i].lng},data[i].name);
		 }
	 });
    $('form').submit(function(){
    socket.emit('chatMessage', { name: name,message: $('#m').val()});
    $('#messages').append($('<li>').text('You:: ' + $('#m').val()));
    $('#m').val('');
    var chat_window = document.getElementById("messages_div");
    chat_window.scrollTop = chat_window.scrollHeight;
    return false;
  });
  socket.on('chatMessage', function(data){
    $('#messages').append($('<li>').text(data.name + ':: ' +data.message));
    var chat_window = document.getElementById("messages_div");
    chat_window.scrollTop = chat_window.scrollHeight;
  });
  socket.emit("getLocation", "please");
}

function addMarker(location,name) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
                label: name,
                title: name
	});
        var infowindow = new google.maps.InfoWindow({
    		content: name
  	});
        //console.log(name);
        marker.addListener('click', function() {
    		infowindow.open(map, marker);
  	});
	markers.push(marker);
}

function setMapOnAllMarkers(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

function clearMarkers() {
	setMapOnAllMarkers(null);
}


function deleteMarkers() {
	clearMarkers();
	markers = [];
}


