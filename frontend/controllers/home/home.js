///<reference path="../app.js" />
///<reference path="../../services/toast/toast.service.js" />
///<reference path="../../factory/brand/brand.js"

app.controller("homePage", [
  "$scope",
  "brandFactory",
  "toastService",
  function ($scope, brandFactory, toastService) {
    $scope.submitString = true;

    $scope.formData = {
      image: null,
    };
    $scope.onSubmitBrand = function () {
      console.log("function called in controller");
      if ($scope.formData.image == null) {
        toastService.errorMessage("Select Brand Logo");
      } else {
        $scope.submitString = false;
        brandFactory.addBrandFactory(
          $scope.formData.image,
          $scope.brand,
          function (result, error) {
            $scope.submitString = true;
            if (result) {
              $(function () {
                $("#addBrandModal").modal("hide");
              });
              toastService.successMessage("successfully registered");
            } else {
              $scope.submitString = true;
              toastService.errorMessage(error);
            }
          }
        );
      }
    };
  },
]);
