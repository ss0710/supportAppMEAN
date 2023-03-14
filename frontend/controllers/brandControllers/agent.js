///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js"/>

app.controller("brandAdminAgent", [
  "$scope",
  "$http",
  "$location",
  "brandService",
  function ($scope, $http, $location, brandService) {
    brandService.getUserType(function (result, error) {
      if (result) {
        console.log("brandAdmin - Agent Page");
        $scope.brandAdminDetails = result.data;
        console.log($scope.brandAdminDetails);
        console.log($scope.brandAdminDetails.brand.brandId);
        brandService.getBrandAgents(
          $scope.brandAdminDetails.brand.brandId,
          function (result1, error) {
            if (result1) {
              console.log(result1);
              $scope.agentDetails = result1.data;
            } else {
              console.log(data);
            }
          }
        );
      } else {
        console.log(error.data);
      }
    });
  },
]);
