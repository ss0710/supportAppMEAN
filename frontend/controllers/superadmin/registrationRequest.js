///<reference path="../app.js" />
///<reference path="../../services/superadmin/superadmin.service.js"/>
///<reference path="../../services/toast/toast.service.js"/>

app.controller("registrationRequest", [
  "$scope",
  "superadminService",
  "toastService",
  function ($scope, superadminService, toastService) {
    $scope.Approve = "approve";
    $scope.Cancel = "cancel";
    superadminService.getRegistrationRequests(1, 5, function (result, error) {
      if (result) {
        console.log(result.data.data);
        $scope.brandRequests = result.data.data;
      } else {
        console.log(error);
      }
    });

    $scope.updateBrandDetailsForModal = function (brandDetails) {
      $scope.brandDetails = brandDetails;
    };

    $scope.actionModalFunction = function (brandDetails, action) {
      $scope.brandDetails = brandDetails;
      if (action == "cancel") {
        $scope.action = "cancel";
      } else {
        $scope.action = "approve";
      }
    };

    $scope.approveBrand = function () {
      if ($scope.action == "approve") {
        superadminService.approveBrandRequest(
          $scope.brandDetails.name,
          function (result, error) {
            if (result) {
              console.log("approved");
              $(function () {
                $("#actionModal").modal("hide");
              });
              toastService.successMessage("Brand approved!!");
              var arr = $scope.brandRequests.filter(function (elem) {
                return elem.name != $scope.brandDetails.name;
              });
              $scope.brandRequests = arr;
            } else {
              console.log(error);
              $(function () {
                $("#actionModal").modal("hide");
              });
              toastService.errorMessage(
                "Somethig went wrong!! try again later"
              );
            }
          }
        );
      } else {
        superadminService.cancelBrandRequest(
          $scope.brandDetails.name,
          function (result, error) {
            if (result) {
              console.log("canceled");
              $(function () {
                $("#actionModal").modal("hide");
              });
              toastService.successMessage("Registration rejected");
              var arr = $scope.brandRequests.filter(function (elem) {
                return elem.name != $scope.brandDetails.name;
              });
              $scope.brandRequests = arr;
            } else {
              console.log(error);
              $(function () {
                $("#actionModal").modal("hide");
              });
              toastService.errorMessage(
                "Somethig went wrong!! try again later"
              );
            }
          }
        );
      }
    };
  },
]);
