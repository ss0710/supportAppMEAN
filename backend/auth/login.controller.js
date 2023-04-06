var jwt = require("jsonwebtoken");
var User = require("../api/users/user.model");
var Brand = require("../api/brands/brand.model");

module.exports = function (req, res) {
  User.findOne({ userName: req.body.username })
    .then(function (result) {
      var user = result;
      console.log("inside login controller");
      if (result.isDeleted == true) {
        res.status(404).json({ error: "Account not Found" });
      } else if (result.isDisabled == true) {
        res
          .status(404)
          .json({ error: "Account is disabled!! Please contact Admin" });
      } else {
        jwt.sign({ user }, "privatekey", { expiresIn: "1h" }, (err, token) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            userDetails: user,
            token: token,
          });
        });
      }
    })
    .catch(function (error) {
      res.status(403).json({ error: error });
    });
};
