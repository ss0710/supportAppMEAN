var Comment = require("./comment.model");
var jwt = require("jsonwebtoken");
var SocketFile = require("../../services/socket/socket");

//adding comment
exports.addComment = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var data = {
        brand: {
          name: req.body.brandName,
          email: req.body.brandEmail,
        },
        ticketId: req.body.ticketId,
        content: req.body.content,
        sentBy: {
          userName: req.body.sentByUserName,
          email: req.body.sentByUserEmail,
          type: req.body.sentByUserType,
        },
        time: Date.now(),
        isDeleted: false,
      };
      var comment = new Comment(data);
      comment
        .save()
        .then(function (result) {
          SocketFile.getIoInstance().sockets.emit("comment", result);
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

//get comments by ticket id
exports.getComments = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      Comment.find({ ticketId: ticketId })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};
