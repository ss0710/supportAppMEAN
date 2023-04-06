var Brand = require("./brand.model");
var User = require("../users/user.model");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");

// getActiveBrand Controller
exports.getActiveBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var pageNumber = parseInt(req.query.pageNumber) || 1;
      var pageSize = parseInt(req.query.pageSize) || 10;

      console.log(pageNumber);
      console.log(pageSize);

      Brand.find({ isDeleted: false, isAdminCreated: true })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec(function (err, data) {
          if (err) {
            res.send(err);
          } else {
            Brand.count({ isDeleted: false, isAdminCreated: true }).exec(
              function (err, count) {
                if (err) {
                  res.send(err);
                } else {
                  console.log(data);
                  res.json({
                    data: data,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    totalCount: count,
                  });
                }
              }
            );
          }
        });
    }
  });
};

//getInActiveBrand
exports.getInActiveBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var pageNumber = parseInt(req.query.pageNumber) || 1;
      var pageSize = parseInt(req.query.pageSize) || 10;

      Brand.find({ isDeleted: false, isAdminCreated: false })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec(function (err, data) {
          if (err) {
            res.send(err);
          } else {
            Brand.count({ isDeleted: false, isAdminCreated: false }).exec(
              function (err, count) {
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
              }
            );
          }
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
      var brandName = req.params.id;
      Brand.find({ idDeleted: false, name: brandName })
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
      var brandName = req.params.id;
      mongoose.startSession().then(function (session) {
        session.startTransaction();
        Promise.all([
          Brand.updateOne({ name: brandName }, { isDeleted: true }),
          User.updateMany({ "brand.name": brandName }, { isDeleted: true }),
        ])
          .then(function (result) {
            res.status(200).json(result);
            session.commitTransaction();
            session.endSession();
          })
          .catch(function (error) {
            session.abortTransaction();
            console.error("Transaction aborted. Error:", error);
            const response = { message: "Delete failed" };
            res.status(500).send(response);
            session.endSession();
          });
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
      var brandName = req.params.id;
      mongoose.startSession().then(function (session) {
        session.startTransaction();
        Promise.all([
          Brand.updateOne({ name: brandName }, { isDisabled: true }),
          User.updateMany({ "brand.name": brandName }, { isDisabled: true }),
        ])
          .then(function (result) {
            res.status(200).json(result);
            session.commitTransaction();
            session.endSession();
          })
          .catch(function (error) {
            session.abortTransaction();
            console.error("Transaction aborted. Error:", error);
            const response = { message: "Delete failed" };
            res.status(500).send(response);
            session.endSession();
          });
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
      var brandName = req.params.id;
      mongoose.startSession().then(function (session) {
        session.startTransaction();
        Promise.all([
          Brand.updateOne({ name: brandName }, { isDisabled: false }),
          User.updateMany({ "brand.name": brandName }, { isDisabled: false }),
        ])
          .then(function (result) {
            res.status(200).json(result);
            session.commitTransaction();
            session.endSession();
          })
          .catch(function (error) {
            session.abortTransaction();
            console.error("Transaction aborted. Error:", error);
            const response = { message: "Delete failed" };
            res.status(500).send(response);
            session.endSession();
          });
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
        name: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        },
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        brand: {
          brandId: req.body.brandId,
          email: req.body.brandEmail,
          name: req.body.brandName,
          category: req.body.brandCategory,
          phoneNumber: req.body.brandPhoneNumber,
          address: req.body.brandAddress,
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
          res.status(403).json(error);
        });
    }
  });
};

exports.searchBrand = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var brandName = req.params.id;
      var regex = new RegExp(brandName, "i");
      Brand.find({
        name: regex,
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
