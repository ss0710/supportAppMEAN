require("dotenv").config();
var User = require("../../api/users/user.model");

module.exports = function () {
  var admin = {
    role: "superAdmin",
    email: "admin@gmail.com",
    userName: process.env.SUPER_ADMIN_USERNAME,
    password: process.env.SUPER_ADMIN_PASSWORD,
    brandId: "",
    isDisabled: false,
    isDeleted: false,
  };
  User.findOne({ userName: "superadmin" }).then(function (res) {
    console.log(res);
    if (res == null) {
      var user = new User(admin);
      user
        .save()
        .then(function (result) {
          console.log("Admin added successfully");
        })
        .catch(function (error) {
          console.log(error);
          console.log("Admin not added");
        });
    } else {
      console.log("admin Already exist");
    }
  });
};
