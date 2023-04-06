///<reference path="../app.js" />
///<reference path="../../services/superadmin/superadmin.service.js"/>
///<reference path="../../services/toast/toast.service.js"/>

app.controller("inActiveBrand", [
  "$scope",
  "superadminService",
  "toastService",
  function ($scope, superadminService, toastService) {
    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.disableString = "disable";
    $scope.enableString = "enable";
    $scope.submitString = true;
    $scope.currentBrandsWithNoAdmin = [];
    $scope.currentBrandsWithNoAdmin = [];
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //getting brands
    superadminService.getInActiveBrands(
      $scope.pageNumber,
      $scope.pageSize,
      function (result, error) {
        if (result) {
          $scope.currentBrandsWithNoAdmin = result.data.data;
          $scope.pageNumber = result.data.pageNumber;
          $scope.pageSize = result.data.pageSize;
          $scope.totalCount = result.data.totalCount;
          $scope.lastPageNumber($scope.totalCount, $scope.pageSize);
        } else {
          console.log(error.data);
        }
      }
    );

    $scope.getInActiveBrands = function (pageNumber, pageSize) {
      superadminService.getInActiveBrands(
        pageNumber,
        pageSize,
        function (result, error) {
          if (result) {
            $scope.currentBrandsWithNoAdmin = result.data.data;
            $scope.pageNumber = result.data.pageNumber;
            $scope.pageSize = result.data.pageSize;
            $scope.totalCount = result.data.totalCount;
          } else {
            console.log(error.data);
          }
        }
      );
    };

    $scope.getPages = function () {
      var pages = [];
      var pageCount = Math.ceil($scope.totalCount / $scope.pageSize);
      for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
      return pages;
    };

    $scope.lastPageNumber = function (totalCount, pageSize) {
      if (totalCount % pageSize == 0) {
        $scope.lastPage = totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        $scope.lastPage = Math.ceil(r - 0.1);
      }
    };

    //add brand function
    $scope.formData = {
      image: null,
    };
    $scope.signupSubmit = function () {
      if ($scope.formData.image == null) {
        toastService.errorMessage("Select Brand Logo");
      } else {
        $scope.submitString = false;
        superadminService.addBrand(
          $scope.formData.image,
          $scope.brand,
          function (result, error) {
            if (result) {
              $scope.submitString = true;
              console.log(result.data);
              $(function () {
                $("#addBrandModal").modal("hide");
              });
              toastService.successMessage("successfuly registered");
              $scope.currentBrandsWithNoAdmin.unshift(result.data);
              $scope.brand = {};
              $scope.myForm1.$setPristine();
            } else {
              $scope.submitString = true;
              toastService.errorMessage(error);
            }
          }
        );
      }
    };

    //updating brand scopes
    $scope.updateBrandScopes = function (brand) {
      $scope.brandDetails = brand;
    };

    //add brand Admin
    $scope.addBrandAdmin = function () {
      $scope.submitString = false;
      superadminService.addBrandAdmin(
        $scope.admin,
        $scope.brandDetails,
        function (result, error) {
          if (result) {
            superadminService.updateBrandAdmin(
              $scope.brandDetails,
              function (result, error) {
                if (result) {
                  $scope.submitString = true;
                  toastService.successMessage("Successfully added admin");
                  $(function () {
                    $("#addBrandAdminModal").modal("hide");
                  });
                } else {
                  $scope.submitString = true;
                  toastService.errorMessage(
                    "Cannot Process Requet!! Try after some time"
                  );
                  $(function () {
                    $("#addBrandAdminModal").modal("hide");
                  });
                }
              }
            );
            $scope.admin = {};
            $scope.myForm.$setPristine();
          } else {
            $scope.submitString = true;
            toastService.errorMessage(error);
          }
        }
      );
    };

    $scope.updateAndDelete = function (brandId, brandName, process) {
      $scope.brandIdToD = brandId;
      $scope.brandNameToD = brandName;
      $scope.process = process;
    };

    $scope.deleteBrand = function () {
      superadminService.deleteBrand(
        $scope.brandNameToD,
        function (result, error) {
          if (result) {
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
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.disableBrand = function () {
      if ($scope.process == "disable") {
        console.log("clicked disable fun");
        superadminService.disableBrand(
          $scope.brandNameToD,
          function (result, error) {
            if (result) {
              alert("successfully marked as disable");
              $(function () {
                $("#disableModal").modal("hide");
              });
              //reflecting changes in frontend
              if ($scope.currentBrandsWithAdmin) {
                $scope.currentBrandsWithAdmin.forEach(function (elem) {
                  if (elem.brandId == $scope.brandIdToD) {
                    elem.isDisabled = true;
                  }
                });
              }
              if ($scope.currentBrandsWithNoAdmin) {
                $scope.currentBrandsWithNoAdmin.forEach(function (elem) {
                  if (elem.brandId == $scope.brandIdToD) {
                    elem.isDisabled = true;
                  }
                });
              }
            } else {
              console.log(error);
            }
          }
        );
      } else {
        superadminService.enableBrand(
          $scope.brandNameToD,
          function (result, error) {
            if (result) {
              alert("successfully marked as enable");
              $(function () {
                $("#disableModal").modal("hide");
              });

              //reflecting changes in frontend
              if ($scope.currentBrandsWithAdmin) {
                $scope.currentBrandsWithAdmin.forEach(function (elem) {
                  if (elem.brandId == $scope.brandIdToD) {
                    elem.isDisabled = false;
                  }
                });
              }
              if ($scope.currentBrandsWithNoAdmin) {
                $scope.currentBrandsWithNoAdmin.forEach(function (elem) {
                  if (elem.brandId == $scope.brandIdToD) {
                    elem.isDisabled = false;
                  }
                });
              }
            } else {
              console.log(error);
            }
          }
        );
      }
    };
  },
]);
