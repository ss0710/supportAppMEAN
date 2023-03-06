///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js" />

app.controller("manager", [
  "$scope",
  "$http",
  "$location",
  "brandService",
  function ($scope, $http, $location, brandService) {
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

    console.log("manager controller");

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
            .get("http://localhost:3000/getmanager/" + $scope.brandId, config)
            .then(function (result) {
              console.log(result.data);
              $scope.currentManagers = result.data;
              $scope.currentManagerGlobal = result.data;
            })
            .catch(function (error) {
              console.log(error.data);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    $scope.onChangeHandler = function () {
      $scope.currentManagers = $scope.currentManagerGlobal.filter(function (
        elem
      ) {
        return elem.userName.includes($scope.searchManagerName);
      });
    };

    //add brand Managers
    $scope.addBrandManager = function () {
      var formData = new FormData();
      formData.append("image", $scope.formData.image);
      formData.append("email", $scope.managerEmail);
      formData.append("userName", $scope.managerName);
      formData.append("password", $scope.password);
      formData.append("brandId", $scope.brandId);
      formData.append("brandEmail", $scope.brandEmail);
      formData.append("brandName", $scope.brandName);
      formData.append("brandCategory", $scope.brandCategory);
      formData.append("brandPhoneNumber", $scope.brandPhoneNumber);
      formData.append("brandAddress", $scope.brandAddress);

      $http({
        method: "POST",
        url: "http://localhost:3000/addmanager",
        headers: {
          "Content-Type": undefined,
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      }).then(
        function (response) {
          // handle server response
          alert("Successfully added Manager");
        },
        function (error) {
          console.log(error.data);
          alert(error.data);
        }
      );
    };

    $scope.ManagerDetail;
    $scope.managerDetailsupdate = function (details) {
      console.log("clickded");
      $scope.ManagerDetail = details;
      console.log(details);
    };
  },
]);
