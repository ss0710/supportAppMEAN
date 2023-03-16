///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js" />

app.controller("manager", [
  "$scope",
  "$http",
  "$location",
  "brandService",
  "$timeout",
  function ($scope, $http, $location, brandService, $timeout) {
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

    //to get enable and disable manager information
    $scope.updateManagerDetails;
    $scope.disableString = "disable";
    $scope.enableString = "enable";

    $scope.updateManagerDetailsHandler = function (item, process) {
      $scope.updateManagerDetails = item;
      $scope.process = process;
    };

    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.totalCount = 0;

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
              "http://localhost:3000/getmanager?brandId=" +
                $scope.brandId +
                "&pageNumber=" +
                $scope.pageNumber +
                "&pageSize=" +
                $scope.pageSize,
              config
            )
            .then(function (result) {
              console.log(result.data);
              $scope.currentManagers = result.data.data;
              $scope.pageNumber = result.data.pageNumber;
              $scope.pageSize = result.data.pageSize;
              $scope.totalCount = result.data.totalCount;

              $scope.lastPageNumber($scope.totalCount, $scope.pageSize);
            })
            .catch(function (error) {
              console.log(error.data);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    var timeout;
    $scope.onChangeHandler = function () {
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        $http
          .get(
            "http://localhost:3000/searchmanager?brandId=" +
              $scope.brandId +
              "&name=" +
              $scope.searchManagerName,
            config
          )
          .then(function (result) {
            console.log(result.data);
            $scope.currentManagers = result.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }, 800);
    };

    $scope.getManagerData = function (pageNumber, pageSize) {
      $http
        .get(
          "http://localhost:3000/getmanager?brandId=" +
            $scope.brandId +
            "&pageNumber=" +
            pageNumber +
            "&pageSize=" +
            pageSize,
          config
        )
        .then(function (result) {
          console.log(result.data);
          $scope.currentManagers = result.data.data;
          $scope.pageNumber = result.data.pageNumber;
          $scope.pageSize = result.data.pageSize;
          $scope.totalCount = result.data.totalCount;
        })
        .catch(function (error) {
          console.log(error.data);
        });
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

    //to disable brand
    $scope.disableManager = function (process) {
      if (process == $scope.disableString) {
        $http
          .put(
            "http://localhost:3000/disablemanager/" +
              $scope.updateManagerDetails._id,
            {},
            config
          )
          .then(function (result) {
            alert("manager disabled");
            $scope.currentManagers.forEach(function (elem) {
              if (elem._id == $scope.updateManagerDetails._id) {
                elem.isDisabled = true;
              }
            });
            $(function () {
              $("#disableModal").modal("hide");
            });
          })
          .catch(function (error) {
            console.log(error.data);
          });
      } else {
        $http
          .put(
            "http://localhost:3000/permitmanager/" +
              $scope.updateManagerDetails._id,
            {},
            config
          )
          .then(function (result) {
            alert("manager disabled");
            $scope.currentManagers.forEach(function (elem) {
              if (elem._id == $scope.updateManagerDetails._id) {
                elem.isDisabled = false;
              }
            });
            $(function () {
              $("#disableModal").modal("hide");
            });
          })
          .catch(function (error) {
            console.log(error.data);
          });
      }
    };

    $scope.deleteManager = function () {
      $http
        .put(
          "http://localhost:3000/deletemanager/" +
            $scope.updateManagerDetails._id,
          {},
          config
        )
        .then(function (result) {
          alert("manager deleted");
          var arr = $scope.currentManagers.filter(function (elem) {
            return elem._id != $scope.updateManagerDetails._id;
          });
          $scope.currentManagers = arr;
          $(function () {
            $("#deleteModal").modal("hide");
          });
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };
  },
]);
