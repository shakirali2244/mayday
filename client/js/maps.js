
socket = io.connect('http://redditchat.us.to:3001');
var name = prompt("Please enter your name", "Harry Potter");
$('form').submit(function(){
    socket.emit('chatMessage', { name: name,message: $('#m').val()});
    if ($('#m').val().indexOf('.jpg') > -1 || $('#m').val().indexOf('.png') > -1 ){
      $('#messages').append($('<li class="list-group-item"> '+name+' (me):' +'<img src="'+$('#m').val()+'" style="max-width:100%; max-height:100%;"/></li>'));
    }else{
      $('#messages').append($('<li class="list-group-item dadad">'+name+' (me):' + $('#m').val()+'</li>'));
    }
    $('#m').val('');
    var chat_window = document.getElementById("messages_div");
    chat_window.scrollTop = chat_window.scrollHeight;
    return false;
  });

  socket.on('chatMessage', function(data){
    if (data.message.indexOf('.jpg') > -1 || data.message.indexOf('.png') > -1){
      $('#messages').append($('<li class="list-group-item">'+data.name + ' : ' +'<img src="'+data.message+'" style="max-width:100%; max-height:100%;" /></li>'));
    }else{
      $('#messages').append($('<li class="list-group-item">'+data.name + ' : ' +data.message + '</li>'));
    }
    var chat_window = document.getElementById("messages_div");
    chat_window.scrollTop = chat_window.scrollHeight;
  });

  var joined = 0;

  function joinRoom(data){
    if (joined){
      alert("Can only join one room, refresh the page to reset room");
    }else{
      joined = 1;
      console.log('joining room '+ data);
      echoChatWindow('joining room '+ data);
      socket.emit('chatMessage', { name: name, message: '/join '+data});
    }
    
  }

  function echoChatWindow(data){
    $('#messages').append($('<li class="list-group-item-success">').text(data));
  }

  $.ajax({
        type: "GET",
        url: "https://api.pushshift.io/reddit/topsubs",
        data: "lookback=100",
        success: function(data) {
          var array = data.data;
          for (var i=0; i<array.length; i++) {
            $("#list ul").append('<li><button class="btn btn-default" onclick="joinRoom(\''+array[i].subreddit+'\')">'+array[i].subreddit+'</button></li>');
          }
        }
      });
