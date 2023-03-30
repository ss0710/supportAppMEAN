var jwt = require("jsonwebtoken");
var Log = require("./log.model");

exports.addLogHistory = function (
  brandName,
  brandEmail,
  ticketId,
  type,
  creatorUserName,
  creatorType,
  message
) {
  var log_data = {
    brand: {
      name: brandName,
      email: brandEmail,
    },
    ticketId: ticketId,
    type: type,
    creator: {
      userName: creatorUserName,
      type: creatorType,
    },
    message: message,
    time: Date.now(),
  };
  var log = new Log(log_data);
  log
    .save()
    .then(function (result) {
      console.log("log succefully created");
    })
    .catch(function (error) {
      console.log("error creating log");
      console.log(error);
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
