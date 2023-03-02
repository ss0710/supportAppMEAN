var User = require("../users/user.model");
var jwt = require("jsonwebtoken");

// ADD BRAND MANAGER CONTROLLER
exports.addBrandManager = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var userData = {
        role: "manager",
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
        brand: {
          brandId: req.body.brandId,
          email: req.body.brandEmail,
          name: req.body.brandName,
          category: req.body.brandCategory,
          phoneNumber: req.body.brandPhoneNumber,
          address: req.body.brandAddress,
        },
        isOnline: req.body.isOnline,
        isDisabled: req.body.isDisabled,
        isDeleted: req.body.isDeleted,
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

// GET BRAND MANAGERS
exports.getBrandManager = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandId = req.params.id;
      User.find({
        isDeleted: false,
        isDisabled: false,
        role: "manager",
        "brand.brandId": brandId,
      })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(200).json(error);
        });
    }
  });
};

//DISABLE BRAND MANAGER
exports.disableBrandManager = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      User.updateOne({ _id: id }, { $set: { isDisabled: true } })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(200).json(error);
        });
    }
  });
};

//PERMIT BRAND MANAGER
exports.permitBrandManager = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      User.updateOne({ _id: id }, { $set: { isDisabled: false } })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(200).json(error);
        });
    }
  });
};
