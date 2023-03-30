///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js"/>

app.controller("brandAdmin", [
  "$scope",
  "$http",
  "$location",
  "brandService",
  function ($scope, $http, $location, brandService) {
    //Handling sidebar button css
    $scope.activeClassname =
      "btn btn-outline-primary brandAdmin-sidebar-buttons-active";
    $scope.classname = "btn btn-outline-primary brandAdmin-sidebar-buttons";
    $scope.classname1 = $scope.activeClassname;
    $scope.classname2 = $scope.classname;
    $scope.classname3 = $scope.classname;
    $scope.classname4 = $scope.classname;
    $scope.classname5 = $scope.classname;
    $scope.classname6 = $scope.classname;
    $scope.handleActiveButton = function (id) {
      if (id == 1) {
        $scope.classname1 = $scope.activeClassname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.classname;
        $scope.classname6 = $scope.classname;
      } else if (id == 2) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.activeClassname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.classname;
        $scope.classname6 = $scope.classname;
      } else if (id == 3) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.activeClassname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.classname;
        $scope.classname6 = $scope.classname;
      } else if (id == 4) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.activeClassname;
        $scope.classname5 = $scope.classname;
        $scope.classname6 = $scope.classname;
      } else if (id == 5) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.activeClassname;
        $scope.classname6 = $scope.classname;
      } else {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.classname;
        $scope.classname6 = $scope.activeClassname;
      }
    };

    //to get brandAdmin informations
    brandService.getUserType(function (result, error) {
      console.log("running brandAdmin.js getuserType");
      if (result) {
        if (result.data.role != "brandAdmin") {
          $location.path("/noaccess");
        } else {
          $scope.brandAdminDetails = result.data;
          console.log("brandAdmin");
          console.log($scope.brandAdminDetails);
        }

        brandService.getBrandDetails(
          $scope.brandAdminDetails.brand.name,
          function (result, error) {
            if (result) {
              $scope.brandlogo = result.data[0].brandLogo;
            } else {
              console.log(error);
            }
          }
        );
      } else {
        console.log(error);
      }
    });

    //logout function
    $scope.logout = function () {
      localStorage.removeItem("token");
      $location.path("/login");
    };
  },
]);
