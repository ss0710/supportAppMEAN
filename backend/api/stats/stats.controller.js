var Ticket = require("../tickets/ticket.model");
var Log = require("../logs/log.model");
var jwt = require("jsonwebtoken");

exports.getManagerStats = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandId = req.params.id;
      Ticket.aggregate([
        {
          $match: {
            brandId: brandId,
          },
        },
        // project only the required fields in a common format
        {
          $project: {
            createdByUserID: 1,
            createdByUserName: 1,
            createdAt: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$createdAt",
              },
            },
            resolvedAt: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: "$resolvedAt",
              },
            },
            status: 1,
          },
        },
        // group the tickets by createdByUserID
        {
          $group: {
            _id: "$createdByUserID",
            createdByUserName: { $first: "$createdByUserName" },
            totalTicketsCreated: { $sum: 1 },
            totalTicketsResolved: {
              $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] },
            },
          },
        },
        // project only the required fields
        {
          $project: {
            _id: 0,
            createdByUserID: "$_id",
            createdByUserName: 1,
            totalTicketsCreated: 1,
            totalTicketsResolved: 1,
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
      Log.aggregate([
        {
          $match: {
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
