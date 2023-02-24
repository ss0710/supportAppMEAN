///<reference path="../app.js" />

app.controller("SuperadminBrand", [
  "$scope",
  "$http",
  "$location",
  function ($scope, $http, $location) {
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    var token = localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    $scope.currentBrandsWithAdmin = [];
    $scope.currentBrandsWithNoAdmin = [];

    $http
      .get("http://localhost:3000/getbrands", config)
      .then(function (result) {
        // console.log(result.data);
        var data = result.data;
        data.forEach(function (elem) {
          if (elem.isAdminCreated == true) {
            $scope.currentBrandsWithAdmin.push(elem);
          } else {
            $scope.currentBrandsWithNoAdmin.push(elem);
          }
        });
        console.log($scope.currentBrandsWithAdmin);
        console.log($scope.currentBrandsWithNoAdmin);
      })
      .catch(function (error) {
        console.log(error.data);
      });

    $scope.signupSubmit = function () {
      var data = {
        email: $scope.email,
        name: $scope.name,
        category: $scope.category,
        phoneNumber: $scope.phoneNumber,
        address: $scope.address,
      };
      $http
        .post("http://localhost:3000/addbrand", data, config)
        .then(function (result) {
          alert("successfuly registered");
          window.location.reload;
        })
        .catch(function (error) {
          console.log(error.data);
          alert(error.data);
        });
    };

    //updating brand scopes
    $scope.brandId;
    $scope.email;
    $scope.name;
    $scope.category;
    $scope.phoneNumber;
    $scope.address;
    $scope.updateBrandScopes = function (
      brandId,
      email,
      name,
      category,
      phoneNumber,
      address
    ) {
      $scope.brandId = brandId;
      $scope.email = email;
      $scope.name = name;
      $scope.category = category;
      $scope.phoneNumber = phoneNumber;
      $scope.address = address;
    };

    //add brand Admin
    $scope.addBrandAdmin = function () {
      var data = {
        email: $scope.adminEmail,
        userName: $scope.adminName,
        password: $scope.password,
        brandId: $scope.brandId,
        brandEmail: $scope.email,
        brandName: $scope.name,
        brandCategory: $scope.category,
        brandPhoneNumber: $scope.phoneNumber,
        brandAddress: $scope.address,
      };
      var updatedBrandData = {
        brandId: $scope.brandId,
        email: $scope.email,
        name: $scope.name,
        category: $scope.category,
        address: $scope.address,
        isAdminCreated: true,
        isFirstLogin: false,
        isDisabled: false,
        isDeleted: false,
      };
      $http
        .post("http://localhost:3000/addbrandadmin", data, config)
        .then(function (result) {
          $http
            .put("http://localhost:3000/updatebrand", updatedBrandData, config)
            .then(function (result) {
              alert("Successfully added admin");
            })
            .catch(function (error) {
              console.log("alert");
            });
        })
        .catch(function (error) {
          console.log(error.data);
          alert(error.data);
        });
    };
  },
]);
