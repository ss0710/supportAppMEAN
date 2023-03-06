///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js" />

app.controller("activity", [
  "$scope",
  "$http",
  "$location",
  "brandService",
  function ($scope, $http, $location, brandService) {
    var token = localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        if (result.data.role != "brandAdmin") {
          $location.path("/noaccess");
        } else {
          $scope.brandAdminName = result.data.userName;
          $scope.brandAdminEmail = result.data.email;
          $scope.brandId = result.data.brand.brandId;
          $scope.brandName = result.data.brand.name;
          $scope.brandEmail = result.data.brand.email;
          $scope.brandPhoneNumber = result.data.brand.phoneNumber;
          $scope.brandCategory = result.data.brand.category;
          $scope.brandAddress = result.data.brand.address;

          $http
            .get(
              "http://localhost:3000/getnotifications/" + $scope.brandId,
              config
            )
            .then(function (result) {
              $scope.activities = result.data;
            })
            .then(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
]);
