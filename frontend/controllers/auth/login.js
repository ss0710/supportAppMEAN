///<reference path="../app.js" />
///<reference path="../../services/auth/auth.service.js" />

app.controller("login", [
  "$scope",
  "$http",
  "$location",
  "authService",
  "$window",
  function ($scope, $http, $location, authService, $window) {
    console.log("login controller");
    var token = localStorage.getItem("token");

    if (token) {
      var config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json;odata=verbose",
        },
      };

      $http
        .get("http://localhost:3000/usertype", config)
        .then(function (response) {
          if (response.data.role == "superAdmin") {
            $location.path("/admin");
          } else if (response.data.role == "brandAdmin") {
            $location.path("/brandadmin");
          } else if (response.data.role == "manager") {
            $location.path("/brandmanager");
          } else if (response.data.role == "agent") {
            $location.path("/brandagent");
          } else {
            $location.path("/home");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      $scope.loginHandler = function () {
        if ($scope.userName && $scope.password) {
          console.log($scope.userName);
          console.log($scope.password);

          authService.loginApi(
            $scope.userName,
            $scope.password,
            function (response, error) {
              if (response) {
                console.log(response.data);
                console.log("setting localStorage");
                localStorage.removeItem("token");
                localStorage.setItem("token", response.data.token);
                window.location.reload();
              } else {
                alert("Wrong username or password!");
              }
            }
          );
        }
      };
    }
  },
]);
