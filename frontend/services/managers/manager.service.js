///<reference path="../../controllers/app.js" />

app.service("managerService", function ($http) {
  var token = localStorage.getItem("token");
  var config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  };

  //to get user type
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

  //to get agents
  this.getAgents = function (brandId, pageNumber, pageSize, cb) {
    console.log("fetch Api called");
    $http
      .get(
        "http://localhost:3000/getagents?brandId=" +
          brandId +
          "&pageNumber=" +
          pageNumber +
          "&pageSize=" +
          pageSize,
        config
      )
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to add agents
  this.addAgents = function (data, cb) {
    $http
      .post("http://localhost:3000/addagents", data, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get tickets
  //this api is dynamic i.e. we can filter is dynamically by passing two ids
  this.getTickets = function (brandId, cb) {
    $http
      .get("http://localhost:3000/getticketsbybrand/" + brandId, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //getting comments
  this.getComments = function (ticketId, cb) {
    $http
      .get(`http://localhost:3000/getcomments/${ticketId}`, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //add comments
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

  //to add ticket
  this.addTickets = function (ticketData, cb) {
    $http
      .post("http://localhost:3000/addticket", ticketData, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to load agent for modal
  this.loadAgentforModal = function (brandId, cb) {
    $http
      .get(`http://localhost:3000/getagents/${brandId}`, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to assign tickets
  this.assignTicketToAgentService = function (ticketId, agentData, cb) {
    $http
      .put(`http://localhost:3000/updateticket/${ticketId}`, agentData, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
