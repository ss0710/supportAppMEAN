///<reference path="../../controllers/app.js" />

app.service("statsService", function ($http) {
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

  //getting manager and agent count
  this.getManagerAndAgentCount = function (brandId, cb) {
    $http
      .get("http://localhost:3000/countManagerAgent/" + brandId, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, result);
      });
  };

  //getting managers details
  this.getManagerStats = function (brandId, cb) {
    $http
      .get("http://localhost:3000/managerstats/" + brandId, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
