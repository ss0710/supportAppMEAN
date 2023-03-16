///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />

app.controller("ManagerAgents", [
  "$scope",
  "$http",
  "$location",
  "managerService",
  "$timeout",
  function ($scope, $http, $location, managerService, $timeout) {
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

    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.totalCount = 0;

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

          managerService.getAgents(
            $scope.brandId,
            $scope.pageNumber,
            $scope.pageSize,
            function (result, error) {
              if (result) {
                $scope.agents = result.data.data;
                $scope.pageNumber = result.data.pageNumber;
                $scope.pageSize = result.data.pageSize;
                $scope.totalCount = result.data.totalCount;

                $scope.lastPageNumber($scope.totalCount, $scope.pageSize);
              } else {
                console.log(error);
              }
            }
          );
        }
      } else {
        console.log(error);
      }
    });

    $scope.getAgentData = function (pageNumber, pageSize) {
      managerService.getAgents(
        $scope.brandId,
        pageNumber,
        pageSize,
        function (result1, error) {
          if (result1) {
            console.log(result1);
            $scope.agents = result1.data.data;
            $scope.pageNumber = result1.data.pageNumber;
            $scope.pageSize = result1.data.pageSize;
            $scope.totalCount = result1.data.totalCount;
          } else {
            console.log(error);
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

    $scope.lastPageNumber = function (totalCount, pageSize) {
      if (totalCount % pageSize == 0) {
        $scope.lastPage = totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        $scope.lastPage = Math.ceil(r - 0.1);
      }
    };

    var timeout;
    $scope.onChangeHandler = function () {
      if ($scope.searchAgentName == "") {
        $scope.searchAgentDetails = [];
        return;
      }
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        $http
          .get(
            "http://localhost:3000/searchagent?brandId=" +
              $scope.brandId +
              "&name=" +
              $scope.searchAgentName,
            config
          )
          .then(function (result) {
            console.log(result.data);
            $scope.searchAgentDetails = result.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }, 800);
    };

    $scope.disableString = "disable";
    $scope.enableString = "enable";

    $scope.AgentDetailsUpdate = function (details, process) {
      $scope.agentDeatilsForUpdates = details;
      $scope.process = process;
      //details for updating agents
      $scope.updatedEmail = $scope.agentDeatilsForUpdates.email;
      $scope.updatedName = $scope.agentDeatilsForUpdates.userName;
    };

    //to update agentMail
    $scope.updateAgentMail = function () {};
    $scope.updateText = "Update Name";
    //to update agentName
    $scope.updateAgentName = function () {
      if ($scope.updatedName != $scope.agentDeatilsForUpdates.userName) {
        $scope.updateText = "Updating..";
        $http
          .put(
            "http://localhost:3000/updateagentname?brandId=" +
              $scope.brandId +
              "&userId=" +
              $scope.agentDeatilsForUpdates._id,
            { userName: $scope.updatedName },
            config
          )
          .then(function (result) {
            alert("Update successffull");
            console.log(result);
            $scope.updateText = "Update Name";
          })
          .catch(function (error) {
            alert("something went wrong!!");
            console.log(error);
            $scope.updateText = "Update Name";
          });
      } else {
        alert("Update name to change");
      }
    };

    //to update agentPassword
    $scope.updateAgentPassword = function () {};

    //to disable brand
    $scope.disableAgent = function (process) {
      if (process == $scope.disableString) {
        $http
          .put(
            "http://localhost:3000/disableagent/" +
              $scope.agentDeatilsForUpdates._id,
            {},
            config
          )
          .then(function (result) {
            alert("manager disabled");
            $scope.agents.forEach(function (elem) {
              if (elem._id == $scope.agentDeatilsForUpdates._id) {
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
            "http://localhost:3000/enableagent/" +
              $scope.agentDeatilsForUpdates._id,
            {},
            config
          )
          .then(function (result) {
            alert("manager disabled");
            $scope.agents.forEach(function (elem) {
              if (elem._id == $scope.agentDeatilsForUpdates._id) {
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

    $scope.deleteAgent = function () {
      $http
        .put(
          "http://localhost:3000/deleteagent/" +
            $scope.agentDeatilsForUpdates._id,
          {},
          config
        )
        .then(function (result) {
          alert("manager deleted");
          var arr = $scope.agents.filter(function (elem) {
            return elem._id != $scope.agentDeatilsForUpdates._id;
          });
          $scope.agents = arr;
          $(function () {
            $("#deleteModal").modal("hide");
          });
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };

    //add brand Agents
    $scope.addBrandAgent = function () {
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
