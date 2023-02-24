var mongoose = require("mongoose");
var addSuperAdminToDb = require("../utils/superAdmin/addSuperAdminToDb");

module.exports = function () {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.set("strictQuery", true);
  //   console.log(process.env.DB);
  mongoose
    .connect(process.env.DB, connectionParams)
    .then(() => {
      console.log("Connected to database successfully");
      addSuperAdminToDb();
    })
    .catch(() => {
      console.log(error);
      console.log("could not connect to database");
    });
};
