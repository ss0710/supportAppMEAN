///<reference path="../app.js" />

app.controller("login", [
  "$scope",
  "$http",
  "$location",
  function ($scope, $http, $location) {
    $scope.loginHandler = function () {
      if ($scope.userName && $scope.password) {
        console.log($scope.userName);
        console.log($scope.password);
        $http
          .post("http://localhost:3000/login", {
            username: $scope.userName,
            password: $scope.password,
          })
          .then(
            function (response) {
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
            },
            function (error) {
              alert("Wrong username or password!");
            }
          );
      }
    };
  },
]);
