///<reference path="../app.js" />
///<reference path="../../services/superadmin/superadmin.service.js"/>

app.controller("SuperadminBrand", [
  "$scope",
  "superadminService",
  function ($scope, superadminService) {
    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.disableString = "disable";
    $scope.enableString = "enable";
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //Update Handler for Modal details
    $scope.brandDataUpdatesForModal = function (item) {
      $scope.brandDetails = item;
    };

    //getting brands
    superadminService.getActiveBrands(
      $scope.pageNumber,
      $scope.pageSize,
      function (result, error) {
        if (result) {
          $scope.currentBrandsWithAdmin = result.data.data;
          $scope.pageNumber = result.data.pageNumber;
          $scope.pageSize = result.data.pageSize;
          $scope.totalCount = result.data.totalCount;
          superadminService.LastPageNumber(
            $scope.totalCount,
            $scope.pageSize,
            function (result) {
              $scope.lastPage = result;
            }
          );
        } else {
          console.log(error.data);
        }
      }
    );

    $scope.getActiveBrands = function (pageNumber, pageSize) {
      superadminService.getActiveBrands(
        pageNumber,
        pageSize,
        function (result, error) {
          if (result) {
            $scope.currentBrandsWithAdmin = result.data.data;
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

    $scope.updateAndDelete = function (brandId, brandName, process) {
      console.log("clicked");
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
            } else {
              console.log(error);
            }
          }
        );
      } else {
        console.log("clicked enable fun");
        superadminService.enableBrand(
          $scope.brandNameToD,
          function (result, error) {
            if (result) {
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
            } else {
              console.log(error);
            }
          }
        );
      }
    };
  },
]);
