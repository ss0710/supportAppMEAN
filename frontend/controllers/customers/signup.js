///<reference path="../app.js" />
///<reference path="../../services/stats/stats.service.js" />
///<reference path="../../services/toast/toast.service.js" />
///<reference path="../../factory/user/user.js" />

app.controller("customerSignup", [
  "$scope",
  "statsService",
  "$timeout",
  "toastService",
  "UserFactory",
  "$location",
  function (
    $scope,
    statsService,
    $timeout,
    toastService,
    UserFactory,
    $location
  ) {
    $scope.brandTableBool = false;
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    var timeout = null;
    $scope.brandNameChangeHandler = function () {
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        statsService.searchBrandfromAdmin(
          $scope.brandSearchName,
          function (result, error) {
            if (result) {
              $scope.brandTableBool = true;
              $scope.brandList = result.data;
              console.log(result.data);
            } else {
              console.log(error);
            }
          }
        );
      }, 500);
    };

    $scope.hideList = function () {
      $scope.brandTableBool = false;
      $scope.brandList = [];
      $scope.brandSearchName = "";
    };

    $scope.selectBrand = function (brand) {
      $scope.slectedBrand = brand;
      $scope.brandSearchName = brand.name;
      $scope.brandTableBool = false;
      $scope.brandList = [];
    };

    $scope.loginHandler = function () {
      if ($scope.brandSearchName == "" || !$scope.brandSearchName) {
        toastService.errorMessage("Select your brand!!");
      } else {
        UserFactory.addCustomerFactory(
          $scope.slectedBrand,
          $scope.user,
          function (result, error) {
            if (result) {
              toastService.successMessage("Successfully Registered!!");
              $scope.user = {};
              $location.path("/customerlogin");
              $scope.myForm.$setPristine();
            } else {
              console.log(error);
              toastService.errorMessage(error);
            }
          }
        );
      }
    };
  },
]);
