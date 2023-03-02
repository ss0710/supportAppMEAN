///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />

app.controller("ManagerAgents", [
  "$scope",
  "$http",
  "$location",
  "managerService",
  function ($scope, $http, $location, managerService) {
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

    managerService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "manager") {
          console.log("running");
          // $location.path("/noaccess");
        } else {
          $scope.brandManagerName = result.data.userName;
          $scope.brandManagerEmail = result.data.email;
          $scope.brandId = result.data.brand.brandId;
          $scope.brandName = result.data.brand.name;
          $scope.brandEmail = result.data.brand.email;
          $scope.brandPhoneNumber = result.data.brand.phoneNumber;
          $scope.brandCategory = result.data.brand.category;
          $scope.brandAddress = result.data.brand.address;

          managerService.getAgents($scope.brandId, function (result, error) {
            if (result) {
              $scope.agents = result.data;
              console.log($scope.agents);
            } else {
              console.log(error);
            }
          });
        }
      } else {
        console.log(error);
      }
    });

    //add brand Agents
    $scope.addBrandAgent = function () {
      // var data = {
      //   email: $scope.agentEmail,
      //   userName: $scope.agentName,
      //   password: $scope.password,
      //   brandId: $scope.brandId,
      //   brandEmail: $scope.brandEmail,
      //   brandName: $scope.brandName,
      //   brandCategory: $scope.brandCategory,
      //   brandPhoneNumber: $scope.brandPhoneNumber,
      //   brandAddress: $scope.brandAddress,
      // };

      var formData = new FormData();
      formData.append("image", $scope.formData.image);
      formData.append("email", $scope.agentEmail);
      formData.append("userName", $scope.agentName);
      formData.append("password", $scope.password);
      formData.append("brandId", $scope.brandId);
      formData.append("brandEmail", $scope.brandEmail);
      formData.append("brandName", $scope.brandName);
      formData.append("brandCategory", $scope.brandCategory);
      formData.append("brandPhoneNumber", $scope.brandPhoneNumber);
      formData.append("brandAddress", $scope.brandAddress);

      // managerService.addAgents(data, function (result, error) {
      //   if (result) {
      //     alert("Successfully added Agent");
      //   } else {
      //     console.log(error.data);
      //     alert(error.data);
      //   }
      // });
      $http({
        method: "POST",
        url: "http://localhost:3000/addagents",
        headers: {
          "Content-Type": undefined,
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      }).then(
        function (response) {
          // handle server response
          alert("Successfully added agent");
        },
        function (error) {
          console.log(error.data);
          alert(error.data);
        }
      );
    };
    //side nav bar
    $scope.openNav = function () {
      console.log("open fun called");
      document.getElementById("mySidepanel").style.width = "450px";
    };

    $scope.closeNav = function () {
      console.log("close fun called");
      document.getElementById("mySidepanel").style.width = "0";
    };
  },
]);
