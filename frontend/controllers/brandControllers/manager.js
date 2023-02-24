///<reference path="../app.js" />

app.controller("manager", [
  "$scope",
  "$http",
  "$location",
  function ($scope, $http, $location) {
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    $scope.currentManagers = [];

    var token = localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    //to get brandAdmin informations
    $scope.brandAdminName,
      $scope.brandAdminEmail,
      $scope.brandId,
      $scope.brandName,
      $scope.brandEmail,
      $scope.brandPhoneNumber,
      $scope.brandCategory,
      $scope.brandAddress;

    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        console.log(result.data);
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
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    $http
      .get("http://localhost:3000/getmanager", config)
      .then(function (result) {
        console.log(result.data);
        $scope.currentManagers = result.data;
      })
      .catch(function (error) {
        console.log(error.data);
      });

    //add brand Managers
    $scope.addBrandManager = function () {
      var data = {
        email: $scope.managerEmail,
        userName: $scope.managerName,
        password: $scope.password,
        brandId: $scope.brandId,
        brandEmail: $scope.brandEmail,
        brandName: $scope.brandName,
        brandCategory: $scope.brandCategory,
        brandPhoneNumber: $scope.brandPhoneNumber,
        brandAddress: $scope.brandAddress,
      };
      $http
        .post("http://localhost:3000/addmanager", data, config)
        .then(function (result) {
          alert("Successfully added Manager");
        })
        .catch(function (error) {
          console.log(error.data);
          alert(error.data);
        });
    };
  },
]);
