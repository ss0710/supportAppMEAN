///<reference path="../../controllers/app.js" />

app.service("agentService", function ($http) {
  var token = localStorage.getItem("token");

  var config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  };

  //getting user type
  this.getUserType = function (cb) {
    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting comments by ticketId
  this.getCommentsByTicketId = function (ticketId, cb) {
    $http
      .get(`http://localhost:3000/getcomments/${ticketId}`, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(error, null);
      });
  };

  //adding comments
  this.addComments = function (commentData, cb) {
    $http
      .post("http://localhost:3000/addcomment", commentData, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to accept the tickets
  this.acceptTickets = function (ticketId, cb) {
    $http
      .put(
        `http://localhost:3000/acceptTicket/${ticketId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json;odata=verbose",
          },
        }
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to resolve tickets
  this.resolveTickets = function (ticketId, cb) {
    $http
      .put(
        `http://localhost:3000/resolveTicket/${ticketId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json;odata=verbose",
          },
        }
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
