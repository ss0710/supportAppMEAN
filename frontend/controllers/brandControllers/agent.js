///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js"/>

app.controller("brandAdminAgent", [
  "$scope",
  "$http",
  "$location",
  "brandService",
  "$timeout",
  function ($scope, $http, $location, brandService, $timeout) {
    var token = localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.totalCount = 0;

    brandService.getUserType(function (result, error) {
      if (result) {
        console.log("brandAdmin - Agent Page");
        $scope.brandAdminDetails = result.data;
        brandService.getBrandAgents(
          $scope.brandAdminDetails.brand.brandId,
          $scope.pageNumber,
          $scope.pageSize,
          function (result1, error) {
            console.log("callback function");
            if (result1) {
              console.log("result1");
              console.log(result1);
              $scope.agentDetails = result1.data.data;
              $scope.pageNumber = result1.data.pageNumber;
              $scope.pageSize = result1.data.pageSize;
              $scope.totalCount = result1.data.totalCount;
              $scope.lastPageNumber($scope.totalCount, $scope.pageSize);
            } else {
              console.log("fetching agent error");
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

    $scope.lastPageNumber = function (totalCount, pageSize) {
      if (totalCount % pageSize == 0) {
        $scope.lastPage = totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        $scope.lastPage = Math.ceil(r - 0.1);
      }
    };

    $scope.disableString = "disable";
    $scope.enableString = "enable";

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
            $scope.agentDetails = result.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }, 800);
    };

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
            $scope.agentDetails.forEach(function (elem) {
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
            $scope.agentDetails.forEach(function (elem) {
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
          var arr = $scope.agentDetails.filter(function (elem) {
            return elem._id != $scope.agentDeatilsForUpdates._id;
          });
          $scope.agentDetails = arr;
          $(function () {
            $("#deleteModal").modal("hide");
          });
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };
  },
]);
