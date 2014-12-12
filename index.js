var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var deviceID;

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/three.js', function(req, res){
  res.sendfile('three.js');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
    
    socket.on('disconnect', function( ){
        
        if( deviceID == socket.id ) {
            
            //release the device id
            deviceID = undefined;
            io.emit('device lost');
        }
        
    });
    
    socket.on('chat message', function(msg){
        
        io.emit('chat message', msg);
        
    });
    
    socket.on('device identified', function( ){
        
        if(!deviceID) {
            
            deviceID = socket.id;

            socket.emit('device hello', deviceID);
            io.emit('device found', deviceID);
        }
        
    });
    
    socket.on('device moved', function( obj ){
        
        io.emit('update device data', obj);
        
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


