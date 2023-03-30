///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js"/>

app.controller("manager", [
  "$scope",
  "$location",
  "brandService",
  "$timeout",
  function ($scope, $location, brandService, $timeout) {
    $scope.disableString = "disable";
    $scope.enableString = "enable";
    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    $scope.currentManagers = [];

    $scope.updateManagerDetailsHandler = function (item, process) {
      $scope.updateManagerDetails = item;
      $scope.process = process;
    };

    brandService.getUserType(function (result, error) {
      if (result) {
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
          $scope.getManagerData($scope.pageNumber, $scope.pageSize);
        }
      } else {
        console.log(error);
      }
    });

    var timeout;
    $scope.onChangeHandler = function () {
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        brandService.searchManager(
          $scope.brandId,
          $scope.searchManagerName,
          function (result, error) {
            if (result) {
              console.log(result.data);
              $scope.currentManagers = result.data;
            } else {
              console.log(error);
            }
          }
        );
      }, 500);
    };

    $scope.getManagerData = function (pageNumber, pageSize) {
      brandService.getManagers(
        $scope.brandName,
        pageNumber,
        pageSize,
        function (result, error) {
          if (result) {
            $scope.currentManagers = result.data.data;
            $scope.pageNumber = result.data.pageNumber;
            $scope.pageSize = result.data.pageSize;
            $scope.totalCount = result.data.totalCount;
            $scope.lastPage = brandService.LastPageNumber(
              $scope.totalCount,
              $scope.pageSize
            );
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

    //add brand Managers
    $scope.addBrandManager = function () {
      brandService.addBrandManagers(
        $scope.formData.image,
        $scope.managerEmail,
        $scope.managerName,
        $scope.firstName,
        $scope.lastName,
        $scope.phoneNumber,
        $scope.password,
        $scope.brandId,
        $scope.brandEmail,
        $scope.brandName,
        $scope.brandCategory,
        $scope.brandPhoneNumber,
        $scope.brandAddress,
        function (result, error) {
          if (result) {
            alert("manager added succesfully");
            console.log("runnint");
            $(function () {
              $("#addManagerModal").modal("hide");
            });
            $scope.currentManagers.unshift(result.data);
            console.log($scope.currentManagers);
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.ManagerDetail;
    $scope.managerDetailsupdate = function (details) {
      console.log("clickded");
      $scope.ManagerDetail = details;
      console.log(details);
    };

    //to disable brand
    $scope.disableManager = function (process) {
      if (process == $scope.disableString) {
        brandService.disableManagers(
          $scope.updateManagerDetails._id,
          function (result, error) {
            if (result) {
              alert("manager disabled");
              $scope.currentManagers.forEach(function (elem) {
                if (elem._id == $scope.updateManagerDetails._id) {
                  elem.isDisabled = true;
                }
              });
              $(function () {
                $("#disableModal").modal("hide");
              });
            } else {
              console.log(error.data);
            }
          }
        );
      } else {
        brandService.permitManagers(
          $scope.updateManagerDetails._id,
          function (result, error) {
            if (result) {
              alert("manager disabled");
              $scope.currentManagers.forEach(function (elem) {
                if (elem._id == $scope.updateManagerDetails._id) {
                  elem.isDisabled = false;
                }
              });
              $(function () {
                $("#disableModal").modal("hide");
              });
            } else {
              console.log(error.data);
            }
          }
        );
      }
    };

    $scope.deleteManager = function () {
      brandService.deleteManagers(
        $scope.updateManagerDetails._id,
        function (result, error) {
          if (result) {
            alert("manager deleted");
            var arr = $scope.currentManagers.filter(function (elem) {
              return elem._id != $scope.updateManagerDetails._id;
            });
            $scope.currentManagers = arr;
            $(function () {
              $("#deleteModal").modal("hide");
            });
          } else {
            console.log(error.data);
          }
        }
      );
    };
  },
]);
