var User = require("../users/user.model");

exports.passportAuth = function (userName, password, done) {
  console.log("Passport Auth called");
  User.findOne({ userName: userName }, function (err, user) {
    console.log(user);
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (user.password != password) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  });
};
