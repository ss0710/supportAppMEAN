///<reference path="../app.js" />
///<reference path="../../services/superadmin/superadmin.service.js"/>

app.controller("SuperadminBrand", [
  "$scope",
  "$http",
  "$location",
  "superadminService",
  function ($scope, $http, $location, superadminService) {
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

    //Update Handler for Modal details
    $scope.brandDataUpdatesForModal = function (item) {
      console.log(item);
      $scope.brandDetails = item;
    };

    //getting brands
    superadminService.getBrands(function (result, error) {
      if (result) {
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
      } else {
        console.log(error.data);
      }
    });

    //add brand function
    $scope.signupSubmit = function ($event) {
      $event.preventDefault();
      var formData = new FormData();
      formData.append("image", $scope.formData.image);
      formData.append("email", $scope.email);
      formData.append("name", $scope.name);
      formData.append("category", $scope.category);
      formData.append("phoneNumber", $scope.phoneNumber);
      formData.append("address", $scope.phoneNumber);

      superadminService.addBrand(formData, function (result, error) {
        console.log(formData);
        if (result) {
          console.log(result);
          alert("successfuly registered");
        } else {
          console.log(error.data);
          alert(error.data);
        }
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

      superadminService.addBrandAdmin(data, function (result, error) {
        if (result) {
          superadminService.updateBrandAdmin(
            updatedBrandData,
            function (result, error) {
              if (result) {
                alert("Successfully added admin");
              } else {
                console.log(error);
              }
            }
          );
        } else {
          console.log(error);
        }
      });
    };

    $scope.disableString = "disable";
    $scope.enableString = "enable";

    $scope.updateAndDelete = function (brandId, brandName, process) {
      console.log("clicked");
      $scope.brandIdToD = brandId;
      $scope.brandNameToD = brandName;
      $scope.process = process;
    };

    $scope.deleteBrand = function () {
      console.log("clicked delete fun");
      $http
        .put(
          "http://localhost:3000/deletebrand/" + $scope.brandIdToD,
          {},
          config
        )
        .then(function (result) {
          alert("succesfully deleted");
          $(function () {
            $("#deleteModal").modal("hide");
          });
          var arr = $scope.currentBrandsWithAdmin;
          $scope.currentBrandsWithAdmin = arr.filter(function (elem) {
            return elem.brandId != $scope.brandIdToD;
          });
          var arr2 = $scope.currentBrandsWithNoAdmin;
          $scope.currentBrandsWithNoAdmin = arr2.filter(function (elem) {
            return elem.brandId != $scope.brandIdToD;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.disableBrand = function () {
      if ($scope.process == "disable") {
        console.log("clicked disable fun");
        $http
          .put(
            "http://localhost:3000/disablebrand/" + $scope.brandIdToD,
            {},
            config
          )
          .then(function (result) {
            alert("successfully marked as disable");
            $(function () {
              $("#disableModal").modal("hide");
            });

            //reflecting changes in frontend
            $scope.currentBrandsWithAdmin.forEach(function (elem) {
              if (elem.brandId == $scope.brandIdToD) {
                elem.isDisabled = true;
              }
            });
            $scope.currentBrandsWithNoAdmin.forEach(function (elem) {
              if (elem.brandId == $scope.brandIdToD) {
                elem.isDisabled = true;
              }
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        console.log("clicked enable fun");
        $http
          .put(
            "http://localhost:3000/enablebrand/" + $scope.brandIdToD,
            {},
            config
          )
          .then(function (result) {
            alert("successfully marked as enable");
            $(function () {
              $("#disableModal").modal("hide");
            });

            //reflecting changes in frontend
            $scope.currentBrandsWithAdmin.forEach(function (elem) {
              if (elem.brandId == $scope.brandIdToD) {
                elem.isDisabled = false;
              }
            });
            $scope.currentBrandsWithNoAdmin.forEach(function (elem) {
              if (elem.brandId == $scope.brandIdToD) {
                elem.isDisabled = false;
              }
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    };
  },
]);
