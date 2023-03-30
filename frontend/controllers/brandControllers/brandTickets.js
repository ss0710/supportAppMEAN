///<reference path="../app.js" />
///<reference path="../../services/brands/brand.service.js"/>

app.controller("brandTickets", [
  "$scope",
  "$location",
  "brandService",
  "$timeout",
  "$http",
  function ($scope, $location, brandService, $timeout, $http) {
    $scope.pageNumber = 1;
    $scope.pageSize = 5;
    $scope.selectedStatus = "";
    $scope.searchManagerName = "";
    $scope.searchAgentName = "";
    $scope.managerListShow = false;
    $scope.agentListShow = false;
    $scope.currentManagers = [];
    var timeout;

    var token = localStorage.getItem("token");

    var config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json;odata=verbose",
      },
    };

    $scope.updateManagerDetailsHandler = function (item, process) {
      $scope.updateManagerDetails = item;
      $scope.process = process;
    };

    brandService.getUserType(function (result, error) {
      if (result) {
        if (result.data.role != "brandAdmin") {
          $location.path("/noaccess");
        } else {
          $scope.adminDetails = result.data;
          $scope.searchHandler(1, 5);
        }
      } else {
        console.log(error);
      }
    });

    $scope.onManagerChange = function () {
      $scope.managerListShow = true;
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function () {
        brandService.searchManager(
          $scope.adminDetails.brand.name,
          $scope.searchManagerName,
          function (result, error) {
            if (result) {
              console.log(result.data);
              $scope.currentManagers = result.data;
            } else {
              console.log(error);
            }
          }
        );
      }, 500);
    };

    var timeout1;
    $scope.onAgentChange = function () {
      $scope.agentListShow = true;

      if (timeout1) {
        $timeout.cancel(timeout1);
      }
      timeout1 = $timeout(function () {
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
      }, 500);
    };

    $scope.selectManager = function (manager) {
      $scope.searchManagerName = manager.userName;
      $scope.managerListShow = false;
    };

    $scope.selectAgent = function (agent) {
      $scope.searchAgentName = agent.userName;
      $scope.agentListShow = false;
    };

    $scope.nextButton = function () {
      $scope.pageNumber++;
      $scope.searchHandler($scope.pageNumber, $scope.pageSize);
    };

    $scope.searchHandler = function (pageNumber, pageSize) {
      $http
        .get(
          "http://localhost:3000/filtertickets?brandName=" +
            $scope.adminDetails.brand.name +
            "&status=" +
            $scope.selectedStatus +
            "&managername=" +
            $scope.searchManagerName +
            "&agentname=" +
            $scope.searchAgentName +
            "&pageNumber=" +
            pageNumber +
            "&pageSize=" +
            pageSize,
          config
        )
        .then(function (result) {
          $scope.ticketResult = result.data.data;
          $scope.pageNumber = result.data.pageNumber;
          $scope.pageSize = result.data.pageSize;
          $scope.totalCount = result.data.totalCount;
          console.log($scope.ticketResult);
          $scope.lastPage = brandService.LastPageNumber(
            $scope.totalCount,
            $scope.pageSize
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.getPages = function () {
      var pages = [];
      var pageCount = Math.ceil($scope.totalCount / $scope.pageSize);
      for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
      return pages;
    };

    $scope.detailsUpdateForModal = function (ticket) {
      $scope.ticketDetails = ticket;

      brandService.getComments(
        $scope.ticketDetails.ticketId,
        function (result, error) {
          if (result) {
            $scope.ticketComments = result.data;
          } else {
            console.log(error);
          }
        }
      );

      $http
        .get(
          "http://localhost:3000/getlogsbyticket/" +
            $scope.ticketDetails.ticketId,
          config
        )
        .then(function (result) {
          $scope.logs = result.data;
          console.log("logs");
          console.log($scope.logs);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.isAssigned = function (agentName) {
      if (agentName == "") {
        return "Not Assigned";
      } else {
        return agentName;
      }
    };
  },
]);
