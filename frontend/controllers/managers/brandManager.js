///<reference path="../app.js" />

app.controller("brandManager", [
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
    $scope.handleActiveButton = function (id) {
      if (id == 1) {
        $scope.classname1 = $scope.activeClassname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
      } else if (id == 2) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.activeClassname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.classname;
      } else if (id == 3) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.activeClassname;
        $scope.classname4 = $scope.classname;
      } else if (id == 4) {
        $scope.classname1 = $scope.classname;
        $scope.classname2 = $scope.classname;
        $scope.classname3 = $scope.classname;
        $scope.classname4 = $scope.activeClassname;
      }
    };

    var token = localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    //toggle handler
    $scope.onlineStatus = "online";
    $scope.toggleHandler = function () {
      console.log($scope.onlineStatus);
      if ($scope.onlineStatus == "online") {
        $scope.onlineStatus = "offline";
      } else {
        $scope.onlineStatus = "online";
      }
    };

    //to get brandmanager informations
    $scope.brandManagerName,
      $scope.brandManagerEmail,
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
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.brandManagerName = result.data.userName;
          $scope.brandManagerEmail = result.data.email;
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

    $scope.logout = function () {
      localStorage.removeItem("token");
      $location.path("/login");
    };
  },
]);
