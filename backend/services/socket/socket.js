var io = null;

exports.socketConnection = function (server) {
  console.log("called connection method");
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", function (socket) {
    console.log("connection made");
    console.log(socket.id);
  });

  return io;
};

exports.getIoInstance = function () {
  if (io != null) {
    return io;
  }
};
