
socket = io.connect('http://redditchat.us.to:3001');
var name = prompt("Please enter your name", "Harry Potter");
$('form').submit(function(){
    socket.emit('chatMessage', { name: name,message: $('#m').val()});
    $('#messages').append($('<li>').text('You:: ' + $('#m').val()));
    $('#m').val('');
    var chat_window = document.getElementById("messages_div");
    chat_window.scrollTop = chat_window.scrollHeight;
    return false;
  });
  socket.on('chatMessage', function(data){
    $('#messages').append($('<li>').text(data.name + ' : ' +data.message));
    var chat_window = document.getElementById("messages_div");
    chat_window.scrollTop = chat_window.scrollHeight;
  });

  function getTopSubs(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", 'https://api.pushshift.io/reddit/topsubs?lookback=3600', false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
  }
  function joinRoom(data){
    console.log('joining room '+ data);
    socket.emit('chatMessage', { name: name, message: '/join '+data});
  }
  var json = JSON.parse(getTopSubs());
  var array = json.data;
  for (var i=0; i<array.length; i++) {
    $("#header ul").append('<li><button onclick="joinRoom(\''+array[i].subreddit+'\')">'+array[i].subreddit+'</button></li>');
  }