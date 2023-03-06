var Brand = require("./brand.model");
var User = require("../users/user.model");
var jwt = require("jsonwebtoken");

// getBrand Controller
exports.getBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      Brand.find({ isDeleted: false })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

// getBrandById Controller
exports.getBrandById = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      Brand.find({ idDeleted: false, brandId: id })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

// addBrand Controller
exports.addBrand = function (s3Result, body) {
  // var t = req.headers["authorization"];
  // var tokenArray = t.split(" ");
  // var token = tokenArray[1];
  // jwt.verify(token, "privatekey", (err, authorizedData) => {
  //   if (err) {
  //     res.sendStatus(403).json({ error: "not authenticated user" });
  //   } else {
  //   }
  // });
};

// deleteBrand Controller
exports.deleteBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      Brand.updateOne({ brandId: id }, { isDeleted: true })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

// disableBrand Controller
exports.disableBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      Brand.updateOne({ brandId: id }, { isDisabled: true })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

// EnableBrand Controller
exports.enableBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var id = req.params.id;
      Brand.updateOne({ brandId: id }, { isDisabled: false })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

// update Controller
exports.updateBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandData = {
        brandId: req.body.brandId,
        email: req.body.email,
        name: req.body.name,
        category: req.body.category,
        address: req.body.address,
        isAdminCreated: req.body.isAdminCreated,
        isFirstLogin: req.body.isFirstLogin,
        isDisabled: req.body.isDisabled,
        isDeleted: req.body.isDeleted,
      };
      Brand.updateOne({ brandId: req.body.brandId }, brandData)
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};

//add brand admins
exports.addBrandAdmin = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var userData = {
        role: "brandAdmin",
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
      console.log(userData);
      var user = new User(userData);
      user
        .save()
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};
