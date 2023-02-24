var Comment = require("./comment.model");
var jwt = require("jsonwebtoken");

//adding comment
exports.addComment = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var data = {
        commentId: "comment" + Date.now(),
        ticketId: req.body.ticketId,
        ticketSubject: req.body.ticketSubject,
        ticketQuery: req.body.ticketQuery,
        content: req.body.content,
        sentByUserId: req.body.sentByUserId,
        sentByUserName: req.body.sentByUserName,
        sentByUserType: req.body.sentByUserType,
        brand: {
          brandId: req.body.brandId,
          email: req.body.brandEmail,
          name: req.body.brandName,
          category: req.body.brandCategory,
        },
        dateAndTime: Date.now(),
        isDeleted: req.body.isDeleted,
      };
      var comment = new Comment(data);
      comment
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

//get comments by ticket id
exports.getComments = function (req, res) {
  var t = req.headers["authorization"];
  var tokenArray = t.split(" ");
  var token = tokenArray[1];
  jwt.verify(token, "privatekey", (err, authorizedData) => {
    if (err) {
      res.sendStatus(403).json({ error: "not authenticated user" });
    } else {
      var ticketId = req.params.id;
      Comment.find({ ticketId: ticketId })
        .then(function (result) {
          res.status(200).json(result);
        })
        .catch(function (error) {
          res.status(403).json(error);
        });
    }
  });
};
