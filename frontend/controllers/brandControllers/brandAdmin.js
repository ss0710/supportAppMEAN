///<reference path="../app.js" />

app.controller("brandAdmin", [
  "$scope",
  "$http",
  "$location",
  function ($scope, $http, $location) {
    //Handling sidebar button css
    $scope.activeClassname =
      "btn btn-outline-primary brandAdmin-sidebar-buttons-active";
    $scope.classname = "btn btn-outline-primary brandAdmin-sidebar-buttons";
    $scope.classname1 = $scope.activeClassname;
    $scope.classname2 = $scope.classname;
    $scope.classname3 = $scope.classname;
    $scope.classname4 = $scope.classname;
    $scope.classname5 = $scope.classname;
    $scope.handleActiveButton = function (id) {
      if (id == 1) {
        $scope.classname1 = $scope.activeClassname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.classname;
      } else if (id == 2) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.activeClassname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.classname;
      } else if (id == 3) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.activeClassname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.classname;
      } else if (id == 4) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.activeClassname;
        $scope.classname5 = $scope.classname;
      } else {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
        $scope.classname5 = $scope.activeClassname;
      }
    };

    var token = localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    //to get brandAdmin informations
    $scope.brandAdminName,
      $scope.brandAdminEmail,
      $scope.brandId,
      $scope.brandName,
      $scope.brandEmail,
      $scope.brandPhoneNumber,
      $scope.brandCategory,
      $scope.brandAddress;

    $http
      .get("http://localhost:3000/usertype", config)
      .then(function (result) {
        console.log(result.data);
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
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    //logout function
    $scope.logout = function () {
      localStorage.removeItem("token");
      $location.path("/login");
    };
  },
]);
