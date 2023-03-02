///<reference path="../../controllers/app.js" />

app.service("authService", function ($http) {
  var token = localStorage.getItem("token");
  var config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json;odata=verbose",
    },
  };

  //login api
  this.loginApi = function (username, password, cb) {
    $http
      .post("http://localhost:3000/login", {
        username: username,
        password: password,
      })
      .then(function (result) {
        cb(result, null);
      })
      .catch(function (error) {
        cb(null, error);
      });
  };
});
