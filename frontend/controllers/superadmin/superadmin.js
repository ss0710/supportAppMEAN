///<reference path="../app.js" />

app.controller("admin", [
  "$scope",
  "$http",
  "$location",
  function ($scope, $http, $location) {
    var token = localStorage.getItem("token");
    $scope.check = "Sudheer";

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        if (result.data.role != "superAdmin") {
          $location.path("/noaccess");
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    $http
      .get("http://localhost:3000/getbrands", config)
      .then(function (result) {
        // console.log(result.data);
        $scope.currentBrands = result.data;
      })
      .catch(function (error) {
        console.log(error.data);
      });

    $scope.logout = function () {
      localStorage.removeItem("token");
      $location.path("/login");
    };
  },
]);
