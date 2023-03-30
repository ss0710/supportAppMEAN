var Ticket = require("../tickets/ticket.model");
var Log = require("../logs/log.model");
var Brand = require("../brands/brand.model");
var User = require("../users/user.model");
var File = require("../files/file.model");
const async = require("async");
var jwt = require("jsonwebtoken");

exports.getManagerStats = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.params.id;
      Ticket.aggregate([
        {
          $match: {
            "brand.name": brandName,
          },
        },
        {
          $group: {
            _id: "$createdBy.name",
            ticketsCreated: { $sum: 1 },
            ticketsClosed: {
              $sum: {
                $cond: { if: { $eq: ["$status", "Closed"] }, then: 1, else: 0 },
              },
            },
          },
        },
      ])
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getTicketActivityDetails = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.params.id;
      console.log("brand name = " + brandName);
      Log.aggregate([
        {
          $match: {
            "brand.name": brandName,
            type: { $in: ["create", "resolve", "close"] },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$time" },
              month: { $month: "$time" },
              day: { $dayOfMonth: "$time" },
              type: "$type",
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            type: "$_id.type",
            count: 1,
          },
        },
        {
          $sort: {
            year: 1,
            month: 1,
            day: 1,
          },
        },
      ])
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getBrandStats = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      Promise.all([
        Brand.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
        ]),
        Brand.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: 1,
          },
        ]),
        User.aggregate([
          {
            $group: {
              _id: "$brand.name",
              count: { $sum: 1 },
              brandName: { $first: "$brand.name" },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: 5,
          },
        ]),
        Ticket.aggregate([
          {
            $group: {
              _id: "$brand.name",
              count: { $sum: 1 },
              brandName: { $first: "$brand.name" },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: 3,
          },
        ]),
        User.countDocuments(),
        Ticket.countDocuments(),
      ])
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.getTicketStats = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.params.id;
      Promise.all([
        Ticket.aggregate([
          {
            $match: {
              "brand.name": brandName,
              "resolvedBy.resolvedAt": { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              averageSolvingTime: {
                $avg: {
                  $subtract: ["$resolvedBy.resolvedAt", "$createdBy.createdAt"],
                },
              },
            },
          },
        ]),
        Ticket.aggregate([
          {
            $match: {
              "brand.name": brandName,
              "resolvedBy.resolvedAt": { $exists: true },
            },
          },
          {
            $group: {
              _id: "$createdBy.name",
              avgSolvingTime: {
                $avg: {
                  $subtract: ["$resolvedBy.resolvedAt", "$createdBy.createdAt"],
                },
              },
            },
          },
          {
            $sort: {
              avgSolvingTime: 1,
            },
          },
          {
            $limit: 3,
          },
        ]),
        Ticket.aggregate([
          {
            $match: {
              "brand.name": brandName,
              "resolvedBy.resolvedAt": { $exists: true },
            },
          },
          {
            $group: {
              _id: "$agent.name",
              avgSolvingTime: {
                $avg: {
                  $subtract: ["$resolvedBy.resolvedAt", "$createdBy.createdAt"],
                },
              },
            },
          },
          {
            $match: {
              avgSolvingTime: { $ne: null },
            },
          },
          {
            $sort: {
              avgSolvingTime: 1,
            },
          },
          {
            $limit: 3,
          },
        ]),
      ])
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.userActivityStat = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.query.brandName;
      var userName = req.query.userName;
      console.log(brandName);
      console.log(userName);
      Log.aggregate([
        {
          $match: {
            "brand.name": brandName,
            "creator.userName": userName,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$time" },
              month: { $month: "$time" },
              day: { $dayOfMonth: "$time" },
              user: "$creator.userName",
            },
            count: { $sum: 1 },
          },
        },
      ])
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

exports.userProfileStats = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.query.brandName;
      var userName = req.query.userName;

      console.log(brandName);
      console.log(userName);

      async.waterfall(
        [
          function (callback) {
            User.find({
              "brand.name": brandName,
              userName: userName,
            })
              .then(function (result1) {
                callback(null, result1);
              })
              .catch(function (error1) {
                callback(error1, null);
              });
          },
          function (userResult, callback) {
            if (userResult[0].role == "manager") {
              Ticket.aggregate([
                {
                  $match: {
                    "brand.name": brandName,
                    "createdBy.name": userName,
                  },
                },
                {
                  $group: {
                    _id: "$createdBy.name",
                    ticketsCreated: { $sum: 1 },
                    ticketsClosed: {
                      $sum: {
                        $cond: {
                          if: { $eq: ["$status", "Closed"] },
                          then: 1,
                          else: 0,
                        },
                      },
                    },
                  },
                },
              ])
                .then(function (result2) {
                  var result = {
                    userData: userResult,
                    ticketStats: result2,
                  };
                  callback(null, result);
                })
                .catch(function (error2) {
                  callback(error2, null);
                });
            } else {
              Ticket.aggregate([
                {
                  $match: {
                    "brand.name": brandName,
                    "agent.name": userName,
                  },
                },
                {
                  $group: {
                    _id: "$agent.name",
                    ticketsCreated: { $sum: 1 },
                    ticketsClosed: {
                      $sum: {
                        $cond: {
                          if: { $eq: ["$status", "Closed"] },
                          then: 1,
                          else: 0,
                        },
                      },
                    },
                  },
                },
              ])
                .then(function (result2) {
                  var result = {
                    userData: userResult,
                    ticketStats: result2,
                  };
                  callback(null, result);
                })
                .catch(function (error2) {
                  callback(error2, null);
                });
            }
          },
        ],
        function (err, results) {
          // console.log(results);
          res.status(200).json(results);
        }
      );
    }
  });
};

exports.brandDashboardDetails = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.params.id;

      async.waterfall(
        [
          function (callback) {
            Brand.find({
              name: brandName,
            })
              .then(function (result1) {
                callback(null, result1);
              })
              .catch(function (error1) {
                callback(error1, null);
              });
          },
          function (brandResult, callback) {
            User.find({
              role: "brandAdmin",
              "brand.name": brandName,
            })
              .then(function (result2) {
                var obj = {
                  brand: brandResult,
                  admin: result2,
                };
                callback(null, obj);
              })
              .catch(function (error2) {
                callback(error2, null);
              });
          },
          function (result, callback) {
            User.countDocuments({
              role: "manager",
              "brand.name": brandName,
            })
              .then(function (managerCount) {
                var obj = {
                  brand: result.brand,
                  admin: result.admin,
                  managerCount: managerCount,
                };
                callback(null, obj);
              })
              .catch(function (error3) {
                callback(error3, null);
              });
          },
          function (result, callback) {
            User.countDocuments({
              role: "manager",
              "brand.name": brandName,
            })
              .then(function (agentCount) {
                result.agentCount = agentCount;
                callback(null, result);
              })
              .catch(function (error4) {
                callback(error4, null);
              });
          },
          function (result, callback) {
            Ticket.countDocuments({
              "brand.name": brandName,
            })
              .then(function (ticketCount) {
                result.ticketCount = ticketCount;
                callback(null, result);
              })
              .catch(function (error4) {
                callback(error4, null);
              });
          },
          function (result, callback) {
            File.countDocuments({
              "brand.name": brandName,
            })
              .then(function (fileCount) {
                result.fileCount = fileCount;
                callback(null, result);
              })
              .catch(function (error4) {
                callback(error4, null);
              });
          },
        ],
        function (err, results) {
          res.status(200).json(results);
        }
      );
    }
  });
};
