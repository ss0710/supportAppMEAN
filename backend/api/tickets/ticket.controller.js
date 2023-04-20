var Ticket = require("./ticket.model");
var Notification = require("../notifications/notification.model");
var NotificationController = require("../notifications/notification.controller");
var LogController = require("../logs/logs.controller");
var Log = require("../logs/log.model");
var jwt = require("jsonwebtoken");

var AWS = require("aws-sdk");

AWS.config.update({ region: "ap-northeast-1" });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var queueUrl =
  "https://sqs.ap-northeast-1.amazonaws.com/838998125604/support_queue";

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
        brand: {
          name: req.body.brandName,
          email: req.body.brandEmail,
        },
        status: "Created",
        subject: req.body.subject,
        query: req.body.query,
        createdBy: {
          name: req.body.createdByUserName,
          email: req.body.createdByUserEmail,
          createdAt: Date.now(),
        },
        resolvedBy: {
          name: "",
          email: "",
          resolvedAt: null,
        },
        agent: {
          name: "",
          email: "",
        },
        customer: {
          name: "",
          email: "",
          createdAt: null,
        },
      };

      const params = {
        MessageBody: JSON.stringify(ticketData),
        QueueUrl: queueUrl,
      };

      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.MessageId);
        }
      });

      var ticket = new Ticket(ticketData);
      ticket
        .save()
        .then(function (ticketResult) {
          //now saving data in notification
          NotificationController.addNotification(
            "manager",
            req.body.brandName,
            req.body.brandEmail,
            req.body.createdByUserName,
            req.body.createdByUserName +
              " created a ticket with Id " +
              ticketId,
            ""
          );
          //saving log
          LogController.addLogHistory(
            req.body.brandName,
            req.body.brandEmail,
            ticketId,
            "create",
            req.body.createdByUserName,
            "manager",
            req.body.createdByUserName + " created the Ticket"
          );

          res.status(200).json({
            ticketResult: ticketResult,
          });
        })
        .catch(function (error) {
          console.log(error);
          res.status(403).json(error);
        });
    }
  });
};

exports.addCustomerQuery = function (req, res) {
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
        brand: {
          name: req.body.brandName,
          email: req.body.brandEmail,
        },
        status: "Created",
        subject: req.body.subject,
        query: req.body.query,
        createdBy: {
          name: "",
          email: "",
          createdAt: null,
        },
        resolvedBy: {
          name: "",
          email: "",
          resolvedAt: null,
        },
        agent: {
          name: "",
          email: "",
        },
        customer: {
          name: req.body.customerName,
          email: req.body.customerEmail,
          createdAt: Date.now(),
        },
      };

      console.log("add query api");
      console.log(ticketData);

      var ticket = new Ticket(ticketData);
      ticket
        .save()
        .then(function (ticketResult) {
          //now saving data in notification
          NotificationController.addNotification(
            "manager",
            req.body.brandName,
            req.body.brandEmail,
            req.body.customerName,
            req.body.customerName + " raised a query " + ticketId,
            ""
          );
          //saving log
          LogController.addLogHistory(
            req.body.brandName,
            req.body.brandEmail,
            ticketId,
            "create",
            req.body.customerName,
            "manager",
            req.body.customerName + " raised the query"
          );

          res.status(200).json({
            ticketResult: ticketResult,
          });
        })
        .catch(function (error) {
          console.log(error);
          res.status(403).json(error);
        });
    }
  });
};

