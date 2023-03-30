var jwt = require("jsonwebtoken");
var Notification = require("./notification.model");

exports.addNotification = function (
  type,
  brandName,
  brandEmail,
  createdByUserName,
  message,
  receiver
) {
  var not_data = {
    notificationType: type,
    brand: {
      name: brandName,
      email: brandEmail,
    },
    message: message,
    creator: {
      userName: createdByUserName,
      time: Date.now(),
    },
    receiver: {
      userName: receiver,
    },
  };
  var notification = new Notification(not_data);
  notification
    .save()
    .then(function (result) {
      console.log("notification succefully created");
    })
    .catch(function (error) {
      console.log("error creating notification");
      console.log(error);
    });
};

exports.getNotificationByBrandId = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandId = req.params.id;
      Notification.find({ brandId: brandId })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.assignNotification = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      var agentId = req.body.agentId;
      var agentName = req.body.agentName;
      Notification.updateOne(
        { ticketId: ticketId },
        {
          $set: { "receiver.id": agentId, "receiver.name": agentName },
        }
      )
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getAgentNotification = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var agentName = req.params.id;
      console.log("notification");
      console.log(agentName);
      Notification.find({
        notificationType: "agent",
        "receiver.userName": agentName,
        isSeen: false,
      })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getManagerNotification = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var managerName = req.params.id;
      Notification.find({ "receiver.userName": managerName, isSeen: false })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.markOneNotificationSeen = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var not_id = req.params.id;
      Notification.findOneAndUpdate({ _id: not_id }, { $set: { isSeen: true } })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.markAllManagerNotSeen = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      Notification.updateMany(
        { notificationType: "manager" },
        { $set: { isSeen: true } }
      )
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.markAllAgentNotSeen = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      Notification.updateMany(
        { notificationType: "agent" },
        { $set: { isSeen: true } }
      )
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};
