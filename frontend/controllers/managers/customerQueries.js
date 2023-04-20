///<reference path="../app.js" />
///<reference path="../../services/managers/manager.service.js" />
///<reference path="../../factory/ticket/ticket.js" />

app.controller("customerQueries", [
  "$scope",
  "$location",
  "managerService",
  "ticketFactory",
  function ($scope, $location, managerService, ticketFactory) {
    //getting managers details
    managerService.getUserType(function (result, error) {
      if (result) {
        if (result.data.role != "manager") {
          $location.path("/noaccess");
        } else {
          $scope.brandManagerDetails = result.data;
          managerService.getCustomerQueries(
            $scope.brandManagerDetails.brand.name,
            function (result1, error1) {
              if (result1) {
                $scope.customerQueries = result1.data;
                console.log("customer queries are");
                console.log($scope.customerQueries);
              } else {
                console.log(error1);
              }
            }
          );
        }
      } else {
        console.log(error);
      }
    });

    //loading agents
    $scope.loadAgents = function (ticketDetails, pageNumber, pageSize) {
      $scope.ticketDetails = ticketDetails;
      managerService.getAgents(
        $scope.brandManagerDetails.brand.name,
        pageNumber,
        pageSize,
        function (result, error) {
          if (result) {
            $scope.globalAgents = result.data.data;
            $scope.agents = $scope.globalAgents;
            $scope.pageNumber1 = result.data.pageNumber;
            $scope.pageSize1 = result.data.pageSize;
            $scope.totalCount1 = result.data.totalCount;
            $scope.lastPage1 = $scope.lastPageNumber(
              $scope.totalCount1,
              $scope.pageSize1
            );
          } else {
            console.log(error);
          }
        }
      );
    };

    $scope.getPages1 = function () {
      var pages = [];
      var pageCount = Math.ceil($scope.totalCount1 / $scope.pageSize1);
      for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
      return pages;
    };

    $scope.lastPageNumber = function (totalCount, pageSize) {
      if (totalCount % pageSize == 0) {
        return totalCount / pageSize;
      } else {
        var r = totalCount / pageSize;
        return Math.ceil(r - 0.1);
      }
    };

    $scope.assignCustomer = function (agentDetails) {
      ticketFactory.assignQueryToAgents(
        $scope.brandManagerDetails,
        agentDetails,
        $scope.ticketDetails,
        function (result, error) {
          if (result) {
            console.log("assigned");
          } else {
            console.log(error);
          }
        }
      );
    };
  },
]);
