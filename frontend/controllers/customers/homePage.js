///<reference path="../app.js" />

app.controller("customerHomePage", [
  "$scope",
  "$location",
  function ($scope, $location) {
    //logout function
    $scope.logout = function () {
      console.log("logout function called");
      localStorage.removeItem("token");
      $location.path("/home");
    };
  },
]);
