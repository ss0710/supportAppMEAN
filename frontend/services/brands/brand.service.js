///<reference path="../../controllers/app.js" />

app.service("brandService", function ($http) {
  var token = localStorage.getItem("token");
  var config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  };

  //to get user type
  this.getUserType = function (cb) {
    console.log("get user type running");
    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get managers
  this.getManager = function (cb) {
    $http
      .get("http://localhost:3000/getmanager", config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to add brand managers
  this.addManager = function (data, cb) {
    $http
      .post("http://localhost:3000/addmanager", data, config)
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };

  //to get brand agent
  this.getBrandAgents = function (brandId, pageNumber, pageSize, cb) {
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
});
