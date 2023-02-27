var Ticket = require("./ticket.model");
var jwt = require("jsonwebtoken");

exports.addTicket = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketData = {
        ticketId: "ticket" + Date.now(),
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
      var ticket = new Ticket(ticketData);
      ticket
        .save()
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(200).json(error);
        });
    }
  });
};

exports.getTickets = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      console.log("get tickets route");
      var feild = req.query.id1;
      var id = req.query.id2;
      console.log("id1" + feild);
      console.log("id2" + id);
      Ticket.find({ feild: id })
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
            agentUserId: req.body.agentId,
            agentName: req.body.agentName,
            status: "Assigned",
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

exports.acceptTicket = function (req, res) {
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
      Ticket.updateOne(
        { ticketId: ticketId },
        {
          $set: {
            status: "resolved",
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
