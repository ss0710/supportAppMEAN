///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js"/>

app.controller("brandAdminAgent", [
  "$scope",
  "$http",
  "brandService",
  "$timeout",
  function ($scope, $http, brandService, $timeout) {
    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.totalCount = 0;
    $scope.disableString = "disable";
    $scope.enableString = "enable";

    brandService.getUserType(function (result, error) {
      if (result) {
        $scope.brandAdminDetails = result.data;
        brandService.getBrandAgents(
          $scope.brandAdminDetails.brand.name,
          $scope.pageNumber,
          $scope.pageSize,
          function (result1, error) {
            if (result1) {
              $scope.agentDetails = result1.data.data;
              $scope.pageNumber = result1.data.pageNumber;
              $scope.pageSize = result1.data.pageSize;
              $scope.totalCount = result1.data.totalCount;
              $scope.lastPage = brandService.LastPageNum(
                $scope.totalCount,
                $scope.pageSize
              );
            } else {
              console.log(error);
            }
          }
        );
      } else {
        console.log(error);
      }
    });

    $scope.getAgentData = function (pageNumber, pageSize) {
      brandService.getBrandAgents(
        $scope.brandAdminDetails.brand.brandId,
        pageNumber,
        pageSize,
        function (result1, error) {
          if (result1) {
            console.log(result1);
            $scope.agentDetails = result1.data.data;
            $scope.pageNumber = result1.data.pageNumber;
            $scope.pageSize = result1.data.pageSize;
            $scope.totalCount = result1.data.totalCount;
          } else {
            console.log(data);
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

    $scope.AgentDetailsUpdate = function (details, process) {
      $scope.agentDeatilsForUpdates = details;
      $scope.process = process;
    };

    var timeout;
    $scope.onChangeHandler = function () {
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        brandService.searchAgent(
          $scope.brandId,
          $scope.searchAgentName,
          function (result, error) {
            if (result) {
              $scope.agentDetails = result.data;
            } else {
              console.log(error);
            }
          }
        );
      }, 500);
    };

    //to disable brand
    $scope.disableAgent = function (process) {
      if (process == $scope.disableString) {
        brandService.disableAgents(
          $scope.agentDeatilsForUpdates._id,
          function (result, error) {
            if (result) {
              alert("manager disabled");
              $scope.agentDetails.forEach(function (elem) {
                if (elem._id == $scope.agentDeatilsForUpdates._id) {
                  elem.isDisabled = true;
                }
              });
              $(function () {
                $("#disableModal").modal("hide");
              });
            } else {
              onsole.log(error.data);
            }
          }
        );
      } else {
        brandService.enableAgents(
          $scope.agentDeatilsForUpdates._id,
          function (result, error) {
            if (result) {
              alert("manager disabled");
              $scope.agentDetails.forEach(function (elem) {
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

    $scope.deleteAgent = function () {
      brandService.deleteAgents(
        $scope.agentDeatilsForUpdates._id,
        function (result, error) {
          if (result) {
            alert("manager deleted");
            var arr = $scope.agentDetails.filter(function (elem) {
              return elem._id != $scope.agentDeatilsForUpdates._id;
            });
            $scope.agentDetails = arr;
            $(function () {
              $("#deleteModal").modal("hide");
            });
          } else {
            console.log(error.data);
          }
        }
      );
    };
  },
]);
