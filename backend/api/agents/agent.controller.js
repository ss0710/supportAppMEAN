var User = require("../users/user.model");
var Ticket = require("../tickets/ticket.model");
var Comment = require("../comments/comment.model");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

//ADD BRAND AGENT
exports.addBrandAgent = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var userData = {
        role: "agent",
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
        brandId: req.body.brandId,
        brand: {
          brandId: req.body.brandId,
          email: req.body.brandEmail,
          name: req.body.brandName,
          category: req.body.brandCategory,
          phoneNumber: req.body.brandPhoneNumber,
          address: req.body.brandAddress,
        },
        isOnline: req.body.isOnline,
        isDisabled: false,
        isDeleted: false,
      };
      var user = new User(userData);
      user
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

//GET BRAND AGENT
exports.getBrandAgents = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var pageNumber = parseInt(req.query.pageNumber) || 1;
      var pageSize = parseInt(req.query.pageSize) || 10;
      var brandName = req.query.brandName;

      // console.log("page number = " + pageNumber);
      // console.log("pageSize = " + pageSize);
      // console.log("brandId = " + brandId);

      User.find({
        isDeleted: false,
        role: "agent",
        "brand.name": brandName,
      })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec(function (err, data) {
          if (err) {
            res.send(err);
          } else {
            User.count({
              isDeleted: false,
              role: "agent",
              "brand.name": brandName,
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
  });
};

//desable agent
exports.disableAgent = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      User.findOneAndUpdate({ _id: id }, { isDisabled: true })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(200).json(result);
        });
    }
  });
};

//enable agent
exports.enableAgents = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      User.findOneAndUpdate({ _id: id }, { isDisabled: false })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(200).json(result);
        });
    }
  });
};

//delete agent
exports.deleteAgents = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      User.findOneAndUpdate({ _id: id }, { isDeleted: true })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(200).json(result);
        });
    }
  });
};

//Search BRAND agents
exports.searchBrandagents = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandId = req.query.brandId;
      var name = req.query.name;
      var regex = new RegExp(name, "i");

      User.find({
        userName: { $regex: regex },
        "brand.brandId": brandId,
        role: "agent",
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

//uodate agent email
exports.updateAgentEmail = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
    }
  });
};
//update agent name
exports.updateAgentName = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandId = req.query.brandId;
      var userId = req.query.userId;
      var name = req.body.userName;
      mongoose.startSession().then(function (session) {
        session.startTransaction();
        Promise.all([
          User.findOneAndUpdate(
            { "brand.brandId": brandId, _id: userId },
            { $set: { userName: name } }
          ),
          Ticket.updateMany(
            { brandId: brandId, agentUserId: userId },
            { $set: { agentName: name } }
          ),
          Comment.updateMany(
            { "brand.brandId": brandId, sentByUserId: userId },
            { $set: { sentByUserName: name } }
          ),
        ])
          .then(function (result) {
            res.status(200).json(result);
            session.commitTransaction();
            session.endSession();
          })
          .catch(function (error) {
            session.abortTransaction();
            console.error("Transaction aborted. Error:", error);
            const response = { message: "Update failed" };
            res.status(500).send(response);
            session.endSession();
          });
      });
    }
  });
};
//update agent password
exports.uodateAgentPassword = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
    }
  });
};
