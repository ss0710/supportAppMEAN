///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js"/>

app.controller("brandAdmin", [
  "$scope",
  "$location",
  "brandService",
  function ($scope, $location, brandService) {
    //to get brandAdmin informations
    brandService.getUserType(function (result, error) {
      console.log("running brandAdmin.js getuserType");
      if (result) {
        if (result.data.role != "brandAdmin") {
          $location.path("/noaccess");
        } else {
          $scope.brandAdminDetails = result.data;
          console.log("brandAdmin");
          console.log($scope.brandAdminDetails);
        }

        brandService.getBrandDetails(
          $scope.brandAdminDetails.brand.name,
          function (result, error) {
            if (result) {
              $scope.brandlogo = result.data[0].brandLogo;
            } else {
              console.log(error);
            }
          }
        );
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
