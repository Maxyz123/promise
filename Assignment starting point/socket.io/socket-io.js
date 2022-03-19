
exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    try {
     // insert here your event
      /***
       * Creates and join
       */
      socket.on('create or join', function (room, userId, imageURL){
      socket.join(room);
      io.sockets.to(room).emit('joined', room, userId, imageURL);
      });

      socket.on('report',function (room,userId,reportText,imageURL){
      io.sockets.to(room).emit('report',room,userId,reportText,imageURL);
      });

      socket.on('chat', function (room,userId,chatText){
        io.sockets.to(room).emit('chat',room,userId,chatText);
      })

      socket.on('disconnect',function (room, userId){
      console.log("Room: "+room+" User ID: "+userId+" has disconnected.")
      });


    } catch (e) {
    }
  });
}