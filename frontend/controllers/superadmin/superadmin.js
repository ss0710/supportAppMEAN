///<reference path="../app.js" />
///<reference path="../../services/superadmin/superadmin.service.js"/>

app.controller("admin", [
  "$scope",
  "$location",
  "superadminService",
  function ($scope, $location, superadminService) {
    //getting userType
    superadminService.getUserType(function (result, error) {
      if (result) {
        if (result.data.role != "superAdmin") {
          $location.path("/noaccess");
        }
      } else {
        console.log(error);
      }
    });

    //logout function
    $scope.logout = function () {
      localStorage.removeItem("token");
      $location.path("/login");
    };
  },
]);