exports.getrequestedQueries = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var customerName = req.params.id;
      Ticket.find({
        "customer.createdAt": { $ne: null },
        status: { $ne: "Closed" },
        "customer.name": customerName,
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

exports.getSolvedQueries = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var customerName = req.params.id;
      Ticket.find({
        "customer.createdAt": { $ne: null },
        status: "Closed",
        "customer.name": customerName,
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

exports.getCustomersQueries = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.params.id;
      Ticket.find({
        "customer.createdAt": { $ne: null },
        status: "Created",
        "brand.name": brandName,
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

exports.assignCustomersQueries = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var data = req.body;
      Ticket.updateOne(
        {
          "brand.name": data.brandName,
          "customer.name": data.customerName,
        },
        {
          "createdBy.name": data.managerName,
          "createdBy.email": data.managerEmail,
          "createdBy.createdAt": Date.now(),
          "agent.name": data.agentName,
          "agent.email": data.agentEmail,
          status: "Assigned",
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

exports.getTicketsByBrandIdAndManagerId = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      console.log("get tickets route");
      var brandName = req.query.brandName;
      var managerName = req.query.managerName;
      var status = req.query.status;
      var pageNumber = req.query.pageNumber;
      var pageSize = req.query.pageSize;

      if (status == "Created") {
        Ticket.find({
          "brand.name": brandName,
          "createdBy.name": managerName,
          $or: [
            { status: "Created" },
            { status: "Assigned" },
            { status: "Accepted" },
            { status: "Rejected" },
          ],
        })
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .exec(function (err, data) {
            if (err) {
              res.send(err);
            } else {
              Ticket.count({
                "brand.name": brandName,
                "createdBy.name": managerName,
                $or: [
                  { status: "Created" },
                  { status: "Assigned" },
                  { status: "Accepted" },
                  { status: "Rejected" },
                ],
              }).exec(function (err, count) {
                if (err) {
                  res.send(err);
                } else {
                  res.json({
                    data: data,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    totalCount: count,
                  });
                }
              });
            }
          });
      } else {
        console.log("running second");
        console.log(brandName);
        console.log(managerName);
        console.log(status);
        Ticket.find({
          "brand.name": brandName,
          "createdBy.name": managerName,
          status: status,
        })
          .skip((pageNumber - 1) * pageSize)
          .limit(pageSize)
          .exec(function (err, data) {
            if (err) {
              res.send(err);
            } else {
              Ticket.count({
                "brand.name": brandName,
                "createdBy.name": managerName,
                status: status,
              }).exec(function (err, count) {
                if (err) {
                  res.send(err);
                } else {
                  res.json({
                    data: data,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    totalCount: count,
                  });
                }
              });
            }
          });
      }
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
      var name = req.params.id;
      console.log("fetching titi");
      console.log(name);
      Ticket.find({ "agent.name": name })
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
      Ticket.updateOne(
        { ticketId: ticketId },
        {
          $set: {
            "agent.name": req.body.agentName,
            "agent.email": req.body.agentEmail,
            status: "Assigned",
          },
        }
      )
        .then(function (ticketResult) {
          //creating log
          //now saving data in notification

          NotificationController.addNotification(
            "agent",
            req.body.brandName,
            req.body.brandEmail,
            req.body.brandManagerName,
            req.body.brandManagerName + " assigned you " + ticketId,
            req.body.agentName
          );
          LogController.addLogHistory(
            req.body.brandName,
            req.body.brandEmail,
            ticketId,
            "assign",
            req.body.brandManagerName,
            req.body.userType,
            req.body.brandManagerName +
              " assigned " +
              ticketId +
              " to " +
              req.body.agentName
          );

          res.status(200).json({
            ticketResult: ticketResult,
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
          console.log("Accept controller");
          console.log(TicketResult);
          NotificationController.addNotification(
            "manager",
            TicketResult.brand.name,
            TicketResult.brand.email,
            TicketResult.agent.name,
            TicketResult.agent.name + " Accepted the ticket",
            TicketResult.createdBy.name
          );

          LogController.addLogHistory(
            TicketResult.brand.name,
            TicketResult.brand.email,
            ticketId,
            "accept",
            TicketResult.agent.name,
            "agent",
            TicketResult.agent.name + " accepted the ticket"
          );

          console.log("Ticket result");
          console.log(TicketResult);

          res.status(200).json({
            TicketResult: TicketResult,
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
          console.log("inprocess ticket");
          NotificationController.addNotification(
            "agent",
            result.brand.name,
            result.brand.email,
            result.createdBy.name,
            result.createdBy.name +
              " changed status to INPROCESS of " +
              result.ticketId,
            result.agent.name
          );
          LogController.addLogHistory(
            result.brand.name,
            result.brand.email,
            result.ticketId,
            "inprocess",
            result.createdBy.name,
            "manager",
            result.createdBy.name + " changed status to In process "
          );
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.inProcessTicketByAgent = function (req, res) {
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
          console.log("inprocess ticket");
          NotificationController.addNotification(
            "manager",
            result.brand.name,
            result.brand.email,
            result.agent.name,
            result.agent.name +
              " changed status to INPROCESS of " +
              result.ticketId,
            result.createdBy.name
          );
          LogController.addLogHistory(
            result.brand.name,
            result.brand.email,
            result.ticketId,
            "inprocess",
            result.agent.name,
            "agent",
            result.agent.name + " changed status to In process "
          );
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
      var ticketId = req.query.ticketId;
      var name = req.query.name;
      var email = req.query.email;
      Ticket.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            status: "resolved",
            "resolvedBy.name": name,
            "resolvedBy.email": email,
            "resolvedBy.resolvedAt": Date.now(),
          },
        }
      )
        .then(function (result) {
          NotificationController.addNotification(
            "agent",
            result.brand.name,
            result.brand.email,
            result.createdBy.name,
            result.createdBy.name +
              " changed status to RESOLVED of " +
              result.ticketId,
            result.agent.name
          );
          LogController.addLogHistory(
            result.brand.name,
            result.brand.email,
            result.ticketId,
            "inprocess",
            result.createdBy.name,
            "manager",
            result.createdBy.name + " changed status to resolved "
          );
          res.status(200).json(result);
        })
        .catch(function (error) {
          console.log("error");
          console.log(error);
          res.status(403).json(error);
        });
    }
  });
};

exports.resolveTicketByAgent = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.query.ticketId;
      var name = req.query.name;
      var email = req.query.email;
      Ticket.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: {
            status: "resolved",
            "resolvedBy.name": name,
            "resolvedBy.email": email,
            "resolvedBy.resolvedAt": Date.now(),
          },
        }
      )
        .then(function (result) {
          NotificationController.addNotification(
            "manager",
            result.brand.name,
            result.brand.email,
            result.agent.name,
            result.agent.name +
              " changed status to RESOLVED of " +
              result.ticketId,
            result.createdBy.name
          );
          LogController.addLogHistory(
            result.brand.name,
            result.brand.email,
            result.ticketId,
            "inprocess",
            result.agent.name,
            "agent",
            result.agent.name + " changed status to resolved "
          );
          res.status(200).json(result);
        })
        .catch(function (error) {
          console.log("error");
          console.log(error);
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
        .then(function (result) {
          //generating logs
          NotificationController.addNotification(
            "agent",
            result.brand.name,
            result.brand.email,
            result.createdBy.name,
            result.createdBy.name + " closed " + result.ticketId,
            result.agent.name
          );
          LogController.addLogHistory(
            result.brand.name,
            result.brand.email,
            result.ticketId,
            "close",
            result.createdBy.name,
            "manager",
            result.createdBy.name + " closed the ticket "
          );

          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.rejectTicket = function (req, res) {
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
            status: "Rejected",
          },
        }
      )
        .then(function (result) {
          //generating logs
          NotificationController.addNotification(
            "agent",
            result.brand.name,
            result.brand.email,
            result.createdBy.name,
            result.createdBy.name + " closed " + result.ticketId,
            result.agent.name
          );
          LogController.addLogHistory(
            result.brand.name,
            result.brand.email,
            result.ticketId,
            "close",
            result.createdBy.name,
            "manager",
            result.createdBy.name + " closed the ticket "
          );

          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getRejectedTickets = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.query.brandName;
      var agentName = req.query.agentName;

      Ticket.find({
        "brand.name": brandName,
        "agent.name": agentName,
        status: "Rejected",
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

exports.filterTickets = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.query.brandName;
      var status = req.query.status;
      var managerName = req.query.managername;
      var agentName = req.query.agentname;
      var pageNumber = req.query.pageNumber;
      var pageSize = req.query.pageSize;

      console.log(brandName);
      console.log(status);
      console.log(managerName);

      var filter = {};
      if (brandName) {
        filter["brand.name"] = brandName;
      }
      if (status) {
        filter.status = status;
      }
      if (managerName) {
        filter["createdBy.name"] = managerName;
      }
      if (agentName) {
        filter["agent.name"] = agentName;
      }
      console.log(filter);

      Ticket.find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec(function (err, data) {
          if (err) {
            res.send(err);
          } else {
            Ticket.count(filter).exec(function (err, count) {
              if (err) {
                res.send(err);
              } else {
                res.json({
                  data: data,
                  pageNumber: pageNumber,
                  pageSize: pageSize,
                  totalCount: count,
                });
              }
            });
          }
        });
    }
  });
};

exports.getAgentClosedTickets = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.query.brandName;
      var agentName = req.query.agentName;

      Ticket.find({
        "brand.name": brandName,
        "agent.name": agentName,
        status: "Closed",
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
