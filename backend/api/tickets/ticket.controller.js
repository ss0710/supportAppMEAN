var Ticket = require("./ticket.model");
var Notification = require("../notifications/notification.model");
var Log = require("../logs/log.model");
var jwt = require("jsonwebtoken");

exports.addTicket = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = "ticket" + Date.now();
      var ticketData = {
        ticketId: ticketId,
        brandId: req.body.brandId,
        brandName: req.body.brandName,
        status: "Created",
        subject: req.body.subject,
        query: req.body.query,
        createdAt: Date.now(),
        createdByUserID: req.body.createdByUserID,
        createdByUserName: req.body.createdByUserName,
        resolvedAt: "",
        resolvedByUserId: "",
        resilvedByUserName: "",
        agentUserId: "",
        agentName: "",
        customerId: "",
        isDisable: "false",
        isDeleted: "false",
      };

      var not_data = {
        notificationType: "agent",
        brandId: req.body.brandId,
        ticketId: ticketId,
        message:
          req.body.createdByUserName + " created a ticket with Id " + ticketId,
        creator: {
          id: req.body.createdByUserID,
          name: req.body.createdByUserName,
          time: Date.now(),
        },
        receiver: {
          id: "",
          name: "",
        },
        isSeen: false,
      };

      var log_data = {
        brandId: req.body.brandId,
        ticketId: ticketId,
        type: "create",
        message: req.body.createdByUserName + "created the Ticket",
        userId: req.body.createdByUserID,
        userName: req.body.createdByUserName,
        comment: "",
        time: Date.now(),
      };
      var ticket = new Ticket(ticketData);
      ticket
        .save()
        .then(function (ticketResult) {
          //now saving data in notification
          var notification = new Notification(not_data);
          notification
            .save()
            .then(function (notificationResult) {
              //saving log
              var log = new Log(log_data);
              log
                .save()
                .then(function (logResult) {
                  res.status(200).json({
                    ticketResult: ticketResult,
                    notificationResult: notificationResult,
                    logResult: logResult,
                  });
                })
                .catch(function (error) {
                  res.status(403).json(error);
                });
            })
            .catch(function (error) {
              res.status(403).json({ error });
            });
        })
        .catch(function (error) {
          res.status(200).json(error);
        });
    }
  });
};

exports.getTicketsByBrandId = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      console.log("get tickets route");
      var id = req.params.id;
      Ticket.find({ brandId: id })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getTicketsByAgentId = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      console.log("get tickets route by agent id");
      var id = req.params.id;
      console.log(id);
      Ticket.find({ agentUserId: id })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.updateTicket = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;

      var log_data = {
        brandId: req.body.brandId,
        ticketId: ticketId,
        type: "assign",
        message:
          req.body.brandManagerName +
          "assigned ticket to " +
          req.body.agentName,
        userId: req.body.brandManagerId,
        userName: req.body.brandManagerName,
        comment: "",
        time: Date.now(),
      };

      var ticketId = req.params.id;
      var agentId = req.body.agentId;
      var agentName = req.body.agentName;

      Ticket.updateOne(
        { ticketId: ticketId },
        {
          $set: {
            agentUserId: req.body.agentId,
            agentName: req.body.agentName,
            status: "Assigned",
          },
        }
      )
        .then(function (ticketResult) {
          //creating log
          var log = new Log(log_data);
          log
            .save()
            .then(function (logResult) {
              //creating notification
              Notification.updateOne(
                { ticketId: ticketId },
                {
                  $set: { "receiver.id": agentId, "receiver.name": agentName },
                }
              )
                .then(function (NotificationResult) {
                  res.status(200).json({
                    ticketResult: ticketResult,
                    logResult: logResult,
                    NotificationResult: NotificationResult,
                  });
                })
                .catch(function (error) {
                  res.status(403).json(error);
                });
            })
            .catch(function (error) {
              res.status(403).json(error);
            });
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.acceptTicket = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      Ticket.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            status: "Accepted",
          },
        }
      )
        .then(function (TicketResult) {
          //generating notification
          var not_data = {
            notificationType: "manager",
            brandId: TicketResult.brandId,
            ticketId: ticketId,
            message: TicketResult.agentName + "Accepted the ticket",
            creator: {
              id: TicketResult.agentUserId,
              name: TicketResult.agentName,
              time: Date.now(),
            },
            receiver: {
              id: TicketResult.createdByUserID,
              name: TicketResult.createdByUserName,
            },
          };
          var notification = new Notification(not_data);
          notification
            .save()
            .then(function (NotificationResult) {
              res.status(200).json({
                TicketResult: TicketResult,
                NotificationResult: NotificationResult,
              });
              //generating logs
              var log_data = {
                brandId: TicketResult.brandId,
                ticketId: ticketId,
                type: "accept",
                message: TicketResult.agentName + "accepted the ticket",
                userId: TicketResult.agentUserId,
                userName: TicketResult.agentName,
                comment: "",
                time: Date.now(),
              };
              var log = new Log(log_data);
              log
                .save()
                .then(function (logResult) {
                  res.status(200).json({
                    ticketResult: TicketResult,
                    notificationResult: NotificationResult,
                    logResult: logResult,
                  });
                })
                .catch(function (error) {
                  res.status(403).json(error);
                });
            })
            .catch(function (error) {
              res.status(403).json({ error });
            });
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.inProcessTicket = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      Ticket.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            status: "inProcess",
          },
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

exports.resolveTicket = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      Ticket.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            status: "resolved",
          },
        }
      )
        .then(function (TicketResult) {
          //generating logs
          var log_data = {
            brandId: TicketResult.brandId,
            ticketId: ticketId,
            type: "resolve",
            message: TicketResult.agentName + "resolved the ticket",
            userId: TicketResult.agentUserId,
            userName: TicketResult.agentName,
            comment: "",
            time: Date.now(),
          };
          var log = new Log(log_data);
          log
            .save()
            .then(function (logResult) {
              res.status(200).json({ TicketResult });
            })
            .catch(function (error) {
              res.status(403).json(error);
            });
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.closeTicket = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      Ticket.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            status: "Closed",
            resolvedAt: Date.now(),
          },
        }
      )
        .then(function (TicketResult) {
          //generating logs
          var log_data = {
            brandId: TicketResult.brandId,
            ticketId: ticketId,
            type: "close",
            message: TicketResult.createdByUserName + " closed the ticket",
            userId: TicketResult.createdByUserID,
            userName: TicketResult.createdByUserName,
            comment: "",
            time: Date.now(),
          };
          var log = new Log(log_data);
          log
            .save()
            .then(function (logResult) {
              res.status(200).json({ TicketResult });
            })
            .catch(function (error) {
              res.status(403).json(error);
            });
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};
