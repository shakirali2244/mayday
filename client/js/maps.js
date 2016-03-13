
socket = io.connect('http://redditchat.us.to:3001');
var name = '';
chat_window = document.getElementById("messages_div");
chat_name = document.getElementById("chat_name");
roomHeader = document.getElementById("roomHeader");
var joined = 0;
myRooms = [];
serverInfo = {};
roomstat = [];
exdays = 365;

if(getCookie('name') == ""){
  name = prompt("Please enter your name", "Harry Potter");
  name = name.toLowerCase();
  setCookie('name', name);
  chat_name.innerHTML = name;
}else{
  name = getCookie('name');
  chat_name.innerHTML = name;
  if(getCookie('myRooms') != ""){
    myRooms = JSON.parse(getCookie('myRooms'));
  }
  
  for (var i=0; i<myRooms.length; i++) {
    $("#roomList ul").prepend('<li><button class="btn btn-default" id="roomButton" onclick="joinRoom(\''+myRooms[i]+'\')">'+myRooms[i]+'</button></li>');
  }
}

$('form').submit(function(){
    if ($('#m').val() == ''){
      return false;
    }
    if($('#m').val().indexOf('/join') > -1 || $('#m').val().indexOf('/giphy') > -1  ){
      socket.emit('chatMessage', { name: name.replace(/</g,'&lt;'),message: '/'+$('#m').val().replace(/[^a-zA-Z ]/g, "")});
    }else{
      socket.emit('chatMessage', { name: name.replace(/</g,'&lt;'),message: $('#m').val().replace(/</g,'&lt;')});
    }
    if ($('#m').val().indexOf('http') > -1
      && ($('#m').val().indexOf('.jpg') > -1 
      || $('#m').val().indexOf('.png') > -1 
      || $('#m').val().indexOf('.gif') > -1 )){
      $('#messages').append($('<li class="list-group-item"><span style="font-weight:bold;color : #'+intToRGB(hashCode(name))+';">'+name.replace(/</g,'&lt;')+'(me):</span>' +'<img src="'+$('#m').val().replace(/</g,'&lt;')+'" style="max-width:100%; max-height:100%;"/></li>'));
    }else{
      $('#messages').append($('<li class="list-group-item"><span style="font-weight:bold;color : #'+intToRGB(hashCode(name))+';">'+name.replace(/</g,'&lt;')+'(me):</span> <pre>' + $('#m').val().replace(/</g,'&lt;')+'</pre></li>'));
    }
    $('#m').val('');
    
    chat_window.scrollTop = chat_window.scrollHeight;
    return false;
  });

  socket.on('chatMessage', function(data){
    addMessage(data);
  });

  socket.on('roomJoin',function(data){
    if(data.stat == 0){
      alert(data.msg);
    }else{
      echoChatWindow('Joined room '+ data.room);
      console.log('Joined room '+ data.room.replace(/</g,'&lt;'));
      myRooms.push(data.room.replace(/</g,'&lt;'));
      $("#roomList ul").prepend('<li><button class="btn btn-default" id="roomButton" onclick="joinRoom(\''+data.room.replace(/</g,'&lt;')+'\')">'+data.room.replace(/</g,'&lt;')+'</button></li>');
      setCookie('myRooms',JSON.stringify(myRooms));
      fillChatWindow(data.room.replace(/</g,'&lt;'));
      joined = 1;
    }
  });

   socket.on('roomStat',function(data){
    roomHeader.innerHTML = "Online Users";
    $("#list ul").empty();
    data.forEach(function(v){
      $("#list ul").append('<li><button class="btn btn-default">'+v.name.replace(/</g,'&lt;')+'</button></li>');
    });
});

   socket.on('serverInfo',function(data){
    console.log(data);
    for (var key in data) {
      $("#"+key).text(data[key]);
    }
    roomstat = data;
    serverInfo=data;
  });



  //cmd helper
  function joinRoom(data){
    if (joined){
      alert("Can only join one room, refresh the page to reset room");
    }else{
      socket.emit('chatMessage', { name: name, message: '/join '+data.replace(/</g,'&lt;')});
    }
    
  }

  //http retrive previous msgs
  function fillChatWindow(data){
    $.ajax({
        type: "GET",
        url: "/msgs/"+data,
        success: function(data) {
          //console.log(data);
          var array = data.match(/[^\r\n]+/g);
          for (var i=0; i<array.length; i++) {
            addMessage(JSON.parse(array[i]));
          }
        }
        
      });
  }

  function echoChatWindow(data){
    $('#messages').append($('<li class="list-group-item-success">').text(data.replace(/</g,'&lt;')));
  }

  /*adding messages to the chat window from json files and socket reciepts*/
  function addMessage(data){
     if (data.message.indexOf('http') > -1
      && (data.message.indexOf('.jpg') > -1 
      || data.message.indexOf('.png') > -1
      || data.message.indexOf('.gif') > -1)){
      $('#messages').append($('<li class="list-group-item"><span style="font-weight:bold;color : #'+intToRGB(hashCode(data.name))+';">'+data.name.replace(/</g,'&lt;') + ':</span> ' +'<img src="'+data.message.replace(/</g,'&lt;')+'" style="max-width:100%; max-height:100%;" /></li>'));
    }else{
      $('#messages').append($('<li class="list-group-item"><span style="font-weight:bold;color : #'+intToRGB(hashCode(data.name))+';">'+data.name.replace(/</g,'&lt;') + ':</span> <pre>' +data.message.replace(/</g,'&lt;') + '</pre></li>'));
    }
    console.log(chat_window.scrollHeight);
    chat_window.scrollTop = chat_window.scrollHeight;
  }

  $.ajax({
        type: "GET",
        url: "https://api.pushshift.io/reddit/topsubs",
        data: "lookback=100",
        success: function(data) {
          var array = data.data;
          for (var i=0; i<array.length; i++) {
            $("#list ul").append('<li><button class=" btn btn-default" id = "roomButton" onclick="joinRoom(\''+array[i].subreddit.toLowerCase()+'\')">'+array[i].subreddit+'<span id="'+array[i].subreddit.toLowerCase()+'" class="badge"></span></button></li>');
          }
          for (var key in serverInfo) {
            $("#"+key).text(serverInfo[key]);
          }
        }
      });

function resetName(){
  deleteCookie('name');
  name = prompt("Please enter your name", name);
  name = name.toLowerCase().replace(/</g,'&lt;');
  chat_name.innerHTML = name.replace(/</g,'&lt;');
  setCookie('name',name.replace(/</g,'&lt;'));
}

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function deleteCookie(cname){
  document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}
function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}