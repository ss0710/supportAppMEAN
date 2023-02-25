///<reference path="../app.js" />

app.controller("ManagerAgents", [
  "$scope",
  "$http",
  "$location",
  function ($scope, $http, $location) {
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    $scope.agents = [];
    var token = localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
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
          $http
            .get(`http://localhost:3000/getagents/${$scope.brandId}`, config)
            .then(function (result) {
              $scope.agents = result.data;
              console.log($scope.agents);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    //add brand Managers
    $scope.addBrandAgent = function () {
      var data = {
        email: $scope.agentEmail,
        userName: $scope.agentName,
        password: $scope.password,
        brandId: $scope.brandId,
        brandEmail: $scope.brandEmail,
        brandName: $scope.brandName,
        brandCategory: $scope.brandCategory,
        brandPhoneNumber: $scope.brandPhoneNumber,
        brandAddress: $scope.brandAddress,
      };
      $http
        .post("http://localhost:3000/addagents", data, config)
        .then(function (result) {
          alert("Successfully added Agent");
        })
        .catch(function (error) {
          console.log(error.data);
          alert(error.data);
        });
    };
  },
]);
