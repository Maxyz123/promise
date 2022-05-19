
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
      });

      socket.on('draw', function ( room, userId, width, height, prevX, prevY, currX, currY, color, thickness, imgUrl){
        io.sockets.to(room).emit('draw', room, userId, width,height, prevX, prevY, currX, currY, color, thickness, imgUrl)
      });

      socket.on('drawOnPanel', function ( room, userId, width, height, prevX, prevY, currX, currY, color, thickness){
        io.sockets.to(room).emit('drawPanel', room, userId, width,height, prevX, prevY, currX, currY, color, thickness)
      });

      socket.on('clearCanvas',function (room, userId){
        io.sockets.to(room).emit('clearCanvas',room,userId);
      });

      socket.on('Search',function (room,name,resultId,resultName,resultImg,resultDescription,resultUrl,resultPanel){
        io.sockets.to(room).emit('searchPanel',room,name,resultId,resultName,resultImg,resultDescription,resultUrl,resultPanel)
      });

      socket.on('disconnect',function (room, userId){
      console.log("Room: "+room+" User ID: "+userId+" has disconnected.")
      });


    } catch (e) {
    }
  });
}
