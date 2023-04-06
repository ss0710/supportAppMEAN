///<reference path="../../controllers/app.js" />

app.service("socketService", function () {
  console.log("socket service called");

  var socket = null;
  socket = io("http://localhost:3000/");

  socket.on("message1", (data) => {
    console.log(data);
  });

  this.getSocketInstance = function () {
    if (socket != null) {
      return socket;
    }
  };
});
