var jwt = require("jsonwebtoken");

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
