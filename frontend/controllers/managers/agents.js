///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />
///<reference path="../../services/toast/toast.service.js" />

app.controller("ManagerAgents", [
  "$scope",
  "managerService",
  "$timeout",
  "toastService",
  function ($scope, managerService, $timeout, toastService) {
    $scope.emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    $scope.agents = [];
    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.disableString = "disable";
    $scope.enableString = "enable";

    managerService.getUserType(function (result, error) {
      if (result) {
        console.log(result.data);
        if (result.data.role != "manager") {
          console.log("running");
          // $location.path("/noaccess");
        } else {
          $scope.BrandMnagerDetails = result.data;
          managerService.getAgents(
            $scope.BrandMnagerDetails.brand.name,
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

    //to get agent data
    $scope.getAgentData = function (pageNumber, pageSize) {
      managerService.getAgents(
        $scope.BrandMnagerDetails.brand.name,
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

    //to get pages
    $scope.getPages = function () {
      var pages = [];
      var pageCount = Math.ceil($scope.totalCount / $scope.pageSize);
      for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
      return pages;
    };

    //get lastPageNumber
    $scope.lastPageNumber = function (totalCount, pageSize) {
      if (totalCount % pageSize == 0) {
        $scope.lastPage = totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        $scope.lastPage = Math.ceil(r - 0.1);
      }
    };

    //search agent debouncing
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
        managerService.searchAgent(
          $scope.BrandMnagerDetails,
          $scope.searchAgentName,
          function (result, error) {
            if (result) {
              console.log(result.data);
              $scope.searchAgentDetails = result.data;
            } else {
              console.log(error);
            }
          }
        );
      }, 500);
    };

    //to update agent details
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
        managerService.updateAgentNameService(
          $scope.BrandMnagerDetails.brand.brandId,
          $scope.agentDeatilsForUpdates._id,
          $scope.updatedName,
          function (result, error) {
            if (result) {
              alert("Update successffull");
              console.log(result);
              $scope.updateText = "Update Name";
            } else {
              alert("something went wrong!!");
              console.log(error);
              $scope.updateText = "Update Name";
            }
          }
        );
      } else {
        alert("Update name to change");
      }
    };

    //to disable and enable agent
    $scope.disableAgent = function (process) {
      if (process == $scope.disableString) {
        managerService.disableBrandAgents(
          $scope.agentDeatilsForUpdates._id,
          function (result, error) {
            if (result) {
              $scope.agents.forEach(function (elem) {
                if (elem._id == $scope.agentDeatilsForUpdates._id) {
                  elem.isDisabled = true;
                }
              });
              $(function () {
                $("#disableModal").modal("hide");
              });
            } else {
              console.log(error.data);
            }
          }
        );
      } else {
        managerService.enableBrandAgent(
          $scope.agentDeatilsForUpdates._id,
          function (result, error) {
            if (result) {
              alert("manager disabled");
              $scope.agents.forEach(function (elem) {
                if (elem._id == $scope.agentDeatilsForUpdates._id) {
                  elem.isDisabled = false;
                }
              });
              $(function () {
                $("#disableModal").modal("hide");
              });
            } else {
              console.log(error.data);
            }
          }
        );
      }
    };

    //delete Agent
    $scope.deleteAgent = function () {
      managerService.deleteAgent(
        $scope.agentDeatilsForUpdates._id,
        function (result, error) {
          if (result) {
            alert("manager deleted");
            var arr = $scope.agents.filter(function (elem) {
              return elem._id != $scope.agentDeatilsForUpdates._id;
            });
            $scope.agents = arr;
            $(function () {
              $("#deleteModal").modal("hide");
            });
          } else {
            console.log(error.data);
          }
        }
      );
    };

    //add brand Agents
    $scope.buttonBool = false;
    $scope.formData = {
      image: null,
    };
    $scope.addBrandAgent = function () {
      if ($scope.formData.image == null) {
        toastService.errorMessage("Select Profile Image");
      } else {
        $scope.buttonBool = true;
        managerService.addBrandAgents(
          $scope.user,
          $scope.formData.image,
          $scope.BrandMnagerDetails,
          function (result, error) {
            if (result) {
              $scope.user = {};
              $scope.buttonBool = false;
              toastService.successMessage("Successfully added agent");
              $scope.agents.unshift(result.data);
              $(function () {
                $("#addAgentModal").modal("hide");
              });
            } else {
              $scope.buttonBool = false;
              console.log(error);
              toastService.errorMessage(error);
            }
          }
        );
      }
    };

    //side nav bar
    $scope.openNav = function () {
      console.log("open fun called");
      document.getElementById("mySidepanel").style.width = "450px";
    };

    //close nav bar
    $scope.closeNav = function () {
      console.log("close fun called");
      document.getElementById("mySidepanel").style.width = "0";
    };
  },
]);
