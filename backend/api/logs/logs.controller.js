var jwt = require("jsonwebtoken");
var Log = require("./log.model");

exports.addLogHistory = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var data = {
        brandId: req.body.brandId,
        ticketId: req.body.ticketId,
        type: "create",
        message: req.body.message,
        userId: req.body.userId,
        userName: req.body.userName,
        comment: "",
        time: Date.now(),
      };
      var log = new Log(data);
      log
        .save()
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getLogsByTicketId = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      Log.find({ ticketId: ticketId })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};
