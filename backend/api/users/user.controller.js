var jwt = require("jsonwebtoken");
var User = require("./user.model");

exports.getUserType = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  var data = jwt.verify(token, "privatekey");
  console.log(data);
  if (data) {
    res.status(200).json(data.user);
  } else {
    res.status(403).json({ error: "something went wrong" });
  }
};

exports.countMangerandAgent = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.params.id;
      User.aggregate([
        {
          $match: {
            "brand.name": brandName,
          },
        },
        {
          $group: {
            _id: "$role",
            count: {
              $sum: 1,
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

exports.searchUserHandler = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.query.brandName;
      var userName = req.query.userName;
      var regex = new RegExp(userName, "i");
      console.log(brandName);
      console.log(userName);
      User.find({
        $or: [{ role: "manager" }, { role: "agent" }],
        "brand.name": brandName,
        userName: regex,
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
