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

exports.addCustomer = function (req, res) {
  var userData = {
    role: "customer",
    email: req.body.email,
    userName: req.body.userName,
    name: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    phoneNumber: req.body.phoneNumber,
    password: req.body.password,
    profileImage: "",
    profileImageKey: "",
    brand: {
      email: req.body.brand.email,
      name: req.body.brand.name,
      category: req.body.brand.category,
      phoneNumber: req.body.brand.phoneNumber,
      address: req.body.brand.address,
    },
  };
  console.log(userData);
  var user = new User(userData);
  user
    .save()
    .then(function (result) {
      res.status(200).json(result);
    })
    .catch(function (error) {
      res.status(409).json(error);
    });
};
