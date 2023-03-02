///<reference path="../app.js" />
///<reference path="../../services/auth/auth.service.js" />

app.controller("login", [
  "$scope",
  "$http",
  "$location",
  "authService",
  function ($scope, $http, $location, authService) {
    console.log("login controller");
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
              console.log(response.data.userDetails);
              if (response.data.userDetails.role == "superAdmin") {
                $location.path("/admin");
              } else if (response.data.userDetails.role == "brandAdmin") {
                $location.path("/brandadmin");
              } else if (response.data.userDetails.role == "manager") {
                $location.path("/brandmanager");
              } else if (response.data.userDetails.role == "agent") {
                $location.path("/brandagent");
              } else {
                $location.path("/home");
              }
            } else {
              alert("Wrong username or password!");
            }
          }
        );
      }
    };
  },
]);
